<template>
  <section class="letter-screen" aria-label="Nội dung bức thư viết tay">
    <!-- Top Navigation Bar -->
    <nav class="letter-top-nav">
      <button 
        class="vintage-btn-subtle back-btn" 
        @click="$emit('back')"
        aria-label="Quay lại phong thư mở đầu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Quay lại</span>
      </button>

      <!-- View Mode Selector Toggle: Single Page vs All 6 Pages -->
      <div class="view-mode-toggle">
        <button 
          class="mode-btn font-body"
          :class="{ active: viewMode === 'single' }"
          @click="viewMode = 'single'"
          title="Lật từng trang"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          </svg>
          <span>Từng trang</span>
        </button>

        <button 
          class="mode-btn font-body"
          :class="{ active: viewMode === 'all' }"
          @click="viewMode = 'all'"
          title="Xem trọn vẹn cả 6 trang thư"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="9" rx="1"></rect>
            <rect x="3" y="14" width="7" height="9" rx="1"></rect>
            <rect x="14" y="14" width="7" height="9" rx="1"></rect>
          </svg>
          <span>Tất cả 6 trang</span>
        </button>
      </div>
    </nav>

    <!-- Quick Page Jump Bar (Scrollable on mobile) -->
    <div v-if="viewMode === 'single'" class="quick-page-wrapper">
      <div class="quick-page-bar custom-hscroll">
        <button
          v-for="(page, idx) in letterPages"
          :key="page.id"
          class="quick-page-btn font-display"
          :class="{ active: currentIndex === idx }"
          @click="selectPage(idx)"
          :aria-label="`Chuyển đến trang ${idx + 1}`"
        >
          Trang {{ idx + 1 }}
        </button>
      </div>
    </div>

    <!-- MAIN READING CONTAINER -->
    <main class="paper-mat-wrapper">
      
      <!-- MODE 1: SINGLE PAGE READER -->
      <article v-if="viewMode === 'single'" class="vintage-paper-sheet">
        <!-- Paper Top Header -->
        <header class="sheet-top-header">
          <span class="watermark-tag font-display">A Letter for You</span>
          <span class="page-indicator font-display">
            Trang {{ currentIndex + 1 }} / {{ totalPages }}
          </span>
        </header>

        <!-- Current Page Image Container -->
        <div class="letter-image-container">
          <div 
            class="image-frame"
            @click="openLightbox(currentIndex)"
            title="Chạm để phóng to ảnh đọc rõ nét chữ"
            role="button"
            tabindex="0"
            @keydown.enter="openLightbox(currentIndex)"
          >
            <img 
              :src="getImageSrc(currentImage)" 
              :alt="`Trang ${currentIndex + 1} của bức thư viết tay`"
              class="letter-photo"
              loading="eager"
              @error="handleImageError(currentIndex)"
            />

            <!-- Hover / Touch Zoom Hint Badge -->
            <div class="zoom-hint font-body">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>Chạm để phóng to</span>
            </div>
          </div>
        </div>

        <!-- Navigation Bar for Single Page Mode -->
        <nav class="pagination-bar">
          <button 
            class="vintage-btn-secondary page-nav-btn" 
            :disabled="currentIndex === 0"
            @click="prevPage"
            aria-label="Trang trước"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Trang trước</span>
          </button>

          <!-- Thumbnail Dot Indicators -->
          <div class="page-dots">
            <span 
              v-for="(_, idx) in totalPages" 
              :key="idx" 
              class="dot"
              :class="{ active: currentIndex === idx }"
              @click="selectPage(idx)"
              :title="`Trang ${idx + 1}`"
            ></span>
          </div>

          <button 
            class="vintage-btn-secondary page-nav-btn" 
            :disabled="currentIndex >= totalPages - 1"
            @click="nextPage"
            aria-label="Trang tiếp theo"
          >
            <span>Trang tiếp</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </nav>
      </article>

      <!-- MODE 2: CONTINUOUS READING - ALL 6 PAGES -->
      <div v-else class="all-pages-flow">
        <article 
          v-for="(page, idx) in letterPages" 
          :key="page.id" 
          class="vintage-paper-sheet all-pages-sheet"
        >
          <header class="sheet-top-header">
            <span class="watermark-tag font-display">A Letter for You</span>
            <span class="page-indicator font-display">
              Trang {{ idx + 1 }} / {{ totalPages }}
            </span>
          </header>

          <div class="letter-image-container">
            <div 
              class="image-frame"
              @click="openLightbox(idx)"
              title="Chạm để phóng to ảnh đọc rõ nét chữ"
              role="button"
              tabindex="0"
              @keydown.enter="openLightbox(idx)"
            >
              <img 
                :src="getImageSrc(page)" 
                :alt="`Trang ${idx + 1} của bức thư viết tay`"
                class="letter-photo"
                loading="lazy"
                @error="handleImageError(idx)"
              />

              <div class="zoom-hint font-body">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <span>Chạm để phóng to</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Bottom Next Screen Call To Action -->
      <footer class="bottom-action-container">
        <button 
          class="vintage-btn-primary next-step-btn font-display"
          @click="$emit('next')"
          aria-label="Chuyển sang đọc lời nhắn cuối"
        >
          <span>Đọc lời nhắn cuối</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </footer>
    </main>

    <!-- Lightbox Zoom Modal Component for all 6 pages -->
    <LightboxModal 
      :is-open="isLightboxOpen"
      :pages="letterPages"
      :current-index="lightboxIndex"
      @close="isLightboxOpen = false"
      @update:current-index="lightboxIndex = $event"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { letterPages } from '../data/letter.js';
