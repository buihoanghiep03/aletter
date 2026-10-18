<template>
  <div class="audio-control-wrapper" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Vinyl Pill Button -->
    <button
      class="audio-toggle-btn"
      :class="{ 'is-playing': audioState.isPlaying, 'needs-interaction': !audioState.isPlaying }"
      :title="audioState.isPlaying ? 'Tạm dừng bài hát' : 'Phát bài hát: Cry On My Shoulder'"
      :aria-label="audioState.isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'"
      @click="toggleAudio"
    >
      <!-- Vintage Vinyl Record Disc -->
      <span class="vinyl-disc" :class="{ spinning: audioState.isPlaying }">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8" />
          <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
          <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.2" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
      </span>

      <!-- Song Name Display -->
      <div class="audio-info">
        <span class="song-title font-display">Cry On My Shoulder</span>
      </div>

      <!-- Live Equalizer Bars -->
      <div v-if="audioState.isPlaying" class="sound-bars" aria-hidden="true">
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
        <span class="bar bar-3"></span>
        <span class="bar bar-4"></span>
      </div>
      <div v-else class="play-icon-hint" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
    </button>

    <!-- Mini Volume Control Panel on Hover / Click -->
    <Transition name="fade-popup">
      <div v-if="isHovered || showSettings" class="audio-mini-panel" @click.stop>
        <div class="panel-header">
          <p class="panel-title font-display">Cry On My Shoulder</p>
          <span class="panel-status font-body">
            {{ audioState.isPlaying ? 'Đang phát' : 'Đã tạm dừng' }}
          </span>
        </div>

        <!-- Volume Slider -->
        <div class="volume-control">
          <span class="vol-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            v-model.number="volumeVal" 
            @input="onVolumeChange" 
            class="vintage-slider"
            aria-label="Điều chỉnh âm lượng"
          />
          <span class="vol-percent font-body">{{ Math.round(volumeVal * 100) }}%</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { audioState, playAudio, toggleAudio, setVolume, getAudioInstance } from '../utils/audioPlayer.js';

const isHovered = ref(false);
const showSettings = ref(false);
const volumeVal = ref(audioState.volume);

const onVolumeChange = () => {
  setVolume(volumeVal.value);
};

onMounted(() => {
  // Preload audio instance
  getAudioInstance();
  // Attempt autoplay immediately
  playAudio().catch(() => {
    // Autoplay blocked by browser policy on load (waiting for first user touch)
  });
});
</script>

<style scoped>
.audio-control-wrapper {
  position: fixed;
  top: max(1rem, env(safe-area-inset-top, 1rem));
  right: max(1rem, env(safe-area-inset-right, 1rem));
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.audio-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 1rem;
  background-color: rgba(248, 241, 228, 0.95);
  border: 1px solid var(--color-brown-muted);
  border-radius: var(--radius-full);
  color: var(--color-brown-dark);
  box-shadow: 0 4px 18px rgba(73, 56, 46, 0.14);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all var(--transition-fast);
  touch-action: manipulation;
}

.audio-toggle-btn:hover {
  background-color: var(--color-paper-light);
  border-color: var(--color-brown-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(73, 56, 46, 0.2);
}

.audio-toggle-btn.needs-interaction {
  animation: subtlePulse 3s ease-in-out infinite;
}

@keyframes subtlePulse {
  0%, 100% {
    box-shadow: 0 4px 18px rgba(73, 56, 46, 0.14);
  }
  50% {
    box-shadow: 0 4px 22px rgba(131, 50, 43, 0.35);
    border-color: var(--color-wax);
  }
}

.vinyl-disc {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brown-light);
  transition: color var(--transition-fast);
}

.is-playing .vinyl-disc {
  color: var(--color-wax);
}

.vinyl-disc.spinning {
  animation: spinVinyl 5s linear infinite;
}

@keyframes spinVinyl {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.audio-info {
  display: flex;
  align-items: center;
}

.song-title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-brown-dark);
}

.sound-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}

.bar {
  width: 2px;
  background-color: var(--color-wax);
  border-radius: 1px;
}

.bar-1 { height: 45%; animation: soundBar 0.9s ease-in-out infinite alternate; }
.bar-2 { height: 90%; animation: soundBar 1.2s ease-in-out infinite alternate 0.15s; }
.bar-3 { height: 65%; animation: soundBar 0.8s ease-in-out infinite alternate 0.3s; }
.bar-4 { height: 35%; animation: soundBar 1.1s ease-in-out infinite alternate 0.45s; }

@keyframes soundBar {
  0% { height: 20%; }
  100% { height: 100%; }
}

.play-icon-hint {
  display: flex;
  align-items: center;
  color: var(--color-wax);
  margin-left: 2px;
}

/* Mini Panel */
.audio-mini-panel {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 240px;
  background: rgba(248, 241, 228, 0.97);
  border: 1px solid var(--color-brown-muted);
  border-radius: var(--radius-md);
  padding: 0.9rem 1rem;
  box-shadow: 0 10px 28px rgba(73, 56, 46, 0.22);
  backdrop-filter: blur(12px);
  z-index: 65;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid rgba(154, 128, 104, 0.2);
  padding-bottom: 0.4rem;
}

.panel-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-brown-dark);
}

.panel-status {
  font-size: 0.78rem;
  color: var(--color-brown-light);
  font-style: italic;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.vol-icon {
  color: var(--color-brown-light);
  display: flex;
}

.vintage-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  background: #DCCFBC;
  border-radius: 2px;
  outline: none;
}

.vintage-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-brown-dark);
  cursor: pointer;
}

.vol-percent {
  font-size: 0.8rem;
  color: var(--color-brown-light);
  min-width: 30px;
  text-align: right;
}

.fade-popup-enter-active,
.fade-popup-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-popup-enter-from,
.fade-popup-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Mobile & iPad Responsive */
@media (max-width: 768px) {
  .audio-control-wrapper {
    top: max(0.75rem, env(safe-area-inset-top, 0.75rem));
    right: max(0.75rem, env(safe-area-inset-right, 0.75rem));
  }
  .audio-toggle-btn {
    padding: 0.45rem 0.85rem;
    gap: 0.5rem;
  }
  .song-title {
    font-size: 0.88rem;
  }
  .audio-mini-panel {
    width: 220px;
  }
}
</style>
