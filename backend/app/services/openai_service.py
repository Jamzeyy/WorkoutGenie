import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file from the backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    # Log masked key for debugging
    masked_key = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
    print(f"[OpenAI] Using API key: {masked_key}")
    return OpenAI(api_key=api_key)


def generate_workout_plan(questionnaire_data: dict, cycle_type: str) -> dict:
    """Generate a personalized workout plan using ChatGPT."""
    
    cycle_weeks_map = {
        "weekly": 1,
        "monthly": 4,
        "bi-monthly": 8
    }
    cycle_weeks = cycle_weeks_map.get(cycle_type, 4)
    
    # For longer plans, create a template-based approach to avoid token limits
    weeks_instruction = ""
    if cycle_weeks > 1:
        weeks_instruction = f"""
IMPORTANT: To keep the response concise, for multi-week plans:
- Provide detailed workouts for Week 1 only
- For weeks 2-{cycle_weeks}, just provide the week theme and brief notes on progression changes
- Keep exercise descriptions brief (no lengthy form tips)"""
    
    # Build the prompt
    prompt = f"""Create a personalized {cycle_type} workout plan ({cycle_weeks} week(s)).

**User Profile:**
- Fitness Level: {questionnaire_data.get('fitness_level', 'intermediate')}
- Primary Goal: {questionnaire_data.get('primary_goal', 'general_fitness')}
- Workout Days Per Week: {questionnaire_data.get('workout_days_per_week', 3)}
- Workout Duration: {questionnaire_data.get('workout_duration_minutes', 45)} minutes
- Equipment: {', '.join(questionnaire_data.get('available_equipment', ['bodyweight']))}
- Focus Areas: {', '.join(questionnaire_data.get('focus_areas', ['full body']))}
- Injuries/Limitations: {questionnaire_data.get('injuries_limitations', 'None')}
- Additional Notes: {questionnaire_data.get('extra_comments', 'None')}
{weeks_instruction}

Return valid JSON with this structure:
{{
    "plan_name": "Plan name",
    "plan_description": "Brief overview",
    "weekly_schedule": [
        {{
            "week_number": 1,
            "theme": "Week focus",
            "days": [
                {{
                    "day_number": 1,
                    "day_name": "Monday",
                    "workout_name": "Workout name",
                    "focus": "Muscle groups",
                    "duration_minutes": 45,
                    "warmup": "5 min cardio + dynamic stretches",
                    "exercises": [
                        {{"name": "Exercise", "sets": 3, "reps": "10-12", "rest_seconds": 60, "notes": ""}}
                    ],
                    "cooldown": "5 min stretching"
                }}
            ]
        }}
    ],
    "tips": ["Tip 1", "Tip 2"],
    "progression_notes": "How to progress"
}}

Return ONLY valid JSON, no markdown."""

    client = get_openai_client()
    
    # Use higher token limit for longer plans
    max_tokens = 8000 if cycle_weeks <= 4 else 12000
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an expert fitness coach. Respond with valid, complete JSON only. Be concise but thorough."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=max_tokens
    )
    
    response_text = response.choices[0].message.content.strip()
    
    # Clean up response if it has markdown code blocks
    if response_text.startswith("```"):
        lines = response_text.split("\n")
        # Find the closing ```
        end_idx = len(lines) - 1
        for i in range(len(lines) - 1, 0, -1):
            if lines[i].strip() == "```":
                end_idx = i
                break
        response_text = "\n".join(lines[1:end_idx])
    
    # Try to parse JSON, with error recovery
    try:
        plan_data = json.loads(response_text)
    except json.JSONDecodeError as e:
        print(f"[OpenAI] JSON parse error: {e}")
        print(f"[OpenAI] Response length: {len(response_text)} chars")
        # Try to fix common issues - truncated JSON
        if not response_text.rstrip().endswith("}"):
            # Try to close the JSON properly
            response_text = response_text.rstrip()
            # Count open braces and brackets
            open_braces = response_text.count("{") - response_text.count("}")
            open_brackets = response_text.count("[") - response_text.count("]")
            # Close them
            response_text += "]" * open_brackets + "}" * open_braces
            try:
                plan_data = json.loads(response_text)
            except json.JSONDecodeError:
                raise ValueError(f"Failed to parse workout plan response. The AI response was incomplete. Please try again with a shorter plan duration.")
        else:
            raise ValueError(f"Failed to parse workout plan: {str(e)}")
    
    return {
        "plan_name": plan_data.get("plan_name", "Custom Workout Plan"),
        "plan_description": plan_data.get("plan_description", ""),
        "plan_data": plan_data,
        "cycle_type": cycle_type,
        "cycle_weeks": cycle_weeks
    }
