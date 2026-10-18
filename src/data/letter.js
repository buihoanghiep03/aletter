/**
 * CẤU HÌNH BỨC THƯ VIẾT TAY (HANDWRITTEN LETTER CONFIGURATION)
 * 6 Trang thư viết tay được đồng bộ từ thư mục public/images/letter/
 */

export const letterConfig = {
  title: 'Bức thư gửi em',
  subtitle: 'Chạm hoặc nhấp vào trang thư để phóng to đọc rõ từng nét chữ',
  totalPages: 6,
};

export const letterPages = [
  {
    id: 1,
    src: '/images/letter/letter-1.jpg',
    fallbackSrc: '/images/letter/letter-1.jpg.jpg',
    pageNumber: 1,
    title: 'Trang 1',
    description: 'Nét chữ đầu tiên gửi trao em',
  },
  {
    id: 2,
    src: '/images/letter/letter-2.jpg',
    fallbackSrc: '/images/letter/letter-2.jpg.jpg',
    pageNumber: 2,
    title: 'Trang 2',
    description: 'Trang thư thứ hai',
  },
  {
    id: 3,
    src: '/images/letter/letter-3.jpg',
    fallbackSrc: '/images/letter/letter-3.jpg.jpg',
    pageNumber: 3,
    title: 'Trang 3',
    description: 'Trang thư thứ ba',
  },
  {
    id: 4,
    src: '/images/letter/letter-4.jpg',
    fallbackSrc: '/images/letter/letter-4.jpg.jpg',
    pageNumber: 4,
    title: 'Trang 4',
    description: 'Trang thư thứ tư',
  },
  {
    id: 5,
    src: '/images/letter/letter-5.jpg',
    fallbackSrc: '/images/letter/letter-5.jpg.jpg',
    pageNumber: 5,
    title: 'Trang 5',
    description: 'Trang thư thứ năm',
  },
  {
    id: 6,
    src: '/images/letter/letter-6.jpg',
    fallbackSrc: '/images/letter/letter-6.jpg.jpg',
    pageNumber: 6,
    title: 'Trang 6',
    description: 'Trang thư thứ sáu',
  },
];
