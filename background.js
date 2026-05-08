// background.js — core engine: tracks time on watched sites, triggers overlay, handles user response

const api = typeof browser !== "undefined" ? browser : chrome;

// 1. When a tab's alarm fires, show the overlay if user is still on a watched site
api.alarms.onAlarm.addListener(async (alarm) => {
    if (!alarm.name.startsWith("tab-timer-")) return;

    const tabId = parseInt(alarm.name.replace("tab-timer-", ""));
    if (isNaN(tabId)) return;

    try {
        const tab = await api.tabs.get(tabId);
        const { watchedSites, limitMinutes } = await api.storage.local.get([
            "watchedSites",
            "limitMinutes",
        ]);

        const isStillOnSite = watchedSites?.some(
            (site) => site && tab.url.includes(site)
        );

        if (isStillOnSite) {
            api.tabs.sendMessage(tabId, {
                action: "SHOW_LIMIT_POPUP",
                limit: parseInt(limitMinutes) || 5,
            });
        }
    } catch (e) {
        // Tab was closed before alarm fired — clean up
        api.alarms.clear(alarm.name);
    }
});

// 2. When a tab navigates or finishes loading, start a timer if it's a watched site
api.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!(changeInfo.status === "complete" || changeInfo.url) || !tab.url) return;

    const { watchedSites, limitMinutes } = await api.storage.local.get([
        "watchedSites",
        "limitMinutes",
    ]);

    const isWatched = watchedSites?.some(
        (site) => site && tab.url.includes(site)
    );

    if (isWatched) {
        // Don't restart the timer if one is already running for this tab
        const existingAlarm = await api.alarms.get(`tab-timer-${tabId}`);
        if (!existingAlarm) {
            const delay = parseInt(limitMinutes) || 5;
            api.alarms.create(`tab-timer-${tabId}`, { delayInMinutes: delay });
            console.log(`[Focus Guard] Timer started: ${tab.url} — ${delay} mins`);
        }
    } else {
        // User navigated away from a watched site — cancel the timer
        await api.alarms.clear(`tab-timer-${tabId}`);
    }
});

// 3. Handle button clicks from the overlay (close tab or extend time)
api.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab.id;

    if (message.action === "CLOSE_TAB") {
        api.tabs.remove(tabId);

    } else if (message.action === "EXTEND_TIME") {
        api.storage.local.get("limitMinutes", (data) => {
            const delay = parseInt(data.limitMinutes) || 5;
            console.log(`[Focus Guard] Extending tab ${tabId} by ${delay} mins`);
            api.alarms.clear(`tab-timer-${tabId}`);
            api.alarms.create(`tab-timer-${tabId}`, { delayInMinutes: delay });
        });
    }
});

// 4. Clean up timer when a tab is closed
api.tabs.onRemoved.addListener((tabId) => {
    api.alarms.clear(`tab-timer-${tabId}`);
});