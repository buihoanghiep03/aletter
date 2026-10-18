/**
 * CẤU HÌNH NHẠC NỀN & TỰ ĐỘNG PHÁT (BACKGROUND MUSIC CONFIGURATION)
 * 
 * Bài hát: Cry On My Shoulder (Tone Nữ)
 */

export const audioConfig = {
  title: 'Cry On My Shoulder',
  artist: 'Tone Nữ',
  // Đường dẫn file MP3 local hoặc link online
  audioUrl: '/audio/cry-on-my-shoulder.mp3',
  // Tự động lặp lại khi hết bài
  loop: true,
  // Tự động phát nhạc ngay khi mở trang
  autoplay: true,
  // Âm lượng mặc định (0.0 đến 1.0)
  defaultVolume: 0.7,
  // Tự động phát giai điệu piano Tone Nữ nếu file mp3 chưa được tải về
  enableSyntheticMelodyFallback: true,
};
