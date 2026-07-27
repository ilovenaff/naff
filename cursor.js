"use strict";

(() => {
  const supportsCustomCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /*
   * Touchscreen-only devices do not need a mouse cursor.
   */
  if (!supportsCustomCursor) {
    return;
  }

  const keyCursor = document.createElement("img");

  keyCursor.src = "cursor.png?v=cursor-6";
  keyCursor.alt = "";
  keyCursor.className = "naff-custom-cursor";
  keyCursor.draggable = false;
  keyCursor.setAttribute("aria-hidden", "true");

  /*
   * These control which point of the key sits directly
   * under the real mouse position.
   */
  const HOTSPOT_X = 8;
  const HOTSPOT_Y = 8;

  let pointerX = -100;
  let pointerY = -100;
  let animationFrameId = 0;

  function drawCursor() {
    keyCursor.style.transform = `translate3d(
      ${pointerX - HOTSPOT_X}px,
      ${pointerY - HOTSPOT_Y}px,
      0
    )`;

    animationFrameId = 0;
  }

  function scheduleDraw() {
    if (animationFrameId !== 0) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(drawCursor);
  }

  /*
   * Only hide the browser cursor after the key image
   * successfully loads.
   */
  keyCursor.addEventListener(
    "load",
    () => {
      document.documentElement.classList.add(
        "custom-cursor-ready"
      );
    },
    { once: true }
  );

  keyCursor.addEventListener(
    "error",
    () => {
      document.documentElement.classList.remove(
        "custom-cursor-ready"
      );
    },
    { once: true }
  );

  document.body.appendChild(keyCursor);

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;

      keyCursor.classList.add("is-visible");
      scheduleDraw();
    },
    { passive: true }
  );

  document.documentElement.addEventListener(
    "mouseleave",
    () => {
      keyCursor.classList.remove("is-visible");
    }
  );

  window.addEventListener("blur", () => {
    keyCursor.classList.remove("is-visible");
  });
})();