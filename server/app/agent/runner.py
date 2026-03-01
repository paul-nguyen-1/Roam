import logging
from playwright.async_api import async_playwright
from app.agent.dom import prune_dom
from app.agent.llm import get_llm_action
from app.agent.browser import capture_screenshot, perform_action

logger = logging.getLogger(__name__)


async def run_flow(url: str, steps: list[str]) -> list[dict]:
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()

        try:
            logger.info(f"Navigating to {url}")
            await page.goto(url, wait_until="networkidle", timeout=15000)
        except Exception as e:
            return [{
                "step_index": 0,
                "step_text": f"Navigate to {url}",
                "status": "failed",
                "action": None,
                "screenshot": None,
                "error": f"Failed to load page: {str(e)}"
            }]

        for i, step in enumerate(steps):
            logger.info(f"Executing step {i + 1}/{len(steps)}: {step}")

            screenshot = await capture_screenshot(page)
            dom = await prune_dom(page)

            action = None
            try:
                action = await get_llm_action(screenshot, dom, step)
                logger.info(f"LLM action: {action}")

                await perform_action(page, action)

                after_screenshot = await capture_screenshot(page)

                results.append({
                    "step_index": i,
                    "step_text": step,
                    "status": "passed",
                    "action": action,
                    "screenshot": after_screenshot,
                    "error": None
                })

            except Exception as e:
                logger.error(f"Step {i + 1} failed: {str(e)}")
                results.append({
                    "step_index": i,
                    "step_text": step,
                    "status": "failed",
                    "action": action,
                    "screenshot": screenshot,
                    "error": str(e)
                })
                break

        await browser.close()

    return results
