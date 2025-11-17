import "../css/Hero.css";

export default function Hero({ total, online }) {
  return (
    <section className='hero'>
      <div className='overlay'></div>

      <div className='hero-content'>
        <div className='left-box'>
          <h2>Chào mừng đến với</h2>

          <h1 className='title'>
            GACHA <span>CITY</span>
          </h1>
        </div>
        <div className='right-box'>
          <div className='stats'>
            <div className='border-stat'>
              <div className='stat-box'>
                <label>TOTAL</label>
                <div className='value'>
                  {total}
                </div>
              </div>
            </div>
            <div className='border-stat'>
              <div className='stat-box'>
                <label>ONLINE</label>
                <div className='value'>
                  {online}
                </div>
              </div>
            </div>
          </div>
          <div className='border-stat'>
            <button className='join'>
              THAM GIA NGAY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
