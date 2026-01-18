import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file from the backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Initialize Langfuse for LLM observability (optional)
langfuse = None
if os.getenv("LANGFUSE_SECRET_KEY") and os.getenv("LANGFUSE_PUBLIC_KEY"):
    try:
        from langfuse import Langfuse
        langfuse = Langfuse(
            secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
            public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
            host=os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")
        )
        print("[Langfuse] Initialized for LLM observability")
    except Exception as e:
        print(f"[Langfuse] Failed to initialize: {e}")


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    # Log masked key for debugging
    masked_key = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
    print(f"[OpenAI] Using API key: {masked_key}")
    return OpenAI(api_key=api_key)


def repair_truncated_json(text: str) -> str:
    """Attempt to repair truncated JSON by finding the last valid point and closing properly."""
    text = text.rstrip()
    
    # If already valid, return as-is
    try:
        json.loads(text)
        return text
    except:
        pass
    
    # Find and remove any incomplete string at the end
    # Look for the last complete key-value pair or array element
    
    # Try progressively shorter versions until we find parseable JSON
    # First, try to find the last complete object/array
    
    # Remove trailing incomplete string (text after last complete quote pair)
    # Find last occurrence of ": " or ", " followed by incomplete content
    
    # Strategy: find the last valid comma or closing bracket position
    last_valid = len(text)
    
    # Check if we're in the middle of a string
    in_string = False
    escape_next = False
    last_string_end = 0
    
    for i, char in enumerate(text):
        if escape_next:
            escape_next = False
            continue
        if char == '\\':
            escape_next = True
            continue
        if char == '"':
            in_string = not in_string
            if not in_string:
                last_string_end = i
    
    # If we ended in a string, truncate to last string end
    if in_string:
        text = text[:last_string_end + 1]
    
    # Now try to close the JSON properly
    text = text.rstrip()
    
    # Remove trailing comma if any
    if text.endswith(','):
        text = text[:-1]
    
    # Remove incomplete key (like `"notes":` without value)
    text = re.sub(r',?\s*"[^"]*":\s*$', '', text)
    
    # Count and close brackets/braces
    open_braces = text.count('{') - text.count('}')
    open_brackets = text.count('[') - text.count(']')
    
    # Close in reverse order - arrays first, then objects
    text += ']' * max(0, open_brackets)
    text += '}' * max(0, open_braces)
    
    return text


