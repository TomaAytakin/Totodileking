from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Wait for the app to start
            page.goto("http://localhost:3000", timeout=60000)

            # Wait for "Totodex" header to ensure app loaded
            page.wait_for_selector("text=Totodex", timeout=30000)

            # Check for the image
            img = page.locator("img[src='/totodile-card.png']")
            if img.is_visible():
                print("Totodile card image is visible")
            else:
                print("Totodile card image is NOT visible")

            # Check for the audio element
            audio = page.locator("audio[src='/bg-music.mp3']")
            if audio.count() > 0:
                print("Audio element found")
                # Check if it's not muted (based on React state passed to button or just checking element props if possible)
                # Since we can't easily check internal React state, we check the UI button

                # Check for Mute/Unmute button
                # Initial state is NOT muted, so we expect Volume2 icon (which means sound is ON)
                # But wait, the icons are SVGs. Let's check for the button existence.
                button = page.locator("button")
                if button.is_visible():
                    print("Sound toggle button is visible")
            else:
                print("Audio element NOT found")

            # Take screenshot
            page.screenshot(path="verification/app_screenshot.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
