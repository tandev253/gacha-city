import { useState, useEffect } from "react";
import "../css/NewsHighlight.css";

export default function NewsHighlight({
  slides = [],
}) {
  const [index, setIndex] = useState(0);

  // khi dữ liệu mới về → quay về slide đầu
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <section className='news-section'>
        <h3 className='news-subtitle'>
          TIN TỨC NỔI BẬT
        </h3>
        <p className='news-desc'>
          Cập nhật tin tức mới nhất của thành phố
        </p>
        <p
          style={{ marginTop: 20, opacity: 0.6 }}
        >
          Chưa có tin tức hoặc đang tải dữ liệu...
        </p>
      </section>
    );
  }

  const next = () =>
    setIndex((index + 1) % slides.length);

  const prev = () =>
    setIndex(
      (index - 1 + slides.length) % slides.length,
    );

  const current = slides[index];

  return (
    <section className='news-section'>
      <h3 className='news-subtitle'>
        TIN TỨC NỔI BẬT
      </h3>
      <p className='news-desc'>
        Cập nhật tin tức mới nhất của thành phố
      </p>

      <div className='news-content'>
        <div className='news-left'>
          <h2 className='news-title'>
            {current.title}
          </h2>

          <p className='news-text'>
            {current.desc}
          </p>

          <button className='news-btn'>
            XEM CHI TIẾT
          </button>
        </div>

        <div className='news-right'>
          <button
            className='arrow arrow-left'
            onClick={prev}
          >
            ❮
          </button>

          <div className='news-image-box'>
            <img
              src={current.img}
              alt={current.title}
            />
          </div>

          <button
            className='arrow arrow-right'
            onClick={next}
          >
            ❯
          </button>
        </div>
      </div>

      <div className='dots'>
        {slides.map((_, i) => (
          <span
            key={i}
            className={
              i === index ? "dot active" : "dot"
            }
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
