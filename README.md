# LinkedIn Focus — local prototype

## Install in Chrome (Mac or Windows)
1. Unzip this download into a permanent folder.
2. Open chrome://extensions in Chrome.
3. Turn on Developer mode (top right).
4. Click Load unpacked and select the linkedin-focus folder containing manifest.json.
5. Open https://www.linkedin.com/feed/ and refresh any already-open LinkedIn tabs.
6. Pin LinkedIn Focus using Chrome’s puzzle-piece Extensions menu. Click its icon to change settings.

No build tools, server, subscription, API key or Chrome Web Store upload needed. This is desktop Chrome only.

## Try it
Starts in Learning mode: posts remain visible and receive a Focus toolbar. Click More like this or Less like this on several posts. The prototype learns shared words from those explicit choices. Undo feedback removes the example for that post. Duplicate feedback replaces the earlier vote rather than counting twice.

In the popup, add comma-separated interests and blocked phrases, then Save preferences. Switch to Focus mode to collapse posts containing blocked phrases or sufficiently similar to negative examples. Click Show post to reveal one temporarily. Disable the extension in its popup and Save to restore the full feed. Uninstalling or disabling in chrome://extensions requires a page refresh to remove already-injected UI.

Quick check: add a distinctive phrase from a visible post to Phrases to hide, choose Focus mode and save. That post should collapse with an explanation; Show post should restore it. Remove the phrase when finished.

Interests label matches but do not suppress all other topics. Blocked phrases override interests and positive feedback. Conservative sensitivity reduces learned filtering. Unknown posts stay visible. Reset learned feedback clears examples but keeps keyword preferences.

## What learning means here
A transparent text-only baseline, NOT an LLM or semantic AI. It tokenizes English text and compares unique-word overlap against up to 300 locally stored examples (cosine similarity of binary word features). A negative example must exceed the chosen threshold and beat the strongest positive similarity by 0.08. Same-topic useful and unhelpful posts can be confused. Feedback on generic language can overgeneralize. Use label mode first.

Only extension feedback buttons teach it. It does not observe LinkedIn likes, comments, reading time, your history, other devices, or mobile activity. It cannot interpret images, documents or videos, verify quality, or find posts LinkedIn never loads.

## Privacy and permissions
Only the storage permission and a content script restricted to https://www.linkedin.com/* are used. It activates on /feed paths only, leaving messages and profiles alone. The wider URL match allows navigating into the feed without a full page reload. No network calls, telemetry, remote scripts, external dependencies, or automated clicks/scrolling. Feedback stores word tokens, not full post text, authors or account identifiers; those tokens may still contain sensitive words. All settings/examples stay in chrome.storage.local, not cloud sync. Reset feedback or uninstall to remove learning.

## Limitations and troubleshooting
LinkedIn expressly prohibits third-party extensions that scrape, modify its appearance, or automate activity. This prototype modifies its appearance and therefore carries account-policy risk. Personal/local use does not remove that restriction.
Policy: https://www.linkedin.com/help/linkedin/answer/a1341387/prohibited-software-and-extensions

LinkedIn changes feed markup and varies it across accounts. This prototype uses known feed container/text selectors; it has not been validated on your signed-in live feed. If no Focus toolbar appears, refresh, check Enable in the popup, and confirm you are on /feed/. If still absent, the selectors may need updating. Do not share private feed content to troubleshoot; a redacted DOM excerpt can help. Text previews can omit material behind See more.

Source is included and readable. No automatic updates. To install a revised version, replace the files in the same folder, press Reload on chrome://extensions and refresh LinkedIn. To remove, click Remove there and refresh LinkedIn.

## Version 0.1.1
Adds a popup connection check and additional feed selectors, plus a fallback based on visible Like/Comment/Repost action rows in English. Click Check feed connection to distinguish no content script from no recognized posts. Fallback detection is heuristic and still requires live validation. No extra permissions or network requests.

## Version 0.1.2
Adds the exact componentkey="update-card-…" container and data-testid="expandable-text-box" text selectors observed in your DevTools screenshot.
