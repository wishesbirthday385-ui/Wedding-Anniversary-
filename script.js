/* ---------- Falling petal background ---------- */
const petalCanvas = document.getElementById('petalField');
const pfCtx = petalCanvas.getContext('2d');
let bgPetals = [];

function resizePetalField(){
  petalCanvas.width = window.innerWidth;
  petalCanvas.height = window.innerHeight;
  const count = Math.max(14, Math.floor(window.innerWidth / 90));
  bgPetals = Array.from({length: count}, () => makeBgPetal(true));
}

function makeBgPetal(randomY){
  return {
    x: Math.random() * petalCanvas.width,
    y: randomY ? Math.random() * petalCanvas.height : -20,
    size: 8 + Math.random() * 10,
    speed: 0.35 + Math.random() * 0.6,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.015,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    color: Math.random() < 0.5 ? 'rgba(231,184,189,' : 'rgba(140,58,73,'
  };
}

function drawBgPetal(p){
  pfCtx.save();
  pfCtx.translate(p.x, p.y);
  pfCtx.rotate(p.rot);
  pfCtx.beginPath();
  pfCtx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
  pfCtx.fillStyle = p.color + '0.55)';
  pfCtx.fill();
  pfCtx.restore();
}

function animateBgField(){
  pfCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
  const grad = pfCtx.createLinearGradient(0, 0, 0, petalCanvas.height);
  grad.addColorStop(0, '#170a0d');
  grad.addColorStop(1, '#2b1116');
  pfCtx.fillStyle = grad;
  pfCtx.fillRect(0, 0, petalCanvas.width, petalCanvas.height);

  bgPetals.forEach(p => {
    p.sway += p.swaySpeed;
    p.y += p.speed;
    p.x += Math.sin(p.sway) * 0.6;
    p.rot += p.rotSpeed;
    if (p.y > petalCanvas.height + 20){
      Object.assign(p, makeBgPetal(false));
    }
    drawBgPetal(p);
  });
  requestAnimationFrame(animateBgField);
}

resizePetalField();
window.addEventListener('resize', resizePetalField);
requestAnimationFrame(animateBgField);

/* ---------- Blooming flower ---------- */
const petalsGroup = document.getElementById('petals');
const PETAL_COUNT = 6;
const svgNS = 'http://www.w3.org/2000/svg';

for (let i = 0; i < PETAL_COUNT; i++){
  const angle = (360 / PETAL_COUNT) * i;
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M100,100 C124,76 124,36 100,14 C76,36 76,76 100,100 Z');
  path.setAttribute('fill', i % 2 === 0 ? '#e7b8bd' : '#cda86a');
  path.style.setProperty('--startRot', (angle - 25) + 'deg');
  path.style.setProperty('--endRot', angle + 'deg');
  path.style.animationDelay = (0.15 * i) + 's';
  petalsGroup.appendChild(path);
}

/* ---------- Petal burst (on letter open) ---------- */
const burstCanvas = document.getElementById('petalBurst');
const bCtx = burstCanvas.getContext('2d');
let burstParticles = [];

function resizeBurst(){
  burstCanvas.width = window.innerWidth;
  burstCanvas.height = window.innerHeight;
}
resizeBurst();
window.addEventListener('resize', resizeBurst);

const burstColors = ['#e7b8bd', '#cda86a', '#8c3a49', '#f6ece1'];

function spawnBurstPetal(x, y){
  return {
    x, y,
    vx: (Math.random() - 0.5) * 5,
    vy: -(Math.random() * 5 + 3),
    gravity: 0.15,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.18,
    size: 7 + Math.random() * 7,
    color: burstColors[Math.floor(Math.random() * burstColors.length)],
    life: 0,
    maxLife: 130 + Math.random() * 50
  };
}

function petalBurst(x, y, count = 55){
  for (let i = 0; i < count; i++) burstParticles.push(spawnBurstPetal(x, y));
}

function drawBurstPetal(p){
  bCtx.save();
  bCtx.translate(p.x, p.y);
  bCtx.rotate(p.rot);
  bCtx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
  bCtx.beginPath();
  bCtx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
  bCtx.fillStyle = p.color;
  bCtx.fill();
  bCtx.restore();
}

function animateBurst(){
  bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
  burstParticles.forEach(p => {
    p.vy += p.gravity * 0.05;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    drawBurstPetal(p);
  });
  burstParticles = burstParticles.filter(p => p.life < p.maxLife && p.y < burstCanvas.height + 40);
  requestAnimationFrame(animateBurst);
}
animateBurst();

/* ---------- Letter / envelope interaction ---------- */
const letterBtn = document.getElementById('letterBtn');
const letterModal = document.getElementById('letterModal');
const envelope = document.getElementById('envelope');
const letterCard = document.getElementById('letterCard');
const closeModal = document.getElementById('closeModal');

letterBtn.addEventListener('click', () => {
  letterModal.classList.add('open');
  setTimeout(() => {
    envelope.classList.add('open');
  }, 300);
  setTimeout(() => {
    envelope.classList.add('hide');
    letterCard.classList.add('show');
    petalBurst(window.innerWidth / 2, window.innerHeight / 2, 60);
  }, 1150);
});

function shutLetter(){
  letterCard.classList.remove('show');
  envelope.classList.remove('hide');
  setTimeout(() => {
    envelope.classList.remove('open');
    letterModal.classList.remove('open');
  }, 350);
}

closeModal.addEventListener('click', shutLetter);
letterModal.addEventListener('click', (e) => {
  if (e.target === letterModal) shutLetter();
});

/* ---------- Music toggle ---------- */
const soundBtn = document.getElementById('soundToggle');
const bgMusic = document.getElementById('bgMusic');
let playing = false;

soundBtn.addEventListener('click', () => {
  if (!playing){
    bgMusic.volume = 0.35;
    bgMusic.play().catch(() => {});
    soundBtn.textContent = '🔊';
    playing = true;
  } else {
    bgMusic.pause();
    soundBtn.textContent = '🔈';
    playing = false;
  }
});
