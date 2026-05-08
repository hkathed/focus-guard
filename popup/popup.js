// popup/popup.js — loads and saves user settings (watched sites + time limit)

const api = typeof browser !== "undefined" ? browser : chrome;

// Save settings and close popup
document.getElementById("save-btn").addEventListener("click", () => {
    const siteInput = document.getElementById("site-list").value;
    const timeInput = document.getElementById("time-limit").value;

    const sites = siteInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

    const minutes = parseInt(timeInput);

    api.storage.local.set({ watchedSites: sites, limitMinutes: minutes }, () => {
        window.close();
    });
});

// Load saved settings on popup open
api.storage.local.get(["watchedSites", "limitMinutes"], (data) => {
    if (data.watchedSites)
        document.getElementById("site-list").value = data.watchedSites.join(", ");
    if (data.limitMinutes)
        document.getElementById("time-limit").value = data.limitMinutes;
});