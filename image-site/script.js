document.addEventListener('DOMContentLoaded', () => {

  // --- MENU SCROLL ---
  const menuLinks = document.querySelectorAll('nav.menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      if(targetSection){
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- FILTRE MES CREATIONS ---
  const btnMain = document.querySelectorAll('.btn-main');
  const categoryGroups = document.querySelectorAll('.category-group');

  btnMain.forEach(btn => {
    btn.addEventListener('click', () => {
      btnMain.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      categoryGroups.forEach(group => {
        if(group.id === target){
          group.classList.add('active');
        } else {
          group.classList.remove('active');
        }
      });
    });
  });

  // --- CAROUSEL ASTUCES ---
  const track = document.getElementById('astuces-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  const cardWidth = track.querySelector('.astuce-card') 
    ? track.querySelector('.astuce-card').offsetWidth + 20 
    : 300;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  // --- LIGHTBOX pour toutes les images ---
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', e => {
    if(e.target !== e.currentTarget) return;
    lightbox.classList.remove('active');
    lightbox.innerHTML = '';
  });

  function enableLightbox(cardsSelector){
    const cards = document.querySelectorAll(cardsSelector + ' a img, ' + cardsSelector + ' img');
    cards.forEach(img => {
      img.addEventListener('click', e => {
        e.preventDefault();
        lightbox.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
        lightbox.classList.add('active');
      });
    });
  }

  // --- CHARGEMENT DYNAMIQUE JSON ---
  fetch('data.json')
    .then(res => res.json())
    .then(data => {

      // --- IMAGES ---
      const gridImages = document.getElementById('grid-images');
      data.images.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <a href="${item.src}">
            <img src="${item.src}" alt="${item.title}">
          </a>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        `;
        gridImages.appendChild(card);
      });

      // --- PYTHON ---
      const gridPython = document.getElementById('grid-python');
      data.python.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <a href="${item.src}">
            <img src="${item.src}" alt="${item.title}">
          </a>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        `;
        gridPython.appendChild(card);
      });

      // --- AI ---
      const gridAI = document.getElementById('grid-ai');
      data.ai.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        if(item.type === 'image'){
          card.innerHTML = `
            <a href="${item.src}">
              <img src="${item.src}" alt="${item.title}">
            </a>
            <h4>${item.title}</h4>
          `;
        } else if(item.type === 'prompt'){
          card.classList.add('prompt-card');
          card.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
          `;
        }
        gridAI.appendChild(card);
      });

     // --- ASTUCES ---
      const astucesTrack = document.getElementById('astuces-track');
      data.astuces.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('astuce-card', 'animate-up');
        
        // On prépare le contenu de l'image ou du mini-carousel
        let mediaContent = '';
        if (item.pages) {
          // Si c'est un dictionnaire (plusieurs pages)
          mediaContent = `
            <div class="mini-carousel" id="mini-${index}">
              <div class="mini-track">
                ${item.pages.map(p => `<div class="mini-page"><img src="${p.img}"><span>${p.text}</span></div>`).join('')}
              </div>
              <div class="mini-nav">
                <button type="button" class="m-prev" onclick="moveMini(${index}, -1)">❮</button>
                <button type="button" class="m-next" onclick="moveMini(${index}, 1)">❯</button>
              </div>
            </div>`;
        } else {
          // Si c'est une image simple (comme avant)
          mediaContent = item.img ? `<img src="${item.img}" alt="${item.title}">` : '';
        }

        card.innerHTML = `
          <div class="astuce-icon">${item.icon}</div>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          ${mediaContent}
        `;
        astucesTrack.appendChild(card);
      });

      // Fonction pour faire défiler les pages (à mettre AVANT la fermeture du fetch ou en global)
      window.moveMini = (id, dir) => {
        const track = document.querySelector(`#mini-${id} .mini-track`);
        track.scrollBy({ left: dir * track.offsetWidth, behavior: 'smooth' });
      };

      // --- COURS PDF (avec aperçu) ---
      const gridCours = document.getElementById('grid-cours');
      data.cours.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('cours-card');
        card.innerHTML = `
          <div class="pdf-preview">
            <iframe src="${item.pdf}#page=1" loading="lazy"></iframe>
          </div>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <a href="${item.pdf}" class="download-btn">Télécharger</a>
        `;
        gridCours.appendChild(card);
      });

      // --- ENABLE LIGHTBOX ---
      enableLightbox('#grid-images .card');
      enableLightbox('#grid-python .card');
      enableLightbox('#grid-ai .card');
      enableLightbox('#astuces-track .astuce-card'); // ✅ Astuces cliquables

    })
    .catch(err => console.error("Erreur chargement JSON :", err));

  // --- GESTION DU MENU BURGER ---
  const burger = document.getElementById('burger-menu');
  const nav = document.getElementById('nav-menu');

  if(burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }

});
