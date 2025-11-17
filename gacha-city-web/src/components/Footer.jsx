// src/components/Footer.jsx
import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-overlay'>
        <div className='footer-inner'>
          {/* LEFT: logo + mô tả */}
          <div className='footer-left'>
            <div className='footer-logo-row'>
              <img
                src='/gacha-logo.png'
                alt='Gacha City'
                className='footer-logo'
              />
              <h2 className='footer-title'>
                GACHA CITY
              </h2>
            </div>
            <p className='footer-desc'>
              Gacha City là máy chủ GTA V
              Roleplay, nơi người chơi nhập vai
              nhiều nghề nghiệp và xây dựng câu
              chuyện riêng trong một thành phố đô
              thị năng động. Server nổi bật nhờ
              cộng đồng thân thiện, nhiều hoạt
              động và hệ thống kinh tế phong phú,
              đem đến trải nghiệm nhập vai thú vị
              và đậm chất kỳ ảo.
            </p>
          </div>

          {/* RIGHT: social */}
          <div className='footer-right'>
            <span className='footer-follow'>
              THEO DÕI CHÚNG TÔI
            </span>
            <div className='footer-socials'>
              <a
                href='#'
                className='footer-social'
                target='_blank'
                rel='noreferrer'
              >
                <span className='footer-social-icon'>
                  f
                </span>
                <span className='footer-social-label'>
                  GACHA CITY
                </span>
              </a>

              <a
                href='#'
                className='footer-social'
                target='_blank'
                rel='noreferrer'
              >
                <span className='footer-social-icon'>
                  🎮
                </span>
                <span className='footer-social-label'>
                  GACHA CITY
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
