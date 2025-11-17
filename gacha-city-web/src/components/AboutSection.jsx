import "../css/AboutSection.css";

const IMG_BASE =
  import.meta.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

export default function AboutSection({ data }) {
  if (!data) return null;

  const thumb = data.videoThumbnail;
  const rawUrl =
    thumb?.data?.attributes?.url ||
    thumb?.url ||
    "";

  const img = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : `${IMG_BASE}${rawUrl}`
    : "/fallback.png";

  const fbUrl = data.socialFacebook;
  const discordUrl = data.socialDiscord;

  return (
    <section className='about-section'>
      <div className='media-left'>
        <h3 className='media-title'>MEDIA</h3>
        <p className='media-subtitle'>
          Các phương tiện truyền thông của thành
          phố
        </p>

        <div className='video-box'>
          <img
            src={img}
            className='video-thumb'
            alt="Video thumbnail"
          />
          <span className='video-play'>▶</span>
        </div>

        <div className='social'>
          <h4>THEO DÕI CHÚNG TÔI</h4>

          <div className='social-row'>
            <a href={fbUrl} className='icon' target="_blank" rel="noopener noreferrer">
              <img src='/icon-fb.png' alt="Facebook" />
              <span>GACHA CITY</span>
            </a>

            <a href={discordUrl} className='icon' target="_blank" rel="noopener noreferrer">
              <img src='/icon-discord.png' alt="Discord" />
              <span>GACHA CITY</span>
            </a>
          </div>
        </div>
      </div>

      <div className='media-right'>
        <h3 className='about-title'>
          VỀ CHÚNG TÔI
        </h3>
        <h1 className='about-name'>GACHA CITY</h1>

        <p className='about-desc'>
          {data.description}
        </p>

        <div className='btn-row'>
          <a className='btn-primary'>
            {data.faqButtonLabel || "HỎI ĐÁP"}
          </a>
          <a className='btn-outline'>
            {data.guideButtonLabel ||
              "HƯỚNG DẪN CHI TIẾT"}
          </a>
        </div>
      </div>
    </section>
  );
}