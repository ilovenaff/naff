const root = document.body;
const candle = document.querySelector('.candle');
const hint = document.querySelector('.touch-hint');

function moveLight(x, y) {
  root.style.setProperty('--light-x', `${x}px`);
  root.style.setProperty('--light-y', `${y}px`);
}

window.addEventListener(
  'pointermove',
  (event) => {
    moveLight(event.clientX, event.clientY);

    if (event.pointerType === 'touch' && hint) {
      hint.hidden = true;
    }
  },
  { passive: true }
);

window.addEventListener(
  'pointerdown',
  (event) => {
    moveLight(event.clientX, event.clientY);
  },
  { passive: true }
);

document.documentElement.addEventListener('mouseleave', () => {
  if (window.matchMedia('(hover: hover)').matches && candle) {
    candle.style.opacity = '0';
  }
});

document.documentElement.addEventListener('mouseenter', () => {
  if (candle) {
    candle.style.opacity = '1';
  }
});

document.querySelectorAll('.room').forEach((room) => {
  room.addEventListener('focus', () => {
    const bounds = room.getBoundingClientRect();

    moveLight(
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2
    );
  });
});
