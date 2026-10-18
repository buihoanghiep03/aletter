<template>
  <section class="final-note-screen" aria-label="Lời nhắn kết thúc">
    <div class="note-container">
      
      <!-- Vintage Small Letter Paper -->
      <article class="note-paper">
        <!-- Botanical Dried Flower Sprig on Corner of Paper -->
        <div class="paper-flower-corner" aria-hidden="true">
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M95 15 C 80 35, 55 60, 20 85 C 10 92, 5 98, 2 102" 
                  stroke="#9A8068" stroke-width="1.6" stroke-linecap="round" opacity="0.8" />
            <path d="M65 42 C 55 52, 45 58, 35 62" 
                  stroke="#B6A18A" stroke-width="1.2" stroke-linecap="round" opacity="0.65" />
            
            <ellipse cx="78" cy="28" rx="8" ry="5" transform="rotate(30 78 28)" 
                     fill="#BA9788" stroke="#8D6858" stroke-width="0.8" opacity="0.8" />
            <ellipse cx="58" cy="46" rx="9" ry="6" transform="rotate(-20 58 46)" 
                     fill="#C2B29F" stroke="#9A8068" stroke-width="0.8" opacity="0.8" />
            <ellipse cx="38" cy="65" rx="7" ry="4" transform="rotate(25 38 65)" 
                     fill="#A88272" stroke="#825E50" stroke-width="0.7" opacity="0.75" />
            <circle cx="88" cy="20" r="3" fill="#8D6858" opacity="0.75" />
            <circle cx="94" cy="16" r="2.2" fill="#BA9788" opacity="0.8" />
          </svg>
        </div>

        <!-- Note Header -->
        <header class="note-header">
          <h1 class="note-title font-display">
            {{ finalNoteData.title }}
          </h1>
          <div class="title-divider" aria-hidden="true">
            <span class="divider-line"></span>
            <span class="divider-dot"></span>
            <span class="divider-line"></span>
          </div>
        </header>

        <!-- Paragraphs Fading In Gracefully with Stagger -->
        <div class="note-body font-body">
          <p 
            v-for="(para, index) in finalNoteData.paragraphs" 
            :key="index"
            class="note-paragraph"
            :style="{ animationDelay: `${0.35 + index * 0.22}s` }"
          >
            {{ para }}
          </p>
        </div>

        <!-- Sincere Signature -->
        <footer 
          class="note-footer font-display"
          :style="{ animationDelay: `${0.35 + finalNoteData.paragraphs.length * 0.22 + 0.2}s` }"
        >
          <div class="signature-line">
            {{ finalNoteData.signature }}
          </div>
        </footer>

        <!-- Soft Paper Texture Pattern -->
        <div class="paper-texture" aria-hidden="true"></div>
      </article>

      <!-- Peaceful Navigation Actions -->
      <nav 
        class="action-footer"
        :style="{ animationDelay: `${0.35 + finalNoteData.paragraphs.length * 0.22 + 0.45}s` }"
      >
        <button 
          class="vintage-btn-secondary return-envelope-btn font-display"
          @click="$emit('restart')"
          aria-label="Trở về phong thư mở đầu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>{{ finalNoteData.restartButtonText || 'Trở về phong thư' }}</span>
        </button>

        <button 
          class="vintage-btn-subtle review-letter-btn font-body"
          @click="$emit('backToLetter')"
          aria-label="Xem lại bức thư viết tay"
        >
          <span>{{ finalNoteData.backToLetterText || 'Xem lại bức thư' }}</span>
        </button>
      </nav>

    </div>
  </section>
</template>

<script setup>
import { finalNoteData } from '../data/finalNote.js';

defineEmits(['restart', 'backToLetter']);
</script>

<style scoped>
.final-note-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(2.5rem, env(safe-area-inset-top, 2.5rem)) max(1rem, env(safe-area-inset-right, 1rem)) max(4rem, env(safe-area-inset-bottom, 4rem)) max(1rem, env(safe-area-inset-left, 1rem));
  z-index: 10;
  opacity: 0;
  transform: translateY(18px);
  animation: noteEntrance 1s var(--ease-vintage) forwards;
}

@keyframes noteEntrance {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.note-container {
  max-width: 680px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* The Paper Note Card */
.note-paper {
  position: relative;
  width: 100%;
  background: var(--color-paper);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-paper-edge);
  box-shadow: var(--shadow-paper);
  padding: 3.5rem 3.2rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

/* Botanical Corner Accent */
.paper-flower-corner {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
  filter: drop-shadow(0 4px 6px rgba(73, 56, 46, 0.08));
  animation: gentleSway 8s ease-in-out infinite alternate;
}

@keyframes gentleSway {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(2deg) translate(1px, -1px); }
}

/* Header */
.note-header {
  margin-bottom: 2.25rem;
  text-align: center;
}

.note-title {
  font-size: clamp(2rem, 5vw, 2.7rem);
  font-weight: 500;
  font-style: italic;
  color: var(--color-brown-dark);
  letter-spacing: 0.02em;
  margin-bottom: 0.85rem;
  opacity: 0;
  animation: fadeParagraph 0.8s var(--ease-vintage) 0.2s forwards;
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  opacity: 0.6;
}

.divider-line {
  width: 42px;
  height: 1px;
  background-color: var(--color-brown-muted);
}

.divider-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-brown-light);
}

/* Paragraphs */
.note-body {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  margin-bottom: 2.5rem;
}

.note-paragraph {
  font-size: clamp(1.02rem, 2.4vw, 1.15rem);
  line-height: 1.85;
  color: var(--color-brown-dark);
  text-align: justify;
  text-justify: inter-word;
  opacity: 0;
  transform: translateY(12px);
  animation: fadeParagraph 0.8s var(--ease-vintage) forwards;
}

/* Signature */
.note-footer {
  text-align: right;
  padding-top: 1rem;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeParagraph 0.8s var(--ease-vintage) forwards;
}

.signature-line {
  font-size: 1.3rem;
  font-style: italic;
  color: var(--color-brown-dark);
  letter-spacing: 0.04em;
}

/* Background Subtle Paper Texture */
.paper-texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(154, 128, 104, 0.1) 2px,
    rgba(154, 128, 104, 0.1) 4px
  );
}

/* Navigation Actions at bottom */
.action-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeParagraph 0.8s var(--ease-vintage) forwards;
  width: 100%;
}

.return-envelope-btn {
  padding: 0.8rem 2.2rem;
  font-size: 1.15rem;
  min-height: 48px;
  touch-action: manipulation;
}

.review-letter-btn {
  font-size: 1rem;
  color: var(--color-brown-light);
  min-height: 44px;
  touch-action: manipulation;
}

@keyframes fadeParagraph {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .final-note-screen {
    padding: max(1.8rem, env(safe-area-inset-top, 1.8rem)) 1rem max(3rem, env(safe-area-inset-bottom, 3rem)) 1rem;
  }
  .note-paper {
    padding: 2.25rem 1.25rem;
  }
  .note-paragraph {
    text-align: left;
    line-height: 1.75;
    font-size: 1.02rem;
  }
  .paper-flower-corner svg {
    width: 80px;
    height: 80px;
  }
  .return-envelope-btn {
    width: 100%;
    max-width: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .paper-flower-corner {
    animation: none;
  }
}
</style>
