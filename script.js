/* ========================================================
   SCRIPT INTERACTIVO - PROPUESTA PARA ELIANA 💕
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const loveCard = document.getElementById('loveCard');
  const catImage = document.getElementById('catImage');
  const speechBubble = document.getElementById('speechBubble');
  const speechText = document.getElementById('speechText');
  const hintText = document.getElementById('hintText');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const btnValentineYes = document.getElementById('btnValentineYes');
  const finalMessage = document.getElementById('finalMessage');
  const canvas = document.getElementById('hearts-canvas');

  // Imagen original y colección de memes de gatitos tristes para las reacciones
  const originalCatSrc = 'Imagenes/memegato.jpg';
  const cryingCats = [
    'Imagenes/ed1a740976872ed49674645a696c9b71.jpg',
    'Imagenes/64e10f282c603.jpeg',
    'Imagenes/bc3e3de9ca839288c7779965afb5c17c.jpg',
    'Imagenes/images (1).jpg',
    'Imagenes/my-collection-of-crying-cats-v0-tjgjqz7xvk461.webp'
  ];

  // Frases divertidas cuando intenta presionar "NO"
  const escapePhrases = [
    "¡Oye Eliana, por ahí no! 😼",
    "¡Ese botón está roto! 😹",
    "¡Ni lo pienses! El gato te está viendo 🥺",
    "¡El destino dice que debes dar al SÍ! ✨",
    "¿Por qué me huyes? 💔🥺",
    "¡Error 404: El NO no existe para ti! 💖",
    "¡No se vale hacer trampa! 🙈",
    "¡Ya ríndete y dale al SÍ! 🥰",
    "¡Ándale Elianita, dale al botón rosado! 💕"
  ];

  let noAttempts = 0;
  let isEscaping = false;
  let resetImageTimeout = null;

  const userEmail = "johanperozo3@gmail.com";

  // Función universal para enviar respuesta al correo de Johan
  function sendResponseToEmail(asunto, mensaje) {
    if (!mensaje) return;
    fetch(`https://formsubmit.co/ajax/${userEmail}`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Destinatario: "Johan",
        Asunto: asunto,
        Mensaje_De_Eliana: mensaje,
        Fecha_Hora: new Date().toLocaleString()
      })
    }).catch(() => {
      // Si hay error de red no bloquea la interfaz
    });
  }

  // ========================================================
  // SISTEMA DE AUDIO SINTETIZADO (Web Audio API)
  // Sin dependencias de archivos externos, funciona al 100%
  // ========================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sonido de escape juguetón
  function playBoingSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Ignorar si el navegador bloquea audio antes de interacción
    }
  }

  // Acorde celestial y romántico de celebración
  function playCelebrationChord() {
    try {
      initAudio();
      if (!audioCtx) return;
      // Arpegio de notas mágicas (Do mayor / La menor romántico: C5, E5, G5, B5, C6)
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
      const now = audioCtx.currentTime;

      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 1.2);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 1.25);
      });
    } catch (e) {}
  }

  // ========================================================
  // LÓGICA DEL BOTÓN ESCAPISTA "NO" (IMPOSIBLE DE ATINAR)
  // ========================================================
  function escapeNoButton(e) {
    if (e && e.cancelable && e.type !== 'mousemove') {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isEscaping) return;
    isEscaping = true;

    playBoingSound();
    noAttempts++;

    // Hacer que el botón SÍ crezca progresivamente
    const newScale = Math.min(1.6, 1 + noAttempts * 0.08);
    btnYes.style.transform = `scale(${newScale})`;

    // Convertir a posición fija si aún no lo está
    if (!btnNo.classList.contains('running')) {
      const rect = btnNo.getBoundingClientRect();
      btnNo.style.position = 'fixed';
      btnNo.style.left = `${rect.left}px`;
      btnNo.style.top = `${rect.top}px`;
      btnNo.classList.add('running');
    }

    // Dimensiones y márgenes de la ventana (asegurando que NUNCA se salga ni quede muy abajo)
    const btnWidth = btnNo.offsetWidth || 110;
    const btnHeight = btnNo.offsetHeight || 48;
    const paddingX = 24;
    const paddingTop = 30;
    const paddingBottom = 40; // Mayor margen abajo para que no se esconda con barras de navegación móviles

    const maxX = Math.max(paddingX, window.innerWidth - btnWidth - paddingX);
    const minX = paddingX;
    const maxY = Math.max(paddingTop, window.innerHeight - btnHeight - paddingBottom);
    const minY = paddingTop;

    // Obtener coordenadas del cursor
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    if (e) {
      if (typeof e.clientX === 'number') {
        mouseX = e.clientX;
        mouseY = e.clientY;
      } else if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    }

    // Obtener caja del botón SÍ para no solaparse
    const yesRect = btnYes.getBoundingClientRect();

    let targetX, targetY;
    let valid = false;
    let tries = 0;

    while (!valid && tries < 30) {
      tries++;
      targetX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      targetY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      const dx = (targetX + btnWidth / 2) - mouseX;
      const dy = (targetY + btnHeight / 2) - mouseY;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      // Distancia mínima del ratón
      if (distToMouse < 140) continue;

      // No chocar con el botón SÍ
      const overlapYes = !(
        targetX + btnWidth < yesRect.left - 20 ||
        targetX > yesRect.right + 20 ||
        targetY + btnHeight < yesRect.top - 20 ||
        targetY > yesRect.bottom + 20
      );

      if (!overlapYes) {
        valid = true;
      }
    }

    // Inclinación aleatoria
    const randomTilt = (Math.random() * 18 - 9).toFixed(1);

    btnNo.style.left = `${targetX}px`;
    btnNo.style.top = `${targetY}px`;
    btnNo.style.transform = `rotate(${randomTilt}deg) scale(0.96)`;

    // Reacción divertida y cambio de imagen temporal al gato llorando
    const phrase = escapePhrases[(noAttempts - 1) % escapePhrases.length];
    speechText.textContent = phrase;
    speechBubble.classList.add('active');

    const randomCrying = cryingCats[(noAttempts - 1) % cryingCats.length];
    catImage.src = randomCrying;
    catImage.classList.add('cat-shake');

    if (resetImageTimeout) clearTimeout(resetImageTimeout);
    resetImageTimeout = setTimeout(() => {
      catImage.src = originalCatSrc;
      catImage.classList.remove('cat-shake');
      speechBubble.classList.remove('active');
    }, 1400);

    // Permitir nuevo escape rápido
    setTimeout(() => {
      isEscaping = false;
    }, 90);
  }

  // Detección de proximidad del cursor (se aleja a 90px de distancia)
  document.addEventListener('mousemove', (e) => {
    if (step1.classList.contains('hidden')) return;

    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 95) {
      escapeNoButton(e);
    }
  });

  // Eventos adicionales en el botón NO para blindarlo contra clics, toques y focus
  btnNo.addEventListener('mouseenter', escapeNoButton);
  btnNo.addEventListener('mouseover', escapeNoButton);
  btnNo.addEventListener('pointerenter', escapeNoButton);
  btnNo.addEventListener('touchstart', escapeNoButton, { passive: false });
  btnNo.addEventListener('pointerdown', escapeNoButton);
  btnNo.addEventListener('focus', escapeNoButton);
  btnNo.addEventListener('click', escapeNoButton);

  const step3 = document.getElementById('step3');
  const btnIsAngry = document.getElementById('btnIsAngry');
  const btnNotAngry = document.getElementById('btnNotAngry');
  const angryCat = document.getElementById('angryCat');
  const sadReasonCat = document.getElementById('sadReasonCat');
  const speechBubble2 = document.getElementById('speechBubble2');
  const speechText2 = document.getElementById('speechText2');
  const speechBubble3 = document.getElementById('speechBubble3');
  const speechText3 = document.getElementById('speechText3');
  const whyAngrySection = document.getElementById('whyAngrySection');
  const whyAngryInput = document.getElementById('whyAngryInput');
  const btnSendReason = document.getElementById('btnSendReason');

  // ========================================================
  // PASO 1 -> PASO 2: "¿Te puedo hacer una pregunta, Eliana?" -> "SÍ"
  // ========================================================
  btnYes.addEventListener('click', () => {
    playCelebrationChord();
    triggerHeartExplosion();

    // Desactivar y ocultar el botón NO escapista
    btnNo.style.display = 'none';

    // Transición al Paso 2: "¿Tú estás enojada conmigo?" (Con botones SÍ y NO)
    loveCard.style.transform = 'scale(0.92)';
    setTimeout(() => {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      loveCard.style.transform = 'scale(1)';
      triggerHeartExplosion();
    }, 280);
  });

  // ========================================================
  // EN PASO 2: "¿Tú estás enojada conmigo?"
  // Si sigue diciendo NO -> Seguir insistiendo con memes graciosos
  // ========================================================
  let confirmNotAngryCount = 0;

  const noInsistences = [
    {
      subtitle: "¿Segura? Mírame a los ojos... 👀",
      question: "Eliana, ¿estás segura que no estás enojada? 🥺",
      img: 'Imagenes/bc3e3de9ca839288c7779965afb5c17c.jpg',
      speech: "¡Dime la verdad verdadera! 😿",
      yesBtn: "Bueno, SÍ 😾",
      noBtn: "Segura, NO 🥰"
    },
    {
      subtitle: "Mmmm no sé... no me convences 🧐",
      question: "¿Segurísima al 1000% que no me guardas rencor? 🥺",
      img: 'Imagenes/my-collection-of-crying-cats-v0-tjgjqz7xvk461.webp',
      speech: "¡Júralo por los gatitos! 🐾",
      yesBtn: "¡Que SÍ estoy! 😾",
      noBtn: "¡Que NO, tonto! 😂"
    },
    {
      subtitle: "Última oportunidad para confesar... 😼",
      question: "¿De verdad de la buena no estás brava conmigo? 🥺",
      img: 'Imagenes/64e10f282c603.jpeg',
      speech: "¿Promesa de meñique? 🤙💖",
      yesBtn: "SÍ, estoy brava 😾",
      noBtn: "Cero brava, te quiero 💕"
    }
  ];

  btnNotAngry.addEventListener('click', () => {
    if (confirmNotAngryCount < noInsistences.length) {
      const data = noInsistences[confirmNotAngryCount];
      confirmNotAngryCount++;

      playBoingSound();

      // Transición animada
      loveCard.style.transform = 'scale(0.95)';
      setTimeout(() => {
        document.getElementById('step2Subtitle').textContent = data.subtitle;
        document.getElementById('angryQuestion').textContent = data.question;
        angryCat.src = data.img;
        angryCat.classList.add('cat-shake');
        setTimeout(() => angryCat.classList.remove('cat-shake'), 400);

        speechText2.textContent = data.speech;
        speechBubble2.classList.add('active');

        btnIsAngry.querySelector('.btn-text').textContent = data.yesBtn;
        btnNotAngry.querySelector('.btn-text').textContent = data.noBtn;

        loveCard.style.transform = 'scale(1)';
      }, 180);

    } else {
      // Si superó todas las rondas de NO: ¡Alivio total absoluto!
      playCelebrationChord();
      triggerHeartExplosion();
      triggerHeartExplosion();

      angryCat.src = 'Imagenes/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg';
      speechText2.textContent = "¡Yeeei! Ahora sí me quedo en paz 🥰✨";
      speechBubble2.classList.add('active');

      btnNotAngry.innerHTML = "¡TE CREO AL 100%! 🥰💖";
      btnNotAngry.style.background = "linear-gradient(135deg, #00c853, #009624)";
      btnNotAngry.style.boxShadow = "0 8px 25px rgba(0, 200, 83, 0.6)";
      btnIsAngry.style.display = 'none';

      setTimeout(() => {
        step2.innerHTML = `
          <p class="subtitle">¡Prueba superada! ✨</p>
          <h2 class="main-title">¡Qué alivio, Elianita! 🥰</h2>
          <div class="image-wrapper">
            <img src="Imagenes/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg" class="cat-img" alt="Gatito feliz">
          </div>
          <div class="final-love-message" style="border-color: #00c853; color: #00e676; margin-bottom: 12px;">
            🎉 <strong>¡Uff, me vuelve el alma al cuerpo!</strong> 💕 Ya sé que no estás brava... pero aún tengo una duda:
          </div>
          <button type="button" class="btn btn-yes" id="btnThenWhy" style="width: 100%; font-size: 1.15rem; padding: 14px 20px;">
            ¿Entonces por qué? 🤔😿
          </button>
        `;
        triggerHeartExplosion();

        // Al presionar "¿Entonces por qué?"
        document.getElementById('btnThenWhy').addEventListener('click', () => {
          playBoingSound();

          loveCard.style.transform = 'scale(0.94)';
          setTimeout(() => {
            step2.innerHTML = `
              <p class="subtitle">Con el corazón en la mano... 🥺</p>
              <h2 class="main-title" style="font-size: 1.65rem;">
                ¿Entonces por qué me ignoras y ya no me quieres? :c
              </h2>
              <div class="image-wrapper">
                <img src="Imagenes/64e10f282c603.jpeg" class="cat-img" alt="Gatito triste pensativo">
                <div class="speech-bubble active">
                  <span>Siento que estás alejada... 😿</span>
                </div>
              </div>
              <div class="why-angry-container">
                <p class="why-angry-desc">Cuéntame con sinceridad por qué te has alejado de mí:</p>
                <textarea 
                  id="whyDistantInput" 
                  class="why-angry-textarea" 
                  placeholder="Explícame aquí por qué te has alejado..." 
                  rows="3"
                ></textarea>
                <button type="button" class="btn btn-yes btn-send-reason" id="btnSendDistantReason">
                  Enviar respuesta 🥺✨
                </button>
              </div>
              <div class="final-love-message hidden" id="finalDistantMessage" style="border-color: #b5179e; color: #f3e5f5;"></div>
            `;
            loveCard.style.transform = 'scale(1)';

            const whyDistantInput = document.getElementById('whyDistantInput');
            const btnSendDistantReason = document.getElementById('btnSendDistantReason');
            const finalDistantMessage = document.getElementById('finalDistantMessage');

            btnSendDistantReason.addEventListener('click', () => {
      const text = whyDistantInput.value.trim();
      playCelebrationChord();
      triggerHeartExplosion();

      // Enviar correo a Johan automáticamente
      sendResponseToEmail("💔 Eliana respondió por qué se alejó", text || "(No escribió texto adicional)");

      document.querySelector('#step2 .cat-img').src = 'Imagenes/ed1a740976872ed49674645a696c9b71.jpg';
      document.querySelector('#step2 .why-angry-container').classList.add('hidden');
      finalDistantMessage.classList.remove('hidden');

      if (text) {
        finalDistantMessage.innerHTML = `💌 <strong>¡Muchas gracias por decírmelo, ya lo reviso!</strong><br><br>Le voy a prestar mucha atención a esto: "<em>${text}</em>". Te extraño mucho y prometo dar lo mejor de mí para que estemos bien. ¡Te quiero mucho, Eliana! ✨💕`;
      } else {
        finalDistantMessage.innerHTML = `💌 <strong>¡Muchas gracias, ya lo reviso!</strong><br><br>No quiero que estemos alejados. Gracias por decírmelo, siempre estoy aquí para ti. ¡Te quiero mucho, Elianita! ✨💕`;
      }
      finalDistantMessage.style.borderColor = "#00c853";
      finalDistantMessage.style.color = "#00e676";
    });
  }, 200);
});
      }, 1200);
    }
  });

  // ========================================================
  // EN PASO 2: Si ella responde "SÍ" (está enojada)
  // -> Pasa al PASO 3 (Aquí ya NO hay botones de SÍ ni de NO)
  // ========================================================
  btnIsAngry.addEventListener('click', () => {
    playBoingSound();

    // Transición suave al Paso 3 (cuadro de texto con gato triste)
    loveCard.style.transform = 'scale(0.92)';
    setTimeout(() => {
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
      loveCard.style.transform = 'scale(1)';

      setTimeout(() => {
        whyAngryInput.focus();
      }, 250);
    }, 280);
  });

  // ========================================================
  // PASO 3: Enviar el motivo por el que está enojada
  // ========================================================
  btnSendReason.addEventListener('click', () => {
    const reasonText = whyAngryInput.value.trim();

    playCelebrationChord();
    triggerHeartExplosion();

    // Enviar correo a Johan automáticamente
    sendResponseToEmail("😾 Eliana respondió por qué está enojada", reasonText || "(No escribió texto adicional)");

    // Gatito cambia a comprensivo
    sadReasonCat.src = 'Imagenes/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg';
    speechText3.textContent = "¡Te prometo que lo soluciono! 🥺✨";

    whyAngrySection.classList.add('hidden');
    finalMessage.classList.remove('hidden');

    if (reasonText) {
      finalMessage.innerHTML = `💌 <strong>¡Muchas gracias por decírmelo, ya lo reviso!</strong><br><br>Le voy a prestar mucha atención a esto: "<em>${reasonText}</em>" para arreglarlo de inmediato. ¡Te quiero mucho, Eliana! ✨💕`;
    } else {
      finalMessage.innerHTML = `💌 <strong>¡Muchas gracias, ya lo reviso!</strong><br><br>Prometo arreglarlo y estar muy pendiente de ti. ¡Te quiero mucho, Elianita! ✨💕`;
    }

    finalMessage.style.borderColor = "#00c853";
    finalMessage.style.color = "#00e676";
  });

  // ========================================================
  // ANIMACIÓN DE FONDO CON CORAZONES (HTML5 CANVAS)
  // ========================================================
  const ctx = canvas.getContext('2d');
  let width, height;
  const hearts = [];
  const heartCount = 38;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class FloatingHeart {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 16 + 10;
      this.speedY = Math.random() * 0.9 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.45 + 0.25;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.color = Math.random() > 0.35 ? '#ff2a7a' : '#ff7597';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Dibujar forma de corazón vectorial
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(0, s / 4);
      ctx.quadraticCurveTo(0, 0, s / 4, 0);
      ctx.quadraticCurveTo(s / 2, 0, s / 2, s / 3);
      ctx.quadraticCurveTo(s / 2, 0, (3 * s) / 4, 0);
      ctx.quadraticCurveTo(s, 0, s, s / 4);
      ctx.quadraticCurveTo(s, s / 2, (3 * s) / 4, (3 * s) / 4);
      ctx.lineTo(s / 2, s);
      ctx.lineTo(s / 4, (3 * s) / 4);
      ctx.quadraticCurveTo(0, s / 2, 0, s / 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < heartCount; i++) {
    hearts.push(new FloatingHeart());
  }

  // ========================================================
  // EXPLOSIÓN DE CONFETI DE CORAZONES
  // ========================================================
  const confettiParticles = [];

  class ConfettiHeart {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 9 + 4;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - 3;
      this.gravity = 0.22;
      this.size = Math.random() * 18 + 12;
      this.opacity = 1;
      this.fade = Math.random() * 0.015 + 0.01;
      this.color = ['#ff0055', '#ff3377', '#ff66aa', '#ffb3d1', '#ffd700'][Math.floor(Math.random() * 5)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.rotation += this.rotSpeed;
      this.opacity -= this.fade;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, s / 4);
      ctx.quadraticCurveTo(0, 0, s / 4, 0);
      ctx.quadraticCurveTo(s / 2, 0, s / 2, s / 3);
      ctx.quadraticCurveTo(s / 2, 0, (3 * s) / 4, 0);
      ctx.quadraticCurveTo(s, 0, s, s / 4);
      ctx.quadraticCurveTo(s, s / 2, (3 * s) / 4, (3 * s) / 4);
      ctx.lineTo(s / 2, s);
      ctx.lineTo(s / 4, (3 * s) / 4);
      ctx.quadraticCurveTo(0, s / 2, 0, s / 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  function triggerHeartExplosion() {
    const cardRect = loveCard.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    for (let i = 0; i < 55; i++) {
      confettiParticles.push(new ConfettiHeart(centerX, centerY));
    }
  }

  // Bucle de animación 60FPS
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Corazones de fondo
    hearts.forEach(heart => {
      heart.update();
      heart.draw();
    });

    // Partículas de explosión de confeti
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0) {
        confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
});
