# Focus Guard

A browser extension that helps you limit time spent on distracting websites.

## Install

[Get it on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/focus-guard-ext/)

## How it works
1. Open the extension popup and enter sites you want to limit (e.g. `reddit.com, youtube.com`)
2. Set a time limit in minutes
3. When you visit one of those sites a timer starts silently in the background
4. When your time is up, an overlay appears asking you to close the tab or extend your time

## Developer Install (Chrome / local)
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

## Permissions
- `storage` — saves your site list and time limit locally on your device
- `tabs` — detects which site you're on and closes the tab if you choose to
- `alarms` — runs the countdown timer reliably in the background
- `scripting` + `host_permissions` — injects the overlay into whichever sites you choose to limit

## License
MIT