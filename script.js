// ===== Background "rede" animada (Canvas) =====
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d", { alpha: true });

let w, h, dpr;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}
window.addEventListener("resize", resize);
resize();

const N = 70;
let points = [];

function resetPoints() {
  points = Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35 * dpr,
    vy: (Math.random() - 0.5) * 0.35 * dpr,
    r: (Math.random() * 1.6 + 0.6) * dpr,
  }));
}
resetPoints();

function draw() {
  ctx.clearRect(0, 0, w, h);

  // Pontos
  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
  }

  // Linhas entre pontos próximos
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const max = 140 * dpr;
      if (dist < max) {
        const alpha = (1 - dist / max) * 0.35;
        ctx.strokeStyle = `rgba(36,214,255,${alpha})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
draw();

// Se a tela mudar muito (ex.: rotação), regenere pontos
window.addEventListener("resize", () => {
  resetPoints();
});

// ===== Exportar card como PNG (html2canvas) =====
const btn = document.getElementById("btnDownload");
btn.addEventListener("click", async () => {
  const card = document.getElementById("card");

  // Dica: quanto maior o scale, melhor a qualidade (e maior o arquivo)
  const scale = Math.min(window.devicePixelRatio || 1, 2);

  const canvasCard = await html2canvas(card, {
    backgroundColor: null,
    scale,
    useCORS: true
  });

  const a = document.createElement("a");
  a.download = "card-edutech-2026.png";
  a.href = canvasCard.toDataURL("image/png");
  a.click();
});