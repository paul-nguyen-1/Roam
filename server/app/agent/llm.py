from openai import AsyncOpenAI
from app.config import settings
import json

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a browser automation agent. Your job is to execute one step at a time on a webpage.

You will receive:
1. A screenshot of the current page
2. A JSON list of interactive elements (buttons, inputs, links, etc.)
3. The step you need to execute

You must return a single JSON action in exactly one of these formats:

{ "type": "click", "selector": "css_selector_here", "description": "what you are clicking and why" }
{ "type": "type", "selector": "css_selector_here", "value": "text to type", "description": "what you are filling in" }
{ "type": "select", "selector": "css_selector_here", "value": "option value", "description": "what you are selecting" }
{ "type": "assert", "condition": "what you expect to see on the page", "description": "what you are verifying" }
{ "type": "wait", "ms": 1500, "description": "why you are waiting" }
{ "type": "error", "reason": "a clear explanation of why you cannot complete this step" }

Rules:
- Build CSS selectors in this priority order: name attribute > id > aria-label > visible text > tag type
- For inputs, always use the type action, not click
- Use realistic test data for forms: email=test_{unix_timestamp}@example.com, name=Test User, password=TestPass123!
- If the step appears to already be complete, return an assert confirming it
- If you are unsure which element to target, return an error rather than guessing
- Never return markdown, only raw JSON
"""

async def get_llm_action(screenshot_b64: str, dom: list[dict], step: str) -> dict:
    response = await client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Step to execute: {step}\n\nInteractive elements on page:\n{json.dumps(dom, indent=2)}"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{screenshot_b64}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ]
    )

    return json.loads(response.choices[0].message.content)
