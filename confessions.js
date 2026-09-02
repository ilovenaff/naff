(() => {

  // =========================================================
  // SUPABASE
  // =========================================================

  const SUPABASE_URL =
    'https://azezmiyngqwydinfrhob.supabase.co';

  const SUPABASE_KEY =
    'sb_publishable_VmdftEO5hBHc5Pmt-UQU5A_poFuSk7e';


  if (!window.supabase) {
    console.error('Supabase library did not load.');
    return;
  }


  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


  // =========================================================
  // PAGE ELEMENTS
  // =========================================================

  const form =
    document.querySelector('#confession-form');

  const field =
    document.querySelector('#confession-text');

  const list =
    document.querySelector('#confession-list');

  const count =
    document.querySelector('#confession-count');

  const status =
    document.querySelector('#confession-status');

  const submitButton =
    document.querySelector('#confession-submit');


  if (!form || !field || !list || !count) {
    console.error(
      'Confession page elements could not be found.'
    );

    return;
  }


  // =========================================================
  // STATUS MESSAGE
  // =========================================================

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }


  // =========================================================
  // SHOW CONFESSIONS
  // =========================================================

  function renderConfessions(confessions) {

    const total = confessions.length;

    count.textContent =
      `${total} ${total === 1 ? 'secret' : 'secrets'}`;


    list.replaceChildren();


    if (total === 0) {

      const empty =
        document.createElement('p');

      empty.className =
        'confession-empty';

      empty.textContent =
        'no confessions yet.';

      list.appendChild(empty);

      return;
    }


    confessions.forEach((item) => {

      const confession =
        document.createElement('p');

      confession.className =
        'confession-entry';

      confession.textContent =
        item.text;

      list.appendChild(confession);

    });

  }


  // =========================================================
  // LOAD EVERYONE'S CONFESSIONS
  // =========================================================

  async function loadConfessions() {

    const { data, error } =
      await db
        .from('confessions')
        .select('id, text, created_at')
        .order(
          'created_at',
          { ascending: false }
        );


    if (error) {

      console.error(
        'Error loading confessions:',
        error
      );

      count.textContent =
        'could not load secrets';

      list.replaceChildren();

      const errorMessage =
        document.createElement('p');

      errorMessage.className =
        'confession-empty';

      errorMessage.textContent =
        'could not load confessions.';

      list.appendChild(errorMessage);

      return;
    }


    renderConfessions(
      Array.isArray(data)
        ? data
        : []
    );

  }


  // =========================================================
  // SUBMIT A CONFESSION
  // =========================================================

  form.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      const confession =
        field.value.trim();


      if (!confession) {
        return;
      }


      if (confession.length > 500) {

        setStatus(
          'your confession is too long.'
        );

        return;
      }


      if (submitButton) {
        submitButton.disabled = true;
      }

      field.disabled = true;


      setStatus(
        'saving your secret...'
      );


      const { error } =
        await db
          .from('confessions')
          .insert([
            {
              text: confession
            }
          ]);


      if (error) {

        console.error(
          'Error saving confession:',
          error
        );

        setStatus(
          'your secret could not be saved. try again.'
        );

        field.disabled = false;

        if (submitButton) {
          submitButton.disabled = false;
        }

        field.focus();

        return;
      }


      field.value = '';

      setStatus(
        'your secret has been saved.'
      );


      field.disabled = false;

      if (submitButton) {
        submitButton.disabled = false;
      }


      field.focus();


      // Reload immediately so the new confession appears.
      await loadConfessions();

    }
  );


  // =========================================================
  // FIRST LOAD
  // =========================================================

  loadConfessions();


  // =========================================================
  // KEEP DIFFERENT DEVICES SYNCHRONISED
  // =========================================================

  setInterval(
    loadConfessions,
    5000
  );

})();