import LightboxModal from './LightboxModal.vue';

defineEmits(['back', 'next']);

const currentIndex = ref(0);
const lightboxIndex = ref(0);
const isLightboxOpen = ref(false);
const viewMode = ref('single'); // 'single' | 'all'
const imageFallbackAttempts = ref({});

const totalPages = computed(() => letterPages.length);
const currentImage = computed(() => letterPages[currentIndex.value] || letterPages[0]);

const getImageSrc = (page) => {
  if (!page) return '';
  const idx = page.pageNumber - 1;
  if (imageFallbackAttempts.value[idx]) {
    return page.fallbackSrc || page.src;
  }
  return page.src;
};

const handleImageError = (idx) => {
  if (!imageFallbackAttempts.value[idx]) {
    imageFallbackAttempts.value[idx] = true;
  }
};

const selectPage = (idx) => {
  currentIndex.value = idx;
};

const prevPage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextPage = () => {
  if (currentIndex.value < totalPages.value - 1) {
    currentIndex.value++;
  }
};

const openLightbox = (index) => {
  lightboxIndex.value = index;
  isLightboxOpen.value = true;
};

const handleKeydown = (e) => {
  if (isLightboxOpen.value) return;

  if (e.key === 'ArrowLeft') {
    prevPage();
  } else if (e.key === 'ArrowRight') {
    nextPage();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.letter-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: max(1.2rem, env(safe-area-inset-top, 1.2rem)) max(0.75rem, env(safe-area-inset-right, 0.75rem)) max(3.5rem, env(safe-area-inset-bottom, 3.5rem)) max(0.75rem, env(safe-area-inset-left, 0.75rem));
  z-index: 10;
  opacity: 0;
  transform: translateY(20px);
  animation: letterEntrance 0.8s var(--ease-vintage) forwards;
}

@keyframes letterEntrance {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Top Navigation Bar */
.letter-top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 900px;
  width: 100%;
  margin: 0 auto 0.8rem auto;
  padding: 0 0.25rem;
}

.back-btn {
  font-size: 1.05rem;
  padding: 0.35rem 0.65rem;
  touch-action: manipulation;
}

.view-mode-toggle {
  display: flex;
  background: rgba(248, 241, 228, 0.9);
  border: 1px solid var(--color-brown-muted);
  border-radius: var(--radius-full);
  padding: 2px;
  backdrop-filter: blur(8px);
}

.mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  color: var(--color-brown-dark);
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.mode-btn.active {
  background: var(--color-brown-dark);
  color: var(--color-paper-light);
}

/* Quick Page Bar (Horizontally scrollable on mobile) */
.quick-page-wrapper {
  max-width: 900px;
  width: 100%;
  margin: 0 auto 1.25rem auto;
  display: flex;
  justify-content: center;
}

.quick-page-bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  overflow-x: auto;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.quick-page-bar::-webkit-scrollbar {
  display: none;
}

.quick-page-btn {
  flex-shrink: 0;
  padding: 0.35rem 0.85rem;
  background: rgba(248, 241, 228, 0.8);
  border: 1px solid rgba(154, 128, 104, 0.3);
  border-radius: var(--radius-full);
  font-size: 0.92rem;
  color: var(--color-brown-dark);
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.quick-page-btn:hover {
  background: var(--color-paper-light);
  border-color: var(--color-brown-light);
}

.quick-page-btn.active {
  background: var(--color-brown-dark);
  color: var(--color-paper-light);
  border-color: var(--color-brown-dark);
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(73, 56, 46, 0.16);
}

/* Paper Sheet Layout */
.paper-mat-wrapper {
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vintage-paper-sheet {
  position: relative;
  width: 100%;
  background: var(--color-paper);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-paper-edge);
  box-shadow: var(--shadow-paper);
  padding: 2rem 2.25rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sheet-top-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid rgba(154, 128, 104, 0.18);
  padding-bottom: 0.6rem;
  margin-bottom: 1.25rem;
}

.watermark-tag {
  font-size: 0.95rem;
  font-style: italic;
  color: var(--color-brown-muted);
  letter-spacing: 0.05em;
}

.page-indicator {
  font-size: 1.15rem;
  font-style: italic;
  color: var(--color-brown-dark);
}

/* Image Container */
.letter-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0.25rem 0 0.85rem 0;
}

.image-frame {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: zoom-in;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(73, 56, 46, 0.08);
  touch-action: manipulation;
}

.letter-photo {
  display: block;
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 2px;
}

.zoom-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: rgba(40, 30, 24, 0.75);
  color: #F8F1E4;
  font-size: 0.8rem;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
  opacity: 0.85;
  pointer-events: none;
}

