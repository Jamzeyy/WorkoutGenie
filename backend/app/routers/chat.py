from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.openai_service import get_openai_client, langfuse

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None  # Optional context like current plan info


class ChatResponse(BaseModel):
    message: str


SYSTEM_PROMPT = """You are WorkoutGenie, an expert AI fitness coach and personal trainer assistant. Your personality is:
- Friendly, encouraging, and motivating
- Knowledgeable about exercise science, nutrition, and recovery
- Gives practical, actionable advice
- Keeps responses concise (2-4 sentences unless more detail is requested)
- Uses occasional fitness-related emojis for encouragement 💪🏋️‍♂️🔥

You can help with:
- Exercise form and technique tips
- Workout modifications and alternatives
- Nutrition advice (general, not medical)
- Recovery and rest recommendations
- Motivation and goal-setting
- Explaining training concepts (progressive overload, myoreps, drop sets, etc.)
- Answering fitness questions

Always prioritize safety and recommend consulting professionals for injuries or medical concerns."""


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the WorkoutGenie AI for real-time fitness advice."""
    try:
        client = get_openai_client()
        
        # Start Langfuse trace if available
        trace = None
        generation = None
        if langfuse:
            trace = langfuse.trace(name="chat")
            user_msg = request.messages[-1].content if request.messages else ""
            generation = trace.generation(
                name="gpt4o-chat",
                model="gpt-4o",
                input=user_msg[:200],
            )
        
        # Build message history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add context if provided
        if request.context:
            messages.append({
                "role": "system",
                "content": f"Current user context: {request.context}"
            })
        
        # Add conversation history (last 10 messages to keep context manageable)
        for msg in request.messages[-10:]:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        result = response.choices[0].message.content
        
        # Log to Langfuse
        if generation:
            generation.end(
                output=result,
                usage={
                    "input": response.usage.prompt_tokens if response.usage else 0,
                    "output": response.usage.completion_tokens if response.usage else 0,
                }
            )
        
        return ChatResponse(message=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
