<template>
  <section class="envelope-screen" aria-label="Phong thư mở đầu">
    <div class="content-wrapper">
      
      <!-- Typography Header -->
      <header class="header-group">
        <h1 class="main-title font-display">
          Có một lá thư cho em
        </h1>
        <p class="subtitle font-body">
          Những dòng này có thể đã ở chỗ em nếu như em nhận quà của anh
        </p>
      </header>

      <!-- 3D Interactive Vintage Envelope -->
      <div 
        class="envelope-wrapper"
        :class="{ 'is-opened': isOpening, 'is-hoverable': !isOpening }"
        @click="handleEnvelopeClick"
        role="button"
        tabindex="0"
        aria-label="Nhấn để mở lá thư viết tay"
        @keydown.enter.prevent="handleEnvelopeClick"
        @keydown.space.prevent="handleEnvelopeClick"
      >
        <div class="envelope">
          <!-- Back Interior Lining -->
          <div class="envelope-back"></div>

          <!-- Inside Letter Sheet (Slides out on open) -->
          <div class="letter-sheet" aria-hidden="true">
            <div class="letter-sheet-texture"></div>
            <!-- Vintage letter ruled lines -->
            <div class="sheet-lines">
              <span class="sheet-line"></span>
              <span class="sheet-line"></span>
              <span class="sheet-line"></span>
              <span class="sheet-line short"></span>
            </div>
            <!-- Ink stamp accent -->
            <div class="stamp-accent"></div>
          </div>

          <!-- Left Flap Fold -->
          <div class="flap flap-left"></div>

          <!-- Right Flap Fold -->
          <div class="flap flap-right"></div>

          <!-- Bottom Flap Fold -->
          <div class="flap flap-bottom"></div>

          <!-- Top Triangular Flap with 3D Flip & Wax Seal -->
          <div class="flap-top-wrapper">
            <div class="flap flap-top"></div>
            
            <!-- Vintage Wax Seal -->
            <div class="wax-seal" :class="{ 'breaking': isOpening }">
              <div class="wax-seal-outer">
                <div class="wax-seal-inner">
                  <!-- Monogram / Heart Stamp -->
                  <svg viewBox="0 0 24 24" class="wax-icon" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Soft Shadow Under Envelope -->
          <div class="envelope-shadow"></div>
        </div>
      </div>

      <!-- Call to Action Button & Mobile Audio Hint -->
      <div class="action-group">
        <button 
          class="vintage-btn-primary open-letter-btn font-display"
          :disabled="isOpening"
          @click.stop="triggerOpen"
          aria-label="Mở lá thư để đọc"
        >
          <span>Mở lá thư</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="btn-arrow">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <p class="audio-prompt font-body" :class="{ 'fade-out': audioState.isPlaying }">
          <span class="music-note-icon">🎵</span>
          <span>Chạm vào màn hình để mở thư & phát bài hát</span>
        </p>
      </div>

    </div>

    <!-- Soft Golden Flash Overlay during opening transition -->
    <div class="open-flash-overlay" :class="{ active: isOpening }"></div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { playAudio, audioState } from '../utils/audioPlayer.js';

const emit = defineEmits(['open']);

const isOpening = ref(false);

const handleEnvelopeClick = () => {
  if (isOpening.value) return;
  triggerOpen();
};

const triggerOpen = () => {
  if (isOpening.value) return;

  // Immediately unlock & play song on user gesture (100% works on iPhone/iPad)
  playAudio().catch(() => {});

  isOpening.value = true;

  // Transition after flap unfolds
  setTimeout(() => {
    emit('open');
  }, 950);
};
</script>

<style scoped>
.envelope-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(2rem, env(safe-area-inset-top, 2rem)) max(1rem, env(safe-area-inset-right, 1rem)) max(2.5rem, env(safe-area-inset-bottom, 2.5rem)) max(1rem, env(safe-area-inset-left, 1rem));
  z-index: 10;
  overflow: hidden;
}

.content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 580px;
  width: 100%;
  text-align: center;
}

/* Header Typography */
.header-group {
  margin-bottom: 2rem;
  will-change: transform, opacity;
}

.main-title {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 500;
  font-style: italic;
  color: var(--color-brown-dark);
  letter-spacing: 0.02em;
  line-height: 1.25;
  margin-bottom: 0.65rem;
  opacity: 0;
  transform: translateY(16px);
  animation: entranceFadeUp 1s var(--ease-vintage) 0.3s forwards;
}

.subtitle {
  font-size: clamp(0.92rem, 2.8vw, 1.1rem);
  color: var(--color-brown-light);
  letter-spacing: 0.04em;
  max-width: 440px;
  margin: 0 auto;
  line-height: 1.55;
  opacity: 0;
  transform: translateY(12px);
  animation: entranceFadeUp 1s var(--ease-vintage) 0.5s forwards;
}

/* Envelope Container & 3D Stage */
.envelope-wrapper {
  position: relative;
  width: min(370px, 86vw);
  height: min(245px, 57vw);
  perspective: 1200px;
  margin: 0.5rem 0 2.2rem 0;
  cursor: pointer;
  opacity: 0;
  transform: translateY(24px);
  animation: entranceFadeUp 1.1s var(--ease-vintage) 0.2s forwards;
  touch-action: manipulation;
}

