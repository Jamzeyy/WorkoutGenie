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
    
    # Build the prompt
    prompt = f"""You are an expert fitness coach and personal trainer. Create a detailed, personalized workout plan based on the following information:

**User Profile:**
- Fitness Level: {questionnaire_data.get('fitness_level', 'intermediate')}
- Primary Goal: {questionnaire_data.get('primary_goal', 'general_fitness')}
- Workout Days Per Week: {questionnaire_data.get('workout_days_per_week', 3)}
- Preferred Workout Duration: {questionnaire_data.get('workout_duration_minutes', 45)} minutes
- Available Equipment: {', '.join(questionnaire_data.get('available_equipment', ['bodyweight']))}
- Focus Areas: {', '.join(questionnaire_data.get('focus_areas', ['full body']))}
- Injuries/Limitations: {questionnaire_data.get('injuries_limitations', 'None')}
- Additional Notes: {questionnaire_data.get('extra_comments', 'None')}

**Plan Requirements:**
- Create a {cycle_type} plan ({cycle_weeks} week(s))
- Include specific exercises with sets, reps, and rest periods
- Progress the difficulty appropriately over the cycle
- Include warm-up and cool-down recommendations
- Provide exercise alternatives where applicable

Return the response as a valid JSON object with this exact structure:
{{
    "plan_name": "Descriptive plan name",
    "plan_description": "Brief overview of the plan and its goals",
    "weekly_schedule": [
        {{
            "week_number": 1,
            "theme": "Week theme or focus",
            "days": [
                {{
                    "day_number": 1,
                    "day_name": "Monday",
                    "workout_name": "Workout name",
                    "focus": "Muscle groups or type",
                    "duration_minutes": 45,
                    "warmup": "Warmup description",
                    "exercises": [
                        {{
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "10-12",
                            "rest_seconds": 60,
                            "notes": "Form tips or alternatives"
                        }}
                    ],
                    "cooldown": "Cooldown description"
                }}
            ]
        }}
    ],
    "tips": ["General tips for following the plan"],
    "progression_notes": "How to progress after completing the cycle"
}}

Ensure the JSON is valid and complete. Only return the JSON object, no additional text."""

    client = get_openai_client()
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an expert fitness coach. Always respond with valid JSON only, no markdown formatting or code blocks."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=4000
    )
    
    response_text = response.choices[0].message.content.strip()
    
    # Clean up response if it has markdown code blocks
    if response_text.startswith("```"):
        lines = response_text.split("\n")
        response_text = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
    
    plan_data = json.loads(response_text)
    
    return {
        "plan_name": plan_data.get("plan_name", "Custom Workout Plan"),
        "plan_description": plan_data.get("plan_description", ""),
        "plan_data": plan_data,
        "cycle_type": cycle_type,
        "cycle_weeks": cycle_weeks
    }
