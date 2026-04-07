# Covey-Quadrant-extension
A minimalist browser extension for task prioritization using the Eisenhower Matrix. Built with Vanilla JS and Manifest V3. Capture ideas on your "Plate" and sort them into four quadrants to stay focused on what matters.


##  The Philosophy
The "Plate" concept is simple: 
1. Capture: New tasks land in the central hub—your "Plate."
2. Categorize: Move tasks into one of the four quadrants:
   - Do First: Urgent & Important (The fires)
   - Schedule: Important, Not Urgent (The growth zone)
   - Delegate: Urgent, Not Important (The distractions)
   - Eliminate: Neither (The clutter)

## Tech Stack
- Languages: HTML5, CSS3, JavaScript (Vanilla)
- API: WebExtensions API (Manifest V3)
- Storage: `chrome.storage.local` for persistent, privacy-focused data handling.

## Key Features
- Central Hub UI: A unique circular input area for rapid task capturing.
- Dark Mode Native: A sleek, focused design that reduces eye strain.
- Privacy-First: No external servers or tracking. All data stays in your browser.
- Cross-Browser:Fully compatible with both Chrome and Firefox.

## Installation (Developer Mode)
If you want to run this locally:
1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable Developer Mode (top right).
4. Click Load unpacked and select the project folder.

(For Firefox: Navigate to `about:debugging`, click "This Firefox," and "Load Temporary Add-on")
## License
This project is licensed under the [MIT License](LICENSE).
