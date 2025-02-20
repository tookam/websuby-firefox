browser.runtime.onMessage.addListener((message) => {
  if (message.action === "pauseVideos") {
    pauseAllVideos();
  } else if (message.action === "resumeVideos") {
    resumeAllVideos();
  }
});

function pauseAllVideos() {console.log('pauseAllVideos');
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    if (!video.paused) {
      video.pause();
      showSpinner();
    }
  });
}

function resumeAllVideos() {console.log('resumeAllVideos');
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    if (video.paused) {
      video.play();
      hideSpinner()
    }
  });
}

function showSpinner() {
  const spinnerOverlay = document.createElement("div");
  spinnerOverlay.className = "spinner-overlay";
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  spinnerOverlay.appendChild(spinner);
  document.body.appendChild(spinnerOverlay);
}

function hideSpinner() {
  const spinnerOverlay = document.querySelector(".spinner-overlay");
  if (spinnerOverlay) {
    spinnerOverlay.remove();
  }
}