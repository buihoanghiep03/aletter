<template>
  <div class="sunlight-container" aria-hidden="true">
    <!-- Primary angled beam of afternoon warm light -->
    <div class="sunbeam-main"></div>
    <!-- Secondary softer scattered beam -->
    <div class="sunbeam-secondary"></div>
    <!-- Warm corner ambient glow -->
    <div class="sunlight-glow"></div>
  </div>
</template>

<script setup>
// Pure visual ambient lighting component
</script>

<style scoped>
.sunlight-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.sunbeam-main {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 140%;
  height: 120%;
  background: linear-gradient(
    128deg,
    rgba(255, 248, 230, 0.42) 0%,
    rgba(255, 241, 210, 0.22) 30%,
    rgba(255, 236, 196, 0.08) 55%,
    transparent 80%
  );
  filter: blur(24px);
  transform-origin: top right;
  animation: sunlightBreath 14s ease-in-out infinite alternate;
  will-change: opacity, transform;
}

.sunbeam-secondary {
  position: absolute;
  top: -10%;
  right: 15%;
  width: 70%;
  height: 110%;
  background: linear-gradient(
    135deg,
    rgba(255, 252, 240, 0.28) 0%,
    rgba(255, 243, 216, 0.12) 40%,
    transparent 75%
  );
  filter: blur(40px);
  animation: sunlightDrift 18s ease-in-out infinite alternate;
}

.sunlight-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 50vw;
  height: 50vw;
  max-width: 600px;
  max-height: 600px;
  background: radial-gradient(
    circle at 90% 10%,
    rgba(255, 246, 222, 0.5) 0%,
    rgba(255, 238, 204, 0.18) 40%,
    transparent 75%
  );
  filter: blur(30px);
}

@keyframes sunlightBreath {
  0% {
    opacity: 0.85;
    transform: rotate(0deg) scale(1);
  }
  50% {
    opacity: 1;
    transform: rotate(0.8deg) scale(1.02);
  }
  100% {
    opacity: 0.8;
    transform: rotate(-0.5deg) scale(0.99);
  }
}

@keyframes sunlightDrift {
  0% {
    opacity: 0.7;
    transform: translateX(0) scaleY(1);
  }
  100% {
    opacity: 0.95;
    transform: translateX(-15px) scaleY(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sunbeam-main,
  .sunbeam-secondary {
    animation: none;
    opacity: 0.85;
  }
}
</style>
