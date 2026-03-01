import base64
from playwright.async_api import Page

async def capture_screenshot(page: Page) -> str:
    screenshot_bytes = await page.screenshot(full_page=False, type="png")
    return base64.b64encode(screenshot_bytes).decode("utf-8")


async def perform_action(page: Page, action: dict) -> None:
    action_type = action.get("type")

    if action_type == "click":
        await page.click(action["selector"], timeout=7000)
        await page.wait_for_load_state("networkidle", timeout=5000)

    elif action_type == "type":
        await page.fill(action["selector"], action["value"], timeout=7000)

    elif action_type == "select":
        await page.select_option(action["selector"], value=action["value"], timeout=7000)

    elif action_type == "wait":
        await page.wait_for_timeout(action.get("ms", 1000))

    elif action_type == "assert":
        pass

    elif action_type == "error":
        raise Exception(f"Agent could not complete step: {action.get('reason', 'unknown reason')}")

    else:
        raise Exception(f"Unknown action type returned by LLM: {action_type}")
