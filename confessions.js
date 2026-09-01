(() => {
  const storageKey = 'naff-confessions';
  const form = document.querySelector('#confession-form');
  const field = document.querySelector('#confession-text');
  const list = document.querySelector('#confession-list');
  const count = document.querySelector('#confession-count');
  const status = document.querySelector('#confession-status');

  if (!form || !field || !list || !count) return;

  function readConfessions() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(saved) ? saved.filter((item) => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  function render() {
    const confessions = readConfessions();
    count.textContent = `${confessions.length} ${confessions.length === 1 ? 'secret' : 'secrets'}`;
    list.replaceChildren();

    if (!confessions.length) {
      const empty = document.createElement('p');
      empty.className = 'confession-empty';
      empty.textContent = 'no confessions yet.';
      list.appendChild(empty);
      return;
    }

    confessions.slice().reverse().forEach((text) => {
      const confession = document.createElement('p');
      confession.className = 'confession-entry';
      confession.textContent = text;
      list.appendChild(confession);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const confession = field.value.trim();
    if (!confession) return;

    const confessions = readConfessions();
    confessions.push(confession);
    localStorage.setItem(storageKey, JSON.stringify(confessions));
    field.value = '';
    status.textContent = 'your secret has been saved.';
    render();
  });

  render();
})();
