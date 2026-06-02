/* hacker.js — terminal flavor enhancements */

document.addEventListener("DOMContentLoaded", function () {

  /* ── Typewriter effect on page load for h1 ── */
  const h1 = document.querySelector(".md-typeset h1");
  if (h1) {
    const original = h1.textContent.trim();
    h1.textContent = "";
    let i = 0;
    const type = () => {
      if (i < original.length) {
        h1.textContent += original[i++];
        setTimeout(type, 40);
      }
    };
    type();
  }

  /* ── Prefix all inline code with a subtle $ for shell blocks ── */
  document.querySelectorAll("pre code.language-bash, pre code.language-sh").forEach(el => {
    el.querySelectorAll(".line, span:first-child").forEach(() => {});
  });

  /* ── Add [ ] decoration to external links ── */
  document.querySelectorAll(".md-typeset a[href^='http']").forEach(a => {
    if (!a.querySelector("img") && !a.classList.contains("md-button")) {
      a.setAttribute("data-ext", "↗");
    }
  });

});
