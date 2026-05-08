// content/overlay.js — injected into every page, listens for the timer signal and shows the overlay

const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((request) => {
    if (request.action === "SHOW_LIMIT_POPUP") {
        if (document.getElementById("fg-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "fg-overlay";

        const extensionTime = request.limit || 5;

        overlay.innerHTML = `
      <div class="fg-modal">
        <h1>Time's Up!</h1>
        <p>You've reached your limit on this site.</p>
        <button id="fg-close-tab" class="fg-btn-close">Close Tab</button>
        <button id="fg-extend-time" class="fg-btn-extend">Extend by ${extensionTime} min</button>
      </div>
    `;

        document.body.appendChild(overlay);

        document.getElementById("fg-close-tab").onclick = () =>
            api.runtime.sendMessage({ action: "CLOSE_TAB" });

        document.getElementById("fg-extend-time").onclick = () => {
            overlay.remove();
            api.runtime.sendMessage({ action: "EXTEND_TIME" });
        };
    }
});