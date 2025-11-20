// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

import {
  getNavbar,
  getCurrentUser,
  getProfile,
} from "../api/strapi";

export default function ProfilePage() {
  // ===== NAVBAR LINKS =====
  const [navLinks, setNavLinks] = useState([]);

  // ===== AUTH STATE =====
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] =
    useState("login"); // "login" | "register"

  const [auth, setAuth] = useState({
    loading: true,
    isLoggedIn: false,
    user: null,
  });

  // ===== PROFILE DATA =====
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] =
    useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  

  // ====== LOAD NAVBAR TỪ STRAPI ======
  useEffect(() => {
    async function loadNavbar() {
      try {
        const navbar = await getNavbar();
        const finalNavbar =
          Array.isArray(navbar) &&
          navbar.length > 0
            ? navbar
            : fallbackNavbar;
        setNavLinks(finalNavbar);
      } catch (err) {
        console.error("loadNavbar error:", err);
        setNavLinks(fallbackNavbar);
      }
    }
    loadNavbar();
  }, []);

  // ====== LẤY USER TỪ JWT ======
  useEffect(() => {
    async function loadAuth() {
      try {
        const user = await getCurrentUser();
        setAuth({
          loading: false,
          isLoggedIn: !!user,
          user: user || null,
        });
      } catch (err) {
        console.error("loadAuth error:", err);
        setAuth({
          loading: false,
          isLoggedIn: false,
          user: null,
        });
      }
    }
    loadAuth();
  }, []);

  // ====== HANDLER AUTH ======
  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  const handleLoginSuccess = (data) => {
    const { jwt, user } = data;

    localStorage.setItem("gc_jwt", jwt);
    localStorage.setItem(
      "gc_user",
      JSON.stringify(user),
    );

    setAuth({
      loading: false,
      isLoggedIn: true,
      user,
    });

    setAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("gc_jwt");
    localStorage.removeItem("gc_user");
    setAuth({
      loading: false,
      isLoggedIn: false,
      user: null,
    });
    setProfile(null);
  };

  // ====== LOAD PROFILE TỪ STRAPI ======
  useEffect(() => {
    if (auth.loading) return;

    let cancelled = false;

    async function loadProfile() {
      // chưa login thì cho về trang chủ (hoặc mở popup login)
      if (!auth.isLoggedIn) {
        setProfile(null);
        setError(
          "Bạn cần đăng nhập để xem trang cá nhân.",
        );
        setProfileLoading(false);
        // hoặc: navigate("/");
        return;
      }

      try {
        setProfileLoading(true);
        setError("");
        const data = await getProfile();
        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        console.error("loadProfile error:", err);
        if (!cancelled) {
          if (err.message === "NO_TOKEN") {
            setError(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            );
          } else {
            setError(
              "Không tải được thông tin tài khoản.",
            );
          }
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [auth.loading, auth.isLoggedIn, navigate]);

  const isLoading =
    auth.loading || profileLoading;

  const user = profile?.user;
  const histories = profile?.histories || [];
    const hasDiscordLinked = !!(
      user?.discordUser || user?.discordName
    );


  return (
    <>
      <Navbar
        links={navLinks}
        auth={auth}
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={handleLogout}
      />

      <main className='profile-page'>
        {isLoading && (
          <div className='profile-loading'>
            Đang tải trang cá nhân...
          </div>
        )}

        {!isLoading && error && (
          <div className='profile-error'>
            {error}
          </div>
        )}

        {!isLoading && !error && user && (
          <>
            {/* Banner + info */}
            <section className='profile-hero'>
              <div className='profile-hero-overlay' />

              <div className='profile-hero-content'>
                <div className='profile-user'>
                  <div className='profile-avatar'>
                    <img
                      src={user.avatarUrl}
                      alt='avatar'
                    />
                  </div>
                  <div className='profile-user-text'>
                    <div className='profile-label'>
                      Tên nhân vật
                    </div>
                    <div className='profile-name'>
                      {user.characterName ||
                        user.username}
                    </div>
                    <div className='profile-sub'>
                      @{user.username}
                    </div>
                  </div>
                </div>

                <div className='profile-actions'>
                  {hasDiscordLinked ? (
                    // ĐÃ LIÊN KẾT DISCORD
                    <button
                      className='btn-discord btn-discord-linked'
                      type='button'
                      disabled
                    >
                      Đã liên kết Discord
                    </button>
                  ) : (
                    // CHƯA LIÊN KẾT
                    <button
                      className='btn-discord'
                      type='button'
                      onClick={() =>
                        navigate(
                          "/lien-ket-discord",
                        )
                      }
                    >
                      Liên kết Discord
                    </button>
                  )}
                </div>
              </div>

              <div className='profile-tabs'>
                <button className='tab active'>
                  Tổng quan
                </button>
              </div>
            </section>

            {/* Discord link status */}
            <section className='profile-box discord-box'>
              <div className='discord-info'>
                <div className='discord-title'>
                  {hasDiscordLinked
                    ? "Tài khoản Discord đang liên kết"
                    : "Chưa liên kết Discord"}
                </div>
                <div className='discord-sub'>
                  {hasDiscordLinked
                    ? user.discordUser
                    : "Nhấn vào nút Liên kết Discord để kết nối tài khoản của bạn."}
                </div>
              </div>
              <button className='discord-display-name'>
                {hasDiscordLinked
                  ? ` ${
                      user.discordName ||
                      "Không có tên hiển thị"
                    }`
                  : " Chưa có tên hiển thị"}
              </button>
            </section>

            {/* Login history */}
            <section className='profile-box history-box'>
              <div className='history-header'>
                <div className='history-title'>
                  LỊCH SỬ ĐĂNG NHẬP
                </div>
                <button className='history-view-all'>
                  Xem tất cả &gt;
                </button>
              </div>

              <div className='history-list'>
                {histories.length === 0 && (
                  <div className='history-empty'>
                    Chưa có lịch sử đăng nhập.
                  </div>
                )}

                {histories.map((h) => (
                  <div
                    key={h.id}
                    className='history-item'
                  >
                    <div className='history-left'>
                      <div className='history-date'>
                        {h.dateDisplay}
                      </div>
                      <div className='history-location'>
                        Vào lúc {h.timeDisplay}{" "}
                        {h.city && `- ${h.city},`}{" "}
                        {h.country}
                      </div>
                    </div>

                    <div className='history-middle'>
                      {h.os || "Unknown OS"}
                    </div>

                    <div className='history-right'>
                      {h.durationDisplay}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* POPUP AUTH */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
