(() => {

  // =========================================================
  // SUPABASE SETTINGS
  // =========================================================

  const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';

  const SUPABASE_ANON_KEY =
    'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';


  // Make sure Supabase loaded correctly.
  if (!window.supabase) {
    console.error('Supabase did not load.');
    return;
  }


  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
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
      'Required confession page elements are missing.'
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
  // DRAW CONFESSIONS ON THE PAGE
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


      /*
        IMPORTANT:

        textContent means submitted confessions
        are treated only as text.

        Someone cannot submit HTML or JavaScript
        and have the browser execute it.
      */

      confession.textContent =
        item.text;


      list.appendChild(confession);

    });

  }


  // =========================================================
  // GET ALL CONFESSIONS FROM SUPABASE
  // =========================================================

  async function loadConfessions() {

    try {

      const { data, error } =
        await db
          .from('confessions')
          .select('id, text, created_at')
          .order(
            'created_at',
            { ascending: false }
          );


      if (error) {
        throw error;
      }


      renderConfessions(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        'Could not load confessions:',
        error
      );


      count.textContent =
        'unable to load secrets';


      list.replaceChildren();


      const errorMessage =
        document.createElement('p');

      errorMessage.className =
        'confession-empty';

      errorMessage.textContent =
        'could not load confessions.';


      list.appendChild(
        errorMessage
      );

    }

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


      // Stop accidental double submissions.

      if (submitButton) {
        submitButton.disabled = true;
      }


      field.disabled = true;


      setStatus(
        'saving your secret...'
      );


      try {

        const { error } =
          await db
            .from('confessions')
            .insert([
              {
                text: confession
              }
            ]);


        if (error) {
          throw error;
        }


        field.value = '';


        setStatus(
          'your secret has been saved.'
        );


        // Immediately reload the shared board.
        await loadConfessions();


      } catch (error) {

        console.error(
          'Could not save confession:',
          error
        );


        setStatus(
          'your secret could not be saved. try again.'
        );


      } finally {

        field.disabled = false;


        if (submitButton) {
          submitButton.disabled = false;
        }


        field.focus();

      }

    }
  );


  // =========================================================
  // FIRST LOAD
  // =========================================================

  loadConfessions();


  // =========================================================
  // AUTOMATICALLY REFRESH THE BOARD
  // =========================================================

  /*
    Every five seconds the page checks Supabase again.

    This means if somebody submits a confession
    from another phone/computer, it will appear
    without needing a hard refresh.
  */

  setInterval(
    loadConfessions,
    5000
  );


})();