/* Pagination Bar */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid rgba(154, 128, 104, 0.18);
  width: 100%;
}

.page-dots {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-brown-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot.active {
  width: 20px;
  border-radius: 3px;
  background: var(--color-brown-dark);
}

.page-nav-btn {
  padding: 0.5rem 1.15rem;
  font-size: 0.95rem;
  min-height: 44px;
  touch-action: manipulation;
}

.page-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

/* Continuous Scroll (All 6 Pages) */
.all-pages-flow {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.all-pages-sheet {
  margin-bottom: 0;
}

/* Bottom Call to Action */
.bottom-action-container {
  margin-top: 1.5rem;
  text-align: center;
  width: 100%;
}

.next-step-btn {
  padding: 0.85rem 2.2rem;
  font-size: 1.2rem;
  min-height: 48px;
  touch-action: manipulation;
}

/* Responsive for Mobile Phones and iPad */
@media (max-width: 768px) {
  .vintage-paper-sheet {
    padding: 1.25rem 0.65rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
  }
  .sheet-top-header {
    padding: 0 0.35rem 0.5rem 0.35rem;
  }
  .letter-photo {
    max-height: 72vh;
    width: 100%;
  }
  .pagination-bar {
    padding: 0.85rem 0.25rem 0 0.25rem;
  }
  .page-nav-btn {
    padding: 0.45rem 0.85rem;
    font-size: 0.9rem;
  }
  .next-step-btn {
    width: 100%;
    max-width: 300px;
  }
  .quick-page-wrapper {
    justify-content: flex-start;
  }
}
</style>
