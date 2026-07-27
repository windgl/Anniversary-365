import { useState, useEffect } from 'react';

// Hàm tính toán thời gian trôi qua (định nghĩa ngoài hook để tránh linter warning)
const calculateTimePassed = (startDate) => {
  const now = new Date();
  const difference = now.getTime() - startDate.getTime();

  // Nếu thời gian bắt đầu ở tương lai (phòng hờ lỗi), trả về 0
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  // Tính toán số ngày, giờ, phút, giây
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const useTimeCounter = (startDate, isPaused = false) => {
  // Khởi tạo state với giá trị tính toán ban đầu để tránh UI bị nháy ở giây đầu tiên
  const [timePassed, setTimePassed] = useState(() => calculateTimePassed(startDate));

  useEffect(() => {
    if (isPaused) return;

    // Thiết lập bộ đếm chạy mỗi giây
    const timer = setInterval(() => {
      setTimePassed(calculateTimePassed(startDate));
    }, 1000);

    // Cập nhật giá trị ban đầu nhưng hoãn ra khỏi cycle render hiện tại
    const immediateUpdate = setTimeout(() => {
      setTimePassed(calculateTimePassed(startDate));
    }, 0);

    // Cleanup function để dọn dẹp bộ nhớ khi component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(immediateUpdate);
    };
  }, [startDate, isPaused]); // Effect sẽ chạy lại nếu startDate thay đổi

  return timePassed;
};

export default useTimeCounter;