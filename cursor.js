"use strict";

(() => {
  const supportsMouseCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /*
   * Do not create the custom cursor on touch-only devices.
   */
  if (!supportsMouseCursor) {
    return;
  }

  const cursor = document.createElement("img");

  cursor.src = "cursor.png";
  cursor.alt = "";
  cursor.className = "naff-custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.draggable = false;

  document.body.append(cursor);

  /*
   * Adjust these two values to move the active clicking
   * point to the tip of your key.
   */
  const HOTSPOT_X = 4;
  const HOTSPOT_Y = 4;

  let pointerX = -100;
  let pointerY = -100;
  let animationFrameId = 0;

  function drawCursor() {
    cursor.style.transform = `translate3d(
      ${pointerX - HOTSPOT_X}px,
      ${pointerY - HOTSPOT_Y}px,
      0
    )`;

    animationFrameId = 0;
  }

  function scheduleCursorDraw() {
    if (animationFrameId !== 0) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(drawCursor);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;

      cursor.classList.add("is-visible");
      scheduleCursorDraw();
    },
    { passive: true }
  );

  document.documentElement.addEventListener(
    "pointerleave",
    () => {
      cursor.classList.remove("is-visible");
    }
  );

  window.addEventListener("blur", () => {
    cursor.classList.remove("is-visible");
  });

  window.addEventListener("focus", () => {
    cursor.classList.remove("is-visible");
  });
})();