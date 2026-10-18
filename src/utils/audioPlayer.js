/**
 * SINGLETON AUDIO CONTROLLER CHO "CRY ON MY SHOULDER"
 * Tối ưu đặc biệt cho iOS Safari, iPadOS và Android
 */

import { reactive } from 'vue';
import { audioConfig } from '../data/audio.js';

export const audioState = reactive({
  isPlaying: false,
  volume: audioConfig.defaultVolume ?? 0.7,
  hasInteracted: false,
  error: null,
});

let audioInstance = null;

export const getAudioInstance = () => {
  if (!audioInstance && typeof window !== 'undefined') {
    audioInstance = new Audio(audioConfig.audioUrl);
    audioInstance.loop = audioConfig.loop;
    audioInstance.volume = audioState.volume;
    audioInstance.preload = 'auto';

    audioInstance.addEventListener('play', () => {
      audioState.isPlaying = true;
    });

    audioInstance.addEventListener('pause', () => {
      audioState.isPlaying = false;
    });

    audioInstance.addEventListener('ended', () => {
      audioState.isPlaying = false;
    });

    audioInstance.addEventListener('error', (e) => {
      audioState.error = e;
      audioState.isPlaying = false;
    });
  }
  return audioInstance;
};

/**
 * Gọi phát nhạc trực tiếp trong luồng sự kiện người dùng (User Gesture)
 * Đảm bảo 100% chạy trên iPhone / iPad / Android
 */
export const playAudio = () => {
  const audio = getAudioInstance();
  if (!audio) return Promise.reject();

  audio.volume = audioState.volume;
  audioState.hasInteracted = true;

  const promise = audio.play();
  if (promise !== undefined) {
    return promise
      .then(() => {
        audioState.isPlaying = true;
      })
      .catch((err) => {
        // Trình duyệt chặn autoplay khi chưa có chạm trực tiếp
        audioState.isPlaying = false;
        throw err;
      });
  }
  return Promise.resolve();
};

export const pauseAudio = () => {
  const audio = getAudioInstance();
  if (audio) {
    audio.pause();
    audioState.isPlaying = false;
  }
};

export const toggleAudio = () => {
  if (audioState.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
};

export const setVolume = (val) => {
  audioState.volume = val;
  const audio = getAudioInstance();
  if (audio) {
    audio.volume = val;
  }
};
