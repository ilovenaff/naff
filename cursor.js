"use strict";

(() => {
  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (!hasFinePointer) {
    return;
  }

  const keyCursor = document.createElement("img");

  keyCursor.alt = "";
  keyCursor.className = "naff-custom-cursor";
  keyCursor.draggable = false;
  keyCursor.setAttribute("aria-hidden", "true");

  /*
   * Adjust these values to move the active point
   * toward the tip of the key.
   */
  const HOTSPOT_X = 4;
  const HOTSPOT_Y = 4;

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
      /*
       * Keep the normal browser cursor if cursor.png
       * cannot load.
       */
      document.documentElement.classList.remove(
        "custom-cursor-ready"
      );
    },
    { once: true }
  );

  keyCursor.src = "cursor.png?v=cursor-5";

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