.envelope {
  position: relative;
  width: 100%;
  height: 100%;
  background: #EAE0CE;
  border-radius: 6px;
  box-shadow: var(--shadow-envelope);
  transition: transform 0.6s var(--ease-vintage), box-shadow 0.6s var(--ease-vintage);
  transform-style: preserve-3d;
}

.envelope-wrapper.is-hoverable:hover .envelope {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-envelope-hover);
}

.envelope-wrapper.is-opened .envelope {
  transform: translateY(8px) scale(1.03);
  box-shadow: var(--shadow-envelope-hover);
}

/* Envelope Back Interior */
.envelope-back {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #E2D5BF 0%, #D8C7AE 100%);
  border-radius: 6px;
  overflow: hidden;
}

/* Letter Sheet Tucked Inside */
.letter-sheet {
  position: absolute;
  top: 6px;
  left: 6%;
  width: 88%;
  height: 94%;
  background-color: var(--color-paper);
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(73, 56, 46, 0.12);
  z-index: 2;
  transition: transform 0.9s cubic-bezier(0.2, 0.9, 0.3, 1) 0.15s, opacity 0.8s ease;
  overflow: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.envelope-wrapper.is-opened .letter-sheet {
  transform: translateY(-85%) scale(1.02);
  box-shadow: 0 14px 28px rgba(73, 56, 46, 0.2);
  z-index: 6;
}

.letter-sheet-texture {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(154, 128, 104, 0.08) 1px,
    rgba(154, 128, 104, 0.08) 2px
  );
}

.sheet-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 0.4rem;
}

.sheet-line {
  height: 1.5px;
  background-color: rgba(154, 128, 104, 0.25);
  width: 90%;
  border-radius: 1px;
}

.sheet-line.short {
  width: 60%;
}

.stamp-accent {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 24px;
  height: 24px;
  border: 1px dashed var(--color-brown-muted);
  border-radius: 2px;
  opacity: 0.4;
}

/* Flaps Fold Construction using CSS polygons */
.flap {
  position: absolute;
  z-index: 3;
}

.flap-left {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F0E6D4 0%, #E7DBC7 100%);
  clip-path: polygon(0 0, 52% 50%, 0 100%);
}

.flap-right {
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(225deg, #EFE4D2 0%, #E2D5BF 100%);
  clip-path: polygon(100% 0, 48% 50%, 100% 100%);
}

.flap-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #F5EBDA 0%, #EBE0CD 100%);
  clip-path: polygon(0 100%, 50% 48%, 100% 100%);
}

.flap-top-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: top center;
  transform-style: preserve-3d;
  transition: transform 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 4;
}

.flap-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #F7EDE0 0%, #E8DCC9 100%);
  clip-path: polygon(0 0, 100% 0, 50% 55%);
  filter: drop-shadow(0 4px 6px rgba(73, 56, 46, 0.12));
}

.envelope-wrapper.is-opened .flap-top-wrapper {
  transform: rotateX(180deg);
  z-index: 1;
}

/* Wax Seal */
.wax-seal {
  position: absolute;
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.4s var(--ease-vintage);
  z-index: 5;
}

.envelope-wrapper.is-hoverable:hover .wax-seal {
  transform: translate(-50%, -50%) scale(1.06);
}

.wax-seal.breaking {
  transform: translate(-50%, -50%) scale(0.92);
  opacity: 0.8;
}

.wax-seal-outer {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 35% 35%, #9B3B33 0%, var(--color-wax) 55%, var(--color-wax-deep) 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(94, 32, 27, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(131, 50, 43, 0.5);
}

.wax-seal-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px dashed rgba(248, 241, 228, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F8F1E4;
}

.wax-icon {
  width: 16px;
  height: 16px;
  opacity: 0.9;
}

.envelope-shadow {
  position: absolute;
  bottom: -16px;
  left: 8%;
  width: 84%;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(73, 56, 46, 0.22) 0%, transparent 75%);
  filter: blur(8px);
  z-index: -1;
  transition: transform 0.6s ease, opacity 0.6s ease;
}

/* Call to Action Button */
.action-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  opacity: 0;
  transform: translateY(12px);
  animation: entranceFadeUp 1s var(--ease-vintage) 0.7s forwards;
  width: 100%;
}

.open-letter-btn {
  padding: 0.85rem 2.5rem;
  font-size: 1.2rem;
  min-height: 48px;
  touch-action: manipulation;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.open-letter-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.audio-prompt {
  font-size: 0.85rem;
  color: var(--color-brown-light);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: opacity 0.5s ease;
}

.audio-prompt.fade-out {
  opacity: 0.4;
}

.music-note-icon {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.open-flash-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(255, 248, 230, 0.5) 0%, rgba(243, 235, 221, 0.85) 100%);
  opacity: 0;
  transition: opacity 0.7s ease;
  z-index: 80;
}

.open-flash-overlay.active {
  opacity: 1;
}

@keyframes entranceFadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .envelope-screen {
    padding: max(1.5rem, env(safe-area-inset-top, 1.5rem)) 1rem max(2rem, env(safe-area-inset-bottom, 2rem)) 1rem;
  }
  .header-group {
    margin-bottom: 1.5rem;
  }
  .envelope-wrapper {
    margin: 0 0 1.8rem 0;
  }
  .open-letter-btn {
    width: 100%;
    max-width: 280px;
    padding: 0.85rem 1.5rem;
  }
}
</style>
