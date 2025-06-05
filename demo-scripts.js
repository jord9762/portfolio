// Script to enforce video muting for RPG demo

document.addEventListener('DOMContentLoaded', function() {
  // Get all videos in the page
  const videos = document.querySelectorAll('video');
  
  // Add event listeners to ensure videos stay muted
  videos.forEach(video => {
    // Ensure video is muted when loaded
    video.muted = true;
    
    // Re-mute if user tries to unmute
    video.addEventListener('volumechange', function() {
      if (!video.muted) {
        video.muted = true;
      }
    });
    
    // Keep muted on play events
    video.addEventListener('play', function() {
      video.muted = true;
    });
  });
});