def generate_workout_plan(questionnaire_data: dict, cycle_type: str, user_profile: dict = None) -> dict:
    """Generate a personalized workout plan using ChatGPT."""
    
    cycle_weeks_map = {
        "weekly": 1,
        "monthly": 4,
        "bi-monthly": 8
    }
    cycle_weeks = cycle_weeks_map.get(cycle_type, 4)
    
    # Limit workout days for longer plans to reduce output size
    workout_days = min(int(questionnaire_data.get('workout_days_per_week', 3)), 5)
    
    # For longer plans, create a template-based approach to avoid token limits
    if cycle_weeks == 1:
        weeks_instruction = f"Create detailed workouts for all {workout_days} days."
    elif cycle_weeks <= 4:
        weeks_instruction = f"""For this {cycle_weeks}-week plan:
- Week 1: Full detail for all {workout_days} workout days
- Weeks 2-{cycle_weeks}: Just provide week theme and one key progression note (no full exercise lists)"""
    else:
        weeks_instruction = f"""For this {cycle_weeks}-week plan:
- Week 1: Full detail for all {workout_days} workout days  
- Weeks 2-{cycle_weeks}: ONLY provide week number, theme, and 1 progression note. NO exercise lists for weeks 2+."""
    
    # Build user profile section if available
    profile_section = ""
    if user_profile:
        profile_parts = []
        if user_profile.get('age'):
            profile_parts.append(f"Age: {user_profile['age']}")
        if user_profile.get('gender'):
            profile_parts.append(f"Gender: {user_profile['gender']}")
        if user_profile.get('height_cm'):
            profile_parts.append(f"Height: {user_profile['height_cm']}cm")
        if user_profile.get('weight_kg'):
            profile_parts.append(f"Weight: {user_profile['weight_kg']}kg")
        if user_profile.get('height_cm') and user_profile.get('weight_kg'):
            bmi = user_profile['weight_kg'] / ((user_profile['height_cm'] / 100) ** 2)
            profile_parts.append(f"BMI: {bmi:.1f}")
        if user_profile.get('activity_level'):
            profile_parts.append(f"Activity: {user_profile['activity_level']}")
        if user_profile.get('fitness_goal'):
            profile_parts.append(f"Goal: {user_profile['fitness_goal']}")
        
        if profile_parts:
            profile_section = f"\nUser Profile: {', '.join(profile_parts)}"
    
    # Build the prompt - optimized for shorter output
    prompt = f"""Create a {cycle_type} workout plan ({cycle_weeks} weeks, {workout_days} days/week).

User: {questionnaire_data.get('fitness_level', 'intermediate')} level, goal: {questionnaire_data.get('primary_goal', 'general_fitness')}
Duration: {questionnaire_data.get('workout_duration_minutes', 45)} min
Equipment: {', '.join(questionnaire_data.get('available_equipment', ['bodyweight']))}
Focus: {', '.join(questionnaire_data.get('focus_areas', ['full body']))}
Limitations: {questionnaire_data.get('injuries_limitations', 'None')}
Notes: {questionnaire_data.get('extra_comments', 'None')}{profile_section}

{weeks_instruction}

Tailor the workout intensity, exercise selection, and rep ranges based on the user's profile data (age, weight, BMI, activity level). Keep exercise notes very short (max 10 words). Return JSON:
{{"plan_name":"","plan_description":"","weekly_schedule":[{{"week_number":1,"theme":"","days":[{{"day_number":1,"day_name":"","workout_name":"","focus":"","duration_minutes":45,"warmup":"","exercises":[{{"name":"","sets":3,"reps":"","rest_seconds":60,"notes":""}}],"cooldown":""}}]}}],"tips":[""],"progression_notes":""}}"""

    client = get_openai_client()
    
    # Start Langfuse trace if available
    trace = None
    generation = None
    if langfuse:
        trace = langfuse.trace(
            name="generate_workout_plan",
            metadata={"cycle_type": cycle_type, "cycle_weeks": cycle_weeks}
        )
        generation = trace.generation(
            name="gpt4o-workout-plan",
            model="gpt-4o",
            input={"prompt": prompt[:500] + "..."},  # Truncate for logging
        )
    
    # Use JSON mode for guaranteed valid JSON structure
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are a fitness coach. Return ONLY valid JSON. Keep responses concise. Max 10 words per notes field."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=16000,  # Increased significantly
        response_format={"type": "json_object"}  # Force JSON output
    )
    
    response_text = response.choices[0].message.content.strip()
    print(f"[OpenAI] Response length: {len(response_text)} chars, finish_reason: {response.choices[0].finish_reason}")
    
    # Log to Langfuse
    if generation:
        generation.end(
            output=response_text[:1000] + "..." if len(response_text) > 1000 else response_text,
            usage={
                "input": response.usage.prompt_tokens if response.usage else 0,
                "output": response.usage.completion_tokens if response.usage else 0,
            }
        )
    
    # Check if response was truncated
    if response.choices[0].finish_reason == "length":
        print("[OpenAI] WARNING: Response was truncated due to length limit")
        response_text = repair_truncated_json(response_text)
    
    # Try to parse JSON
    try:
        plan_data = json.loads(response_text)
    except json.JSONDecodeError as e:
        print(f"[OpenAI] JSON parse error: {e}")
        # Try to repair
        repaired = repair_truncated_json(response_text)
        try:
            plan_data = json.loads(repaired)
            print("[OpenAI] Successfully repaired truncated JSON")
        except json.JSONDecodeError:
            raise ValueError(f"Failed to parse workout plan. Please try a shorter plan (weekly instead of monthly).")
    
    return {
        "plan_name": plan_data.get("plan_name", "Custom Workout Plan"),
        "plan_description": plan_data.get("plan_description", ""),
        "plan_data": plan_data,
        "cycle_type": cycle_type,
        "cycle_weeks": cycle_weeks
    }
