(() => {
  const audio = document.getElementById("snSacredOmAudio");
  const toggle = document.getElementById("snSacredMusicToggle");
  const label = toggle?.querySelector(".music-label");

  if (!(audio instanceof HTMLAudioElement) || !(toggle instanceof HTMLButtonElement)) {
    return;
  }

  audio.volume = 0.075;

  const showState = (playing) => {
    toggle.classList.toggle("is-off", !playing);
    toggle.setAttribute("aria-pressed", String(playing));
    if (label) label.textContent = playing ? "On" : "Off";
  };

  toggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        audio.volume = 0;
        await audio.play();
        const fade = window.setInterval(() => {
          audio.volume = Math.min(0.075, audio.volume + 0.005);
          if (audio.volume >= 0.075) window.clearInterval(fade);
        }, 120);
        showState(true);
      } catch {
        showState(false);
      }
    } else {
      const fade = window.setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.0075);
        if (audio.volume <= 0) {
          window.clearInterval(fade);
          audio.pause();
          showState(false);
        }
      }, 80);
    }
  });

  showState(false);
})();

// The Shiva landing is a preserved static page, so it does not pass through the
// React root layout where Priya is normally mounted. Load the shared chatbot
// bridge from this already-present page script so cached landing HTML receives
// the same chatbot as the rest of the website.
if (/^\/shiva-nadi\/?$/.test(window.location.pathname) && !document.getElementById("nv-shiva-chatbot-loader")) {
  const chatbot = document.createElement("script");
  chatbot.id = "nv-shiva-chatbot-loader";
  chatbot.src = "/shiva-chatbot.js";
  chatbot.defer = true;
  document.body.appendChild(chatbot);
}
