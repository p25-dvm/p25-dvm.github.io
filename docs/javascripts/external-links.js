document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('.rst-content a[href^="http"]');
  links.forEach(link => {
    // Compare actual hostnames, not a substring of the full URL
    if (link.hostname !== window.location.hostname) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    }
  });
});
