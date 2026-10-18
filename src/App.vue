<template>
  <div class="vintage-app-container">
    <!-- Subtle Film Paper Texture Overlay -->
    <div class="vintage-texture-overlay" aria-hidden="true"></div>

    <!-- Soft Vignette Shadow at edges -->
    <div class="vintage-vignette" aria-hidden="true"></div>

    <!-- Natural Warm Sunlight Beams -->
    <SunlightOverlay />

    <!-- Delicate Floating Dust Particles -->
    <DustParticles />

    <!-- Corner Dried Petals and Botanical Branches -->
    <BotanicalDecoration />

    <!-- Vintage Floating Audio Controller (Top-right, auto-plays Cry On My Shoulder) -->
    <AudioToggle />

    <!-- Main Screens Coordinator with Silky Transitions -->
    <Transition name="screen-crossfade" mode="out-in" @after-leave="scrollToTop">
      <!-- SCREEN 1: THE ENVELOPE -->
      <Envelope 
        v-if="currentScreen === 'envelope'" 
        key="screen-envelope"
        @open="goToLetter"
      />

      <!-- SCREEN 2: THE HANDWRITTEN LETTER -->
      <LetterViewer 
        v-else-if="currentScreen === 'letter'" 
        key="screen-letter"
        @back="goToEnvelope"
        @next="goToFinalNote"
      />

      <!-- SCREEN 3: THE FINAL NOTE -->
      <FinalNote 
        v-else-if="currentScreen === 'finalNote'" 
        key="screen-final-note"
        @restart="goToEnvelope"
        @back-to-letter="goToLetter"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SunlightOverlay from './components/SunlightOverlay.vue';
import DustParticles from './components/DustParticles.vue';
import BotanicalDecoration from './components/BotanicalDecoration.vue';
import AudioToggle from './components/AudioToggle.vue';
import Envelope from './components/Envelope.vue';
import LetterViewer from './components/LetterViewer.vue';
import FinalNote from './components/FinalNote.vue';
import { playAudio, audioState } from './utils/audioPlayer.js';

// Screen state: 'envelope' | 'letter' | 'finalNote'
const currentScreen = ref('envelope');

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goToEnvelope = () => {
  currentScreen.value = 'envelope';
};

const goToLetter = () => {
  currentScreen.value = 'letter';
};

const goToFinalNote = () => {
  currentScreen.value = 'finalNote';
};

// Global audio unlock for mobile phones & tablets (iOS Safari / iPadOS / Android)
const unlockAudioOnTouch = () => {
  if (!audioState.isPlaying) {
    playAudio().catch(() => {});
  }
};

onMounted(() => {
  const events = ['touchstart', 'touchend', 'pointerdown', 'click'];
  events.forEach((evt) => {
    window.addEventListener(evt, unlockAudioOnTouch, { once: true, passive: true });
  });
});

onUnmounted(() => {
  const events = ['touchstart', 'touchend', 'pointerdown', 'click'];
  events.forEach((evt) => {
    window.removeEventListener(evt, unlockAudioOnTouch);
  });
});
</script>

<style scoped>
.vintage-app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-bg-main);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* Screen Crossfade & Slide Transition System */
.screen-crossfade-enter-active,
.screen-crossfade-leave-active {
  transition: opacity 0.75s cubic-bezier(0.25, 1, 0.33, 1),
              transform 0.75s cubic-bezier(0.25, 1, 0.33, 1);
}

.screen-crossfade-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
}

.screen-crossfade-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.99);
}

@media (prefers-reduced-motion: reduce) {
  .screen-crossfade-enter-active,
  .screen-crossfade-leave-active {
    transition: opacity 0.2s ease;
  }
  .screen-crossfade-enter-from,
  .screen-crossfade-leave-to {
    transform: none;
  }
}
</style>
