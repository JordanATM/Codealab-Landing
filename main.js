/* ─── main.js ─── */

// ═══════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ═══════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ═══════════════════════════════════════
// REVEAL ON SCROLL (IntersectionObserver)
// ═══════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════
// TYPED TEXT
// ═══════════════════════════════════════
const words = ['el producto digital', 'la web que vende', 'el software a medida', 'la app que escala'];
const typedEl = document.getElementById('typed-text');
let wordIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const word = words[wordIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++charIdx);
    if (charIdx === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 80);
  } else {
    typedEl.textContent = word.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(typeLoop, 350);
      return;
    }
    setTimeout(typeLoop, 45);
  }
}
typeLoop();

// ═══════════════════════════════════════
// ANIMATED COUNTERS
// ═══════════════════════════════════════
const counterEls = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const dur = 1600;
    const step = Math.ceil(dur / target);
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ═══════════════════════════════════════
// FLOATING PARTICLES (hero)
// ═══════════════════════════════════════
const particleContainer = document.getElementById('particles');
const PARTICLE_COLORS = ['#6C63FF', '#00D4FF', '#845EF7', '#ffffff'];

function spawnParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');
  const size = Math.random() * 4 + 2;
  const x = Math.random() * window.innerWidth;
  const dur = Math.random() * 8 + 6;
  const delay = Math.random() * 4;
  const drift = (Math.random() - 0.5) * 80 + 'px';
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${x}px; bottom:0;
    background:${PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]};
    animation-duration:${dur}s;
    animation-delay:${delay}s;
    --drift:${drift};
  `;
  particleContainer.appendChild(p);
  setTimeout(() => p.remove(), (dur + delay) * 1000);
}

// Spawn 25 particles initially + interval
for (let i = 0; i < 25; i++) spawnParticle();
setInterval(spawnParticle, 600);

// ═══════════════════════════════════════
// TECH BELT
// ═══════════════════════════════════════
const TECHS = [
  { emoji: '⚛️', name: 'React' },
  { emoji: '🟩', name: 'Node.js' },
  { emoji: '🐍', name: 'Python' },
  { emoji: '▲', name: 'Next.js' },
  { emoji: '🐘', name: 'PostgreSQL' },
  { emoji: '🐳', name: 'Docker' },
  { emoji: '☁️', name: 'AWS' },
  { emoji: '📱', name: 'React Native' },
  { emoji: '🎨', name: 'Figma' },
  { emoji: '💨', name: 'Tailwind' },
  { emoji: '🔷', name: 'TypeScript' },
  { emoji: '🔥', name: 'Firebase' },
];

const belt = document.getElementById('techBelt');
// Duplicate for seamless loop
[...TECHS, ...TECHS].forEach(t => {
  const el = document.createElement('div');
  el.classList.add('tech-item');
  el.innerHTML = `<span>${t.emoji}</span>${t.name}`;
  belt.appendChild(el);
});

// ═══════════════════════════════════════
// CONTACT FORM (demo)
// ═══════════════════════════════════════
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.textContent = 'Enviando…';
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.style.display = 'none';
    successMsg.style.display = 'block';
    form.reset();
  }, 1200);
});

// ═══════════════════════════════════════
// SMOOTH ACTIVE NAV LINK
// ═══════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.navbar__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--text-primary)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
