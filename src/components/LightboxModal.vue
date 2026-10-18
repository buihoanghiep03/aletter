<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div 
        v-if="isOpen" 
        class="lightbox-overlay" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Xem ảnh bức thư cỡ lớn"
        @click.self="close"
      >
        <!-- Top Toolbar -->
        <header class="lightbox-toolbar">
          <div class="toolbar-info">
            <span class="toolbar-title font-display">{{ currentPage?.title || 'Bức thư viết tay' }}</span>
            <span v-if="totalPages > 1" class="toolbar-counter font-body">
              Trang {{ currentIndex + 1 }} / {{ totalPages }}
            </span>
          </div>

          <!-- Controls: Zoom In, Zoom Out, Reset, Close -->
          <div class="toolbar-actions">
            <button 
              class="toolbar-btn zoom-btn" 
              @click="zoomIn" 
              title="Phóng to (+)" 
              aria-label="Phóng to"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>

            <button 
              class="toolbar-btn zoom-btn" 
              @click="zoomOut" 
              :disabled="scale <= 1"
              title="Thu nhỏ (-)" 
              aria-label="Thu nhỏ"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>

            <button 
              class="toolbar-btn reset-btn" 
              @click="resetZoom" 
              title="Đặt lại kích thước ban đầu" 
              aria-label="Đặt lại kích thước"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>

            <button 
              class="toolbar-btn close-btn" 
              @click="close" 
              title="Đóng (Esc)" 
              aria-label="Đóng"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <!-- Main Lightbox Image Viewport with Pan and Touch Swipe -->
        <main 
          class="lightbox-viewport"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
          @wheel.passive="handleWheel"
          @dblclick="toggleDoubleTapZoom"
        >
          <div 
            class="image-wrapper"
            :style="transformStyle"
            :class="{ 'is-draggable': scale > 1, 'is-dragging': isDragging }"
          >
            <img 
              :src="currentPage?.src" 
              :alt="currentPage?.alt || currentPage?.title || 'Ảnh bức thư viết tay'"
              class="lightbox-img"
              draggable="false"
            />
          </div>
        </main>

        <!-- Previous Page Button -->
        <button 
          v-if="currentIndex > 0"
          class="nav-arrow prev-arrow" 
          @click.stop="prevPage" 
          aria-label="Trang trước"
          title="Trang trước"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <!-- Next Page Button -->
        <button 
          v-if="currentIndex < totalPages - 1"
          class="nav-arrow next-arrow" 
          @click.stop="nextPage" 
          aria-label="Trang tiếp theo"
          title="Trang tiếp theo"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Mobile Quick Page Dot Navigation -->
        <div v-if="totalPages > 1" class="mobile-dots-indicator" aria-hidden="true">
          <span 
            v-for="(_, idx) in totalPages" 
            :key="idx" 
            class="mobile-dot"
            :class="{ active: currentIndex === idx }"
          ></span>
        </div>

        <!-- Subtle Help Tip at bottom -->
        <footer class="lightbox-footer font-body">
          <p>Chạm 2 lần để phóng to. Vuốt ngang để lật trang trên điện thoại & iPad.</p>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  pages: { type: Array, default: () => [] },
  currentIndex: { type: Number, default: 0 },
});

const emit = defineEmits(['close', 'update:currentIndex']);

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const startPos = { x: 0, y: 0 };

// Touch swipe tracking for phone & iPad
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const totalPages = computed(() => props.pages.length);
const currentPage = computed(() => props.pages[props.currentIndex] || null);

