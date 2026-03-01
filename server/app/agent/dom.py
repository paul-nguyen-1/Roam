from playwright.async_api import Page

async def prune_dom(page: Page) -> list[dict]:
    return await page.evaluate("""
        () => {
            const selectors = 'button, input, select, textarea, a[href], [role=button], [role=link], label';
            const elements = Array.from(document.querySelectorAll(selectors));

            return elements
                .filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                })
                .slice(0, 60)
                .map(el => ({
                    tag: el.tagName.toLowerCase(),
                    type: el.type || null,
                    text: (el.innerText || el.value || el.placeholder || "").trim().slice(0, 80) || null,
                    placeholder: el.placeholder || null,
                    name: el.name || null,
                    id: el.id || null,
                    href: el.href || null,
                    ariaLabel: el.getAttribute("aria-label") || null,
                }));
        }
    """)
