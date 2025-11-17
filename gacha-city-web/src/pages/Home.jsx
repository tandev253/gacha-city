// src/pages/Home.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Launcher from "../components/Launcher";
import NewsHighlight from "../components/NewsHighlight";
import BusinessCarousel from "../components/BusinessCarousel";
import AboutSection from "../components/AboutSection";
import AuthModal from "../components/AuthModal";
// import {
//   getDashboard,
//   getNavbar,
//   getNews,
//   getBusinesses,
//   getAboutSection,
//   getCurrentUser, // 👈 thêm
// } from "../api/strapi";

export default function Home() {
  const [navLinks, setNavLinks] = useState([]);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    onlinePlayers: 0,
  });
  const [newsSlides, setNewsSlides] = useState(
    [],
  );
  const [businesses, setBusinesses] = useState(
    [],
  );
  const [about, setAbout] = useState(null);

  // ========= STATE POPUP AUTH =========
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] =
    useState("login"); // "login" | "register"

  // ========= STATE AUTH TOÀN TRANG =========
  const [auth, setAuth] = useState({
    loading: true,
    isLoggedIn: false,
    user: null,
  });

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  // ========= FALLBACK NAVBAR =========
  const fallbackNavbar = [
    {
      id: 0,
      name: "Trang chủ",
      url: "/",
      children: [],
    },
    {
      id: 1,
      name: "Hướng dẫn",
      url: "/huong-dan",
      children: [],
    },
    {
      id: 2,
      name: "Tin tức",
      url: "/tin-tuc",
      children: [],
    },
    {
      id: 3,
      name: "Donate",
      url: "/donate",
      children: [],
    },
    {
      id: 4,
      name: "Tài khoản",
      url: "/tai-khoan",
      children: [],
    },
  ];

  // ====== LOAD DATA STRAPI (navbar, dashboard, ...) ======
  useEffect(() => {
    async function load() {
      try {
        const [
          navbar,
          dashboard,
          news,
          biz,
          aboutData,
        ] = await Promise.all([
          getNavbar(),
          getDashboard(),
          getNews(),
          getBusinesses(),
          getAboutSection(),
        ]);

        const finalNavbar =
          Array.isArray(navbar) &&
          navbar.length > 0
            ? navbar
            : fallbackNavbar;

        setNavLinks(finalNavbar);
        setStats({
          totalPlayers:
            dashboard?.totalPlayers ?? 0,
          onlinePlayers:
            dashboard?.onlinePlayers ?? 0,
        });
        setNewsSlides(news || []);
        setBusinesses(biz || []);
        setAbout(aboutData || []);
      } catch (e) {
        console.error(e);
        setNavLinks(fallbackNavbar);
        setNewsSlides([]);
        setBusinesses([]);
        setAbout(null);
      }
    }

    load();
  }, []);

  // ====== LẤY USER TỪ JWT MỖI LẦN LOAD TRANG ======
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

  // ====== KHI LOGIN THÀNH CÔNG (AuthModal báo lên) ======
  const handleLoginSuccess = (data) => {
    // data = result.data từ authLogin (jwt + user)
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

    setAuthOpen(false); // đóng popup
  };

  // ====== LOGOUT ======
  const handleLogout = () => {
    localStorage.removeItem("gc_jwt");
    localStorage.removeItem("gc_user");
    setAuth({
      loading: false,
      isLoggedIn: false,
      user: null,
    });
  };

  useEffect(() => {
    document.body.classList.add("bg-home");
    return () => {
      document.body.classList.remove("bg-home");
    };
  }, []);

  return (
    <>
      <Navbar
        links={navLinks}
        auth={auth} // 👈 truyền auth xuống
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={handleLogout} // 👈 truyền logout xuống
      />

      <Hero
        total={stats.totalPlayers}
        online={stats.onlinePlayers}
      />
      <Launcher />
      <NewsHighlight slides={newsSlides} />
      <BusinessCarousel items={businesses} />
      <AboutSection data={about} />

      {/* POPUP AUTH */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
        onLoginSuccess={handleLoginSuccess} // 👈 callback
      />
    </>
  );
}
