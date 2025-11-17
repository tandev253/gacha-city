// src/components/Launcher.jsx
import "../css/Launcher.css";
export default function Launcher() {
  return (
    <section
      className='launcher-section'
    >
      <div className='launcher-container'>
        <div className='launcher-text-block'>
          <h2 className='launcher-title'>
            TẢI LAUNCHER
          </h2>
          <p className='launcher-sub'>
            Bạn là người mới? Hãy gia nhập cùng
            chúng tôi!
          </p>

          <div className='launcher-card'>
            <div className='launcher-card-inner'>
              {/* BƯỚC 1 */}
              <div className='launcher-step'>
                <div>
                  <h3 className='launcher-step-title'>
                    BƯỚC 1: TẢI GTA V LEGACY
                  </h3>
                  <p className='launcher-step-desc'>
                    Chúng tôi có cung cấp bản tải GTA V Legacy miễn phí.
                  </p>
                  <p className='launcher-step-desc'>
                    Hãy tải ngay để bắt đầu hành trình của bạn!
                  </p>
                </div>

                <a
                  className='launcher-step-download'
                  href='#'
                >
                  
                </a>
              </div>

              {/* BƯỚC 2 */}
              <div className='launcher-step'>
                <div>
                  <h3 className='launcher-step-title'>
                    BƯỚC 2: TẢI LAUNCHER
                  </h3>
                  <p className='launcher-step-desc'>
                    Thành Phố Gacha City sử dụng launcher riêng.
                  </p>
                  <p className='launcher-step-desc'>
                    Hãy tải launcher để kết nối với thành phố Gacha City xinh đẹp!
                  </p>
                </div>

                <a
                  className='launcher-step-download'
                  href='#'
                >
                  
                </a>
              </div>
            </div>

            {/* nhân vật bên phải */}
            <div className='launcher-character'>
              <img
                src='/launcher-man.png'
                alt='Gacha City Character'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
