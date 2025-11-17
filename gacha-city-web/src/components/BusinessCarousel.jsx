import { useState, useEffect } from "react";
import "../css/BusinessCarousel.css";

export default function BusinessCarousel({
  items = [],
}) {
  const [index, setIndex] = useState(0);

  // Khi list thay đổi → quay về slide đầu
  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <section className='biz-section'>
        <div className='biz-header'>
          <h2>DOANH NGHIỆP VÀ BAN NGÀNH</h2>
          <p>
            Tham khảo các doanh nghiệp và ban
            ngành trong thành phố để tìm kiếm công
            việc phù hợp với bạn.
          </p>
        </div>
        <p className='biz-empty'>
          Chưa có doanh nghiệp nào hoặc đang tải
          dữ liệu...
        </p>
      </section>
    );
  }

  const prev = () =>
    setIndex(
      (old) =>
        (old - 1 + items.length) % items.length,
    );

  const next = () =>
    setIndex((old) => (old + 1) % items.length);

  return (
    <section className='biz-section'>
      <div className='biz-header'>
        <h2>DOANH NGHIỆP VÀ BAN NGÀNH</h2>
        <p>
          Tham khảo các doanh nghiệp và ban ngành
          trong thành phố để tìm kiếm công việc
          phù hợp với bạn.
        </p>
      </div>

      <div className='biz-slider'>
        <button
          className='biz-arrow left'
          onClick={prev}
        >
          ‹
        </button>

        {/* viewport cố định, track trượt ngang giống FiveM */}
        <div className='biz-viewport'>
          <div
            className='biz-track'
            style={{
              transform: `translateX(-${
                index * 100
              }%)`,
            }}
          >
            {items.map((item, i) => (
              <div
                className='biz-slide'
                key={item.id}
              >
                <div
                  className={
                    "biz-card" +
                    (i === index ? " active" : "")
                  }
                >
                  <div className='biz-logo-wrap'>
                    {item.logoUrl && (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className='biz-logo'
                      />
                    )}
                  </div>

                  <div className='biz-name'>
                    {item.name}
                  </div>

                  <button className='biz-btn'>
                    {item.buttonLabel ||
                      "XEM CHI TIẾT"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className='biz-arrow right'
          onClick={next}
        >
          ›
        </button>
      </div>

      <div className='biz-dots'>
        {items.map((_, i) => (
          <button
            key={i}
            className={
              "biz-dot" +
              (i === index ? " active" : "")
            }
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
