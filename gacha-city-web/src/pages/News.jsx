
// src/pages/News.jsx
import { useEffect, useState } from "react";
import "../css/News.css";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

import {
  getNews,
  getEvents,
  getNavbar,
  getCurrentUser,
} from "../api/strapi";

export default function News() {
  const [activeTab, setActiveTab] =
    useState("news"); // "news" | "event"

  const [newsList, setNewsList] = useState([]);
  const [eventList, setEventList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 3; // mỗi trang 3 item giống UI

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
  };

  // ====== LOAD DATA THEO TAB ======
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        if (activeTab === "news") {
          if (newsList.length === 0) {
            const items = await getNews();
            if (!cancelled) {
              setNewsList(items || []);
              setPage(1);
            }
          }
        } else {
          if (eventList.length === 0) {
            const items = await getEvents();
            if (!cancelled) {
              setEventList(items || []);
              setPage(1);
            }
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setError("Không lấy được dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    newsList.length,
    eventList.length,
  ]);

  const dataSource =
    activeTab === "news" ? newsList : eventList;

  const pageCount = Math.max(
    1,
    Math.ceil(dataSource.length / pageSize),
  );

  const goToPage = (p) => {
    if (p < 1 || p > pageCount) return;
    setPage(p);
  };

  const getPageNumbers = () => {
    if (pageCount <= 5) {
      return Array.from(
        { length: pageCount },
        (_, i) => i + 1,
      );
    }
    let start = Math.max(1, page - 2);
    let end = Math.min(pageCount, page + 2);
    if (end - start < 4) {
      if (start === 1) end = start + 4;
      else start = end - 4;
    }
    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i,
    );
  };

  const currentItems = dataSource.slice(
    (page - 1) * pageSize,
    page * pageSize,
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

      <main className='news-page'>
        <section className='news-shell'>
          {/* Tabs */}
          <div className='news-tabs'>
            <button
              className={
                "news-tab" +
                (activeTab === "news"
                  ? " active"
                  : "")
              }
              onClick={() => setActiveTab("news")}
            >
              Tin tức
            </button>
            <button
              className={
                "news-tab" +
                (activeTab === "event"
                  ? " active"
                  : "")
              }
              onClick={() =>
                setActiveTab("event")
              }
            >
              Sự kiện
            </button>
          </div>
          <div className='news-tab-underline' />

          {/* Nội dung theo tab */}
          {loading && (
            <div className='news-empty'>
              <p>Đang tải dữ liệu…</p>
            </div>
          )}

          {error && !loading && (
            <div className='news-empty error'>
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            currentItems.length === 0 && (
              <div className='news-empty'>
                <p>
                  {activeTab === "news"
                    ? "Chưa có tin tức."
                    : "Chưa có sự kiện."}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            currentItems.length > 0 && (
              <>
                <div className='news-list'>
                  {currentItems.map((item) => (
                    <article
                      key={item.id}
                      className='news-card'
                    >
                      <div className='news-card-inner'>
                        <div className='news-card-img'>
                          {item.img && (
                            <img
                              src={item.img}
                              alt={item.title}
                            />
                          )}
                        </div>

                        <div className='news-card-content'>
                          <div className='news-card-header'>
                            <h3 className='news-card-title'>
                              {item.title}
                            </h3>
                            <button className='news-card-detail'>
                              Chi tiết &gt;
                            </button>
                          </div>

                          <p className='news-card-desc'>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Phân trang */}
                <div className='news-pagination'>
                  <button
                    className='news-page-btn'
                    onClick={() => goToPage(1)}
                    disabled={page === 1}
                  >
                    Trang đầu
                  </button>

                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      className={
                        "news-page-btn square" +
                        (num === page
                          ? " active"
                          : "")
                      }
                      onClick={() =>
                        goToPage(num)
                      }
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className='news-page-btn'
                    onClick={() =>
                      goToPage(pageCount)
                    }
                    disabled={page === pageCount}
                  >
                    Trang cuối
                  </button>
                </div>
              </>
            )}
        </section>
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