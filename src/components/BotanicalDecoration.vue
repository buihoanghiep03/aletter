<template>
  <div class="botanical-container" :style="parallaxStyle" aria-hidden="true">
    <!-- Top-left dried eucalyptus and baby's breath branch -->
    <div class="botanical-item top-left">
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Stem -->
        <path d="M-10 -10 C 30 40, 80 80, 150 140 C 180 165, 200 190, 215 210" 
              stroke="#9A8068" stroke-width="2.2" stroke-linecap="round" opacity="0.75" />
        <path d="M60 65 C 90 60, 130 50, 160 55" 
              stroke="#B6A18A" stroke-width="1.4" stroke-linecap="round" opacity="0.65" />
        <path d="M110 105 C 130 135, 150 160, 175 175" 
              stroke="#B6A18A" stroke-width="1.3" stroke-linecap="round" opacity="0.65" />

        <!-- Dried Eucalyptus Leaves with warm organic vintage tones -->
        <!-- Leaf 1 -->
        <ellipse cx="65" cy="55" rx="18" ry="12" transform="rotate(-25 65 55)" 
                 fill="#C2B29F" stroke="#9A8068" stroke-width="1" opacity="0.82" />
        <path d="M52 59 C 62 55, 72 52, 78 50" stroke="#9A8068" stroke-width="0.8" opacity="0.6" />

        <!-- Leaf 2 -->
        <ellipse cx="105" cy="85" rx="22" ry="14" transform="rotate(20 105 85)" 
                 fill="#B6A18A" stroke="#8A7058" stroke-width="1" opacity="0.85" />
        <path d="M90 82 C 102 85, 115 88, 122 89" stroke="#7A6048" stroke-width="0.8" opacity="0.6" />

        <!-- Leaf 3 -->
        <ellipse cx="150" cy="60" rx="16" ry="10" transform="rotate(-40 150 60)" 
                 fill="#BDAE9C" stroke="#9A8068" stroke-width="1" opacity="0.78" />

        <!-- Leaf 4 -->
        <ellipse cx="145" cy="130" rx="20" ry="13" transform="rotate(35 145 130)" 
                 fill="#B6A18A" stroke="#8A7058" stroke-width="1" opacity="0.85" />

        <!-- Leaf 5 near tip -->
        <ellipse cx="185" cy="180" rx="14" ry="9" transform="rotate(45 185 180)" 
                 fill="#A89279" stroke="#7A6048" stroke-width="1" opacity="0.8" />

        <!-- Tiny dried berry clusters / baby breath florets -->
        <circle cx="165" cy="53" r="2.8" fill="#9A8068" opacity="0.75" />
        <circle cx="170" cy="58" r="2.2" fill="#B6A18A" opacity="0.75" />
        <circle cx="125" cy="118" r="2.5" fill="#9A8068" opacity="0.7" />
        <circle cx="132" cy="115" r="2" fill="#B6A18A" opacity="0.7" />
        <circle cx="198" cy="195" r="2.4" fill="#8A7058" opacity="0.8" />
      </svg>
    </div>

    <!-- Bottom-right dried rose petals and small sprig -->
    <div class="botanical-item bottom-right">
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Delicate twig -->
        <path d="M220 220 C 180 180, 130 150, 70 120 C 50 110, 30 105, 10 102" 
              stroke="#9A8068" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
        <path d="M140 160 C 120 180, 95 195, 75 205" 
              stroke="#B6A18A" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />

        <!-- Dried Rose Petals lying softly on table surface -->
        <!-- Fallen Petal 1 -->
        <path d="M125 185 C 115 170, 130 155, 150 162 C 165 170, 160 190, 142 192 C 132 193, 128 190, 125 185 Z" 
              fill="#B48E7E" stroke="#8D6858" stroke-width="0.8" opacity="0.78" />
        <!-- Subtle petal vein -->
        <path d="M132 184 C 140 178, 148 174, 153 170" stroke="#7A5648" stroke-width="0.6" opacity="0.4" />

        <!-- Fallen Petal 2 -->
        <path d="M70 145 C 60 135, 70 120, 85 125 C 98 130, 95 148, 82 150 C 75 151, 72 148, 70 145 Z" 
              fill="#BA9788" stroke="#947060" stroke-width="0.8" opacity="0.72" />

        <!-- Fallen Petal 3 (smaller curled petal) -->
        <path d="M175 130 C 168 122, 178 112, 190 118 C 198 123, 195 136, 185 136 Z" 
              fill="#A88272" stroke="#825E50" stroke-width="0.7" opacity="0.68" />

        <!-- Small dried leaf -->
        <ellipse cx="65" cy="195" rx="14" ry="8" transform="rotate(-20 65 195)" 
                 fill="#B6A18A" stroke="#8A7058" stroke-width="0.9" opacity="0.75" />

        <!-- Tiny pressed bud -->
        <circle cx="28" cy="105" r="3.5" fill="#8D6858" opacity="0.75" />
        <circle cx="34" cy="103" r="2.8" fill="#B48E7E" opacity="0.75" />
      </svg>
    </div>

    <!-- Bottom-left tiny loose petal accent -->
    <div class="botanical-item bottom-left">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 50 C 30 38, 45 28, 62 34 C 74 40, 70 60, 55 62 C 45 63, 42 58, 40 50 Z" 
              fill="#B6A18A" stroke="#8A7058" stroke-width="0.8" opacity="0.55" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const mouseX = ref(0);
const mouseY = ref(0);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const onMouseMove = (e) => {
  if (prefersReducedMotion) return;
  // Subtle normalized parallax (-1 to 1)
  const normX = (e.clientX / window.innerWidth - 0.5) * 2;
  const normY = (e.clientY / window.innerHeight - 0.5) * 2;
  mouseX.value = normX;
  mouseY.value = normY;
};

const parallaxStyle = computed(() => {
  if (prefersReducedMotion) return {};
  const moveX = mouseX.value * 6; // max 6px shift for elegance
  const moveY = mouseY.value * 6;
  return {
    transform: `translate3d(${moveX}px, ${moveY}px, 0)`,
    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)',
  };
});

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style scoped>
.botanical-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.botanical-item {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 6px 12px rgba(73, 56, 46, 0.12));
}

.top-left {
  top: 0;
  left: 0;
  transform: translate(-10px, -10px);
}

.bottom-right {
  bottom: 0;
  right: 0;
  transform: translate(15px, 15px);
}

.bottom-left {
  bottom: 15px;
  left: 20px;
}

@media (max-width: 640px) {
  .top-left svg {
    width: 140px;
    height: 140px;
  }
  .bottom-right svg {
    width: 150px;
    height: 150px;
  }
  .bottom-left {
    display: none;
  }
}
</style>
