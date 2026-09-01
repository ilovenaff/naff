(() => {
  const page = document.body;

  // index.html and house.html intentionally do not receive this class.
  if (!page.classList.contains('key-cursor-page')) return;

  const key = document.querySelector('.naff-custom-cursor');
  if (!key) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const dots = Array.from({ length: 13 }, () => {
    const dot = document.createElement('span');
    dot.className = 'naff-cursor-trail';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    return { element: dot, x: -100, y: -100 };
  });

  let mouseX = -100;
  let mouseY = -100;
  let visible = false;

  function showCursor() {
    if (visible) return;
    visible = true;
    document.documentElement.classList.add('custom-cursor-ready');
    key.classList.add('is-visible');
  }

  function hideCursor() {
    visible = false;
    key.classList.remove('is-visible');
    dots.forEach(({ element }) => {
      element.style.opacity = '0';
    });
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    showCursor();
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', hideCursor);

  function draw() {
    key.style.transform = `translate3d(${mouseX - 28}px, ${mouseY - 28}px, 0)`;

    let targetX = mouseX;
    let targetY = mouseY;

    dots.forEach((dot, index) => {
      const follow = 0.34 - index * 0.009;
      dot.x += (targetX - dot.x) * follow;
      dot.y += (targetY - dot.y) * follow;
      dot.element.style.transform = `translate3d(${dot.x - 2.5}px, ${dot.y - 2.5}px, 0)`;
      dot.element.style.opacity = visible ? String(0.82 * (1 - index / dots.length)) : '0';
      targetX = dot.x;
      targetY = dot.y;
    });

    requestAnimationFrame(draw);
  }

  if (key.complete) {
    document.documentElement.classList.add('custom-cursor-ready');
  } else {
    key.addEventListener('load', () => {
      document.documentElement.classList.add('custom-cursor-ready');
    }, { once: true });
  }

  draw();
})();
