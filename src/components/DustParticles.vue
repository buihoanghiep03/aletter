<template>
  <canvas ref="canvasRef" class="dust-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let animationFrameId = null;
let particles = [];
const PARTICLE_COUNT = 24;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class Particle {
  constructor(w, h) {
    this.reset(w, h, true);
  }

  reset(w, h, initial = false) {
    this.x = initial ? Math.random() * w : Math.random() * w * 0.7;
    this.y = initial ? Math.random() * h : -10;
    this.size = Math.random() * 1.8 + 0.8;
    this.vx = (Math.random() - 0.2) * 0.25; // Gentle drift
    this.vy = Math.random() * 0.25 + 0.1; // Gentle fall
    this.opacity = Math.random() * 0.35 + 0.1;
    this.baseOpacity = this.opacity;
    this.pulseSpeed = Math.random() * 0.02 + 0.008;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(w, h) {
    this.x += this.vx;
    this.y += this.vy;
    this.pulsePhase += this.pulseSpeed;
    this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.08;

    if (this.x < -10 || this.x > w + 10 || this.y > h + 10) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 245, 220, ${Math.max(0.04, this.opacity)})`;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(255, 240, 200, 0.5)';
    ctx.fill();
  }
}

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const loop = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update(canvas.width, canvas.height);
    p.draw(ctx);
  });

  animationFrameId = requestAnimationFrame(loop);
};

onMounted(() => {
  if (prefersReducedMotion) return;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const canvas = canvasRef.value;
  if (canvas) {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas.width, canvas.height));
    loop();
  }

  document.addEventListener('visibilitychange', handleVisibility);
});

const handleVisibility = () => {
  if (document.hidden) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  } else if (!prefersReducedMotion) {
    loop();
  }
};

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resizeCanvas);
  document.removeEventListener('visibilitychange', handleVisibility);
});
</script>

<style scoped>
.dust-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}
</style>
