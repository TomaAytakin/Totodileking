from playwright.sync_api import sync_playwright

def verify_totodex():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the app (assuming default port 3000)
            page.goto("http://localhost:3000")

            # Wait for the "Totodex" title to appear to ensure app loaded
            page.wait_for_selector("text=Totodex")

            # Check if the Token Address is displayed and truncated
            # The address starts with E23q and ends with pump
            # We displayed it as E23q...pump
            page.wait_for_selector("text=E23q...pump")

            # Check for Footer Links
            page.wait_for_selector("text=Join the Community")
            page.wait_for_selector("text=Source Code")

            # Take a screenshot
            page.screenshot(path="verification/totodex_screenshot.png", full_page=True)
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"Error: {e}")
            # Take screenshot anyway if possible to debug
            try:
                page.screenshot(path="verification/error_screenshot.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    verify_totodex()
