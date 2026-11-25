/*! CRECE 10 · video de presentación en la portada. © 2026 Dr. Yonatan Guerrero Soriano. */
// Pon aquí el id del video de YouTube (lo que va después de «watch?v=» o de «youtu.be/»).
// Mientras esté vacío, el botón no aparece.
(function () {
  var VIDEO_ID = '';

  var boton = document.querySelector('.footer-crece-video');
  var dialogo = document.getElementById('creceVideo');
  if (!boton || !dialogo) return;
  if (!/^[\w-]{11}$/.test(VIDEO_ID) || typeof dialogo.showModal !== 'function') { boton.hidden = true; return; }

  var marco = dialogo.querySelector('iframe');
  var origen = null;
  boton.hidden = false;

  boton.addEventListener('click', function () {
    origen = document.activeElement;
    // youtube-nocookie: sin cookies hasta que se reproduce; subtítulos en español activados
    marco.src = 'https://www.youtube-nocookie.com/embed/' + VIDEO_ID + '?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=es&hl=es';
    dialogo.showModal();
    document.body.style.overflow = 'hidden';
  });
  function cerrar() { if (dialogo.open) dialogo.close(); }
  dialogo.querySelector('.crece-video-cerrar').addEventListener('click', cerrar);
  dialogo.addEventListener('click', function (e) { if (e.target === dialogo) cerrar(); }); // clic en el fondo
  dialogo.addEventListener('close', function () {
    marco.src = 'about:blank'; // detiene el video
    document.body.style.overflow = '';
    if (origen && origen.focus) origen.focus();
  });
})();
