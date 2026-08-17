/* ----------------------------------------------------------------------------------------
 * Dadex — site specific behaviour, loaded after the theme's function.js.
 * ---------------------------------------------------------------------------------------- */
(function ($) {
  'use strict';

  /* ------------------------------------------------------------------
   * Contact form
   *
   * The Backeri theme POSTs the form to form-process.php. This is a
   * static Astro build with no PHP, so the submit is re-wired to compose
   * a pre-filled e-mail instead. To switch to a real backend later,
   * replace the body of sendMessage() with an fetch() to your endpoint.
   * ------------------------------------------------------------------ */
  var $form = $('#contactForm');

  if ($form.length) {
    // Drop the theme's handlers (validator's namespaced ones + the ajax submit),
    // then re-initialise the validator so inline field errors keep working.
    $form.validator('destroy');
    $form.off('submit');

    $form.validator({ focus: false }).on('submit', function (event) {
      if (event.isDefaultPrevented()) {
        return;
      }
      event.preventDefault();
      sendMessage();
    });
  }

  function sendMessage() {
    var to = $form.data('mailto');
    var name = $.trim($form.find('#name').val());
    var email = $.trim($form.find('#email').val());
    var phone = $.trim($form.find('#phone').val());
    var message = $.trim($form.find('#message').val());

    var body = [
      'Ime i prezime: ' + name,
      'Email adresa: ' + email,
      'Telefon: ' + (phone || '-'),
      '',
      'Poruka:',
      message,
    ].join('\r\n');

    var href =
      'mailto:' +
      to +
      '?subject=' +
      encodeURIComponent('Upit sa sajta — ' + name) +
      '&body=' +
      encodeURIComponent(body);

    // A temporary anchor is more reliable than assigning window.location for
    // mailto:, and it keeps the page itself from being navigated away.
    var link = document.createElement('a');
    link.href = href;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showMessage(
      true,
      'Otvaramo Vaš e-mail program sa pripremljenom porukom. Ako se ne otvori, pišite nam na ' + to + '.'
    );
  }

  function showMessage(valid, text) {
    $('#msgSubmit')
      .removeClass()
      .addClass(valid ? 'h4 text-success' : 'h4 text-danger')
      .text(text);
  }

  /* ------------------------------------------------------------------
   * SlickNav renders its toggle with an empty label — give it an
   * accessible name and keep aria-expanded in sync.
   * ------------------------------------------------------------------ */
  var $toggle = $('.slicknav_btn');

  if ($toggle.length) {
    $toggle.attr({ 'aria-label': 'Meni', 'aria-expanded': 'false' });

    $toggle.on('click', function () {
      var $btn = $(this);
      // The class flips after SlickNav's own handler, so read it next tick.
      window.setTimeout(function () {
        $btn.attr('aria-expanded', $btn.hasClass('slicknav_open') ? 'true' : 'false');
      }, 0);
    });
  }

  /* ------------------------------------------------------------------
   * SlickNav copies the desktop menu, so the active page has to be marked
   * again in the mobile clone. (Desktop is marked server-side in Header.astro.)
   * ------------------------------------------------------------------ */
  var norm = function (u) {
    return (u || '').replace(/\/+$/, '') || '/';
  };
  var currentPath = norm(window.location.pathname);

  $('.slicknav_nav a').each(function () {
    var href = norm($(this).attr('href'));
    if (href === currentPath) {
      $(this).closest('li').addClass('current-menu-item');
    }
  });
})(jQuery);