const transformStyle = computed(() => ({
  transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value})`,
  transition: isDragging.value ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1)',
}));

const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.5, 3.5);
};

const zoomOut = () => {
  if (scale.value > 1.2) {
    scale.value = Math.max(scale.value - 0.5, 1);
  } else {
    resetZoom();
  }
};

const toggleDoubleTapZoom = () => {
  if (scale.value > 1) {
    resetZoom();
  } else {
    scale.value = 2.2;
  }
};

const handleWheel = (e) => {
  if (e.deltaY < 0) {
    zoomIn();
  } else if (e.deltaY > 0) {
    zoomOut();
  }
};

const startDrag = (e) => {
  if (scale.value <= 1) return;
  isDragging.value = true;
  startPos.x = e.clientX - translateX.value;
  startPos.y = e.clientY - translateY.value;
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  translateX.value = e.clientX - startPos.x;
  translateY.value = e.clientY - startPos.y;
};

const stopDrag = () => {
  isDragging.value = false;
};

// Touch gestures
const onTouchStart = (e) => {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
};

const onTouchMove = (e) => {
  if (e.touches.length === 1) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
  }
};

const onTouchEnd = () => {
  if (scale.value > 1) return; // Don't swipe pages while zoomed in
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // Horizontal swipe detected
  if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < 0) {
      nextPage();
    } else {
      prevPage();
    }
  }
  touchStartX = 0;
  touchEndX = 0;
};

const prevPage = () => {
  if (props.currentIndex > 0) {
    resetZoom();
    emit('update:currentIndex', props.currentIndex - 1);
  }
};

const nextPage = () => {
  if (props.currentIndex < totalPages.value - 1) {
    resetZoom();
    emit('update:currentIndex', props.currentIndex + 1);
  }
};

const close = () => {
  resetZoom();
  emit('close');
};

const handleKeydown = (e) => {
  if (!props.isOpen) return;

  if (e.key === 'Escape') {
    close();
  } else if (e.key === 'ArrowLeft') {
    prevPage();
  } else if (e.key === 'ArrowRight') {
    nextPage();
  } else if (e.key === '+' || e.key === '=') {
    zoomIn();
  } else if (e.key === '-') {
    zoomOut();
  } else if (e.key === '0') {
    resetZoom();
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    resetZoom();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(25, 18, 14, 0.92);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  user-select: none;
  touch-action: pan-y pinch-zoom;
}

.lightbox-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: max(1rem, env(safe-area-inset-top, 1rem)) max(1.5rem, env(safe-area-inset-right, 1.5rem)) 0.8rem max(1.5rem, env(safe-area-inset-left, 1.5rem));
  background: linear-gradient(180deg, rgba(15, 10, 8, 0.85) 0%, transparent 100%);
  color: #F8F1E4;
  z-index: 10;
}

.toolbar-info {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}

.toolbar-title {
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.toolbar-counter {
  font-size: 0.92rem;
  color: #C2B29F;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(248, 241, 228, 0.12);
  color: #F8F1E4;
  border: 1px solid rgba(248, 241, 228, 0.2);
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.toolbar-btn:hover:not(:disabled) {
  background: rgba(248, 241, 228, 0.25);
  transform: scale(1.05);
}

.toolbar-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar-btn.close-btn:hover {
  background: rgba(131, 50, 43, 0.7);
  border-color: #83322B;
}

.lightbox-viewport {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;
}

.image-wrapper {
  max-width: 92vw;
  max-height: 82vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper.is-draggable {
  cursor: grab;
}

.image-wrapper.is-dragging {
  cursor: grabbing;
}

.lightbox-img {
  max-width: 92vw;
  max-height: 82vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.55);
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(248, 241, 228, 0.18);
  color: #F8F1E4;
  border: 1px solid rgba(248, 241, 228, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  touch-action: manipulation;
}

.nav-arrow:hover {
  background: rgba(248, 241, 228, 0.35);
  transform: translateY(-50%) scale(1.06);
}

.prev-arrow {
  left: 1rem;
}

.next-arrow {
  right: 1rem;
}

/* Mobile Quick Page Dots Indicator */
.mobile-dots-indicator {
  position: absolute;
  bottom: max(1.2rem, env(safe-area-inset-bottom, 1.2rem));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  z-index: 10;
}

.mobile-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(248, 241, 228, 0.3);
  transition: all 0.2s ease;
}

.mobile-dot.active {
  width: 18px;
  border-radius: 3px;
  background: #F8F1E4;
}

.lightbox-footer {
  text-align: center;
  padding: 0.6rem 1rem max(1rem, env(safe-area-inset-bottom, 1rem)) 1rem;
  font-size: 0.85rem;
  color: #B6A18A;
  background: linear-gradient(0deg, rgba(15, 10, 8, 0.85) 0%, transparent 100%);
  z-index: 10;
}

/* Lightbox Transitions */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-toolbar {
    padding: max(0.8rem, env(safe-area-inset-top, 0.8rem)) 1rem 0.5rem 1rem;
  }
  .toolbar-title {
    font-size: 1.15rem;
  }
  .lightbox-footer {
    display: none;
  }
  .prev-arrow {
    left: 0.5rem;
    width: 38px;
    height: 38px;
  }
  .next-arrow {
    right: 0.5rem;
    width: 38px;
    height: 38px;
  }
  .image-wrapper {
    max-width: 96vw;
    max-height: 80vh;
  }
  .lightbox-img {
    max-width: 96vw;
    max-height: 80vh;
  }
}
</style>
