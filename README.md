# Focus Guard

A browser extension that helps you limit time spent on distracting websites.

## How it works
1. Open the extension popup and enter sites you want to limit (e.g. `reddit.com, youtube.com`)
2. Set a time limit in minutes
3. When you visit one of those sites, a timer starts
4. When the time is up, an overlay appears asking you to either close the tab or extend your time

## Install in developer mode

### Chrome
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

### Firefox
1. Go to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on** and select `manifest.json`

## Permissions
- `storage` — saves your site list and time limit
- `tabs` — detects which site you're on and can close a tab on request
- `alarms` — runs the countdown timer reliably in the background
- `scripting` + `host_permissions` — injects the overlay into watched sites