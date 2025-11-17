// src/pages/Guide.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
import "../css/Guide.css";
import {
  getNavbar,
  getCurrentUser,
} from "../api/strapi";

export default function Guide() {
  // ===== NAVBAR LINKS =====
  const [navLinks, setNavLinks] = useState([]);

  // ===== AUTH STATE (giống Home) =====
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

  // ====== LẤY USER TỪ JWT (giống Home) ======
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

  return (
    <>
      <Navbar
        links={navLinks}
        auth={auth}
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={handleLogout}
      />

      <section className='guide-page'>
        {/* ======== TITLE 1 ======== */}
        <h2 className='guide-title'>
          HƯỚNG DẪN VÀO THÀNH PHỐ
        </h2>
        <p className='guide-sub'>
          Bạn là người mới? Hãy gia nhập cùng
          chúng tôi!
        </p>

        <div className='guide-top'>
          <img
            src='/gta-cover.png'
            alt='GTA V'
            className='guide-main-img'
          />

          <div className='steps-right'>
            <div className='step-box neon-border'>
              <h3>BƯỚC 1: MUA GTA V</h3>
              <p>
                Tải và cài đặt Grand Theft Auto V
                từ Epic Games hoặc Steam. Đảm bảo
                bạn mua bản gốc mới chơi được
                server.
              </p>
              <div className='icon-row'>
                <img
                  src='/epic.png'
                  className='icon'
                />
                <img
                  src='/steam.png'
                  className='icon'
                />
              </div>
            </div>

            <div className='step-box neon-border'>
              <h3>BƯỚC 2: TẢI LAUNCHER</h3>
              <p>
                Mở GTA V và nhập IP server được
                cung cấp để kết nối. Hãy tuân thủ
                luật của thành phố để trải nghiệm
                tốt nhất.
              </p>
            </div>

            <div className='step-box neon-border'>
              <h3>
                BƯỚC 3: VÀO DISCORD THÀNH PHỐ
              </h3>
              <p>
                Vào máy chủ Discord chính thức của
                thành phố để nhận hướng dẫn, luật
                và hỗ trợ từ server. Đừng quên xác
                minh tài khoản để được cấp quyền
                truy cập đầy đủ.
              </p>
            </div>
          </div>
        </div>

        {/* ======== TITLE 2 ======== */}
        <h2 className='guide-title'>
          HƯỚNG DẪN CHO NGƯỜI MỚI VÀO THÀNH PHỐ
        </h2>
        <p className='guide-sub'>
          Bạn là người mới? Hãy nhập cư cùng chúng
          tôi!
        </p>

        <div className='steps-grid'>
          <div className='step-box neon-border'>
            <h3>BƯỚC 1: HẠ CÁNH NHẬP CƯ</h3>
            <p>
              Chạy bộ qua Sở di trú sau đó tiến
              hành lấy xe thuê 1, làm vài công
              việc cơ bản để kiếm vốn ban đầu.
            </p>
          </div>

          <div className='step-box neon-border'>
            <h3>BƯỚC 2: KHỞI NGHIỆP TÂN THỦ</h3>
            <p>
              Làm nghề nông dân ở 91 để có vốn ban
              đầu. Hoặc lái xe buýt với thu nhập
              ổn định, sau đó chuyển sang nghề
              khác phù hợp hơn.
            </p>
          </div>

          <div className='step-box neon-border'>
            <h3>BƯỚC 3: RẤT QUAN TRỌNG!</h3>
            <p>
              Cập nhật tên Discord theo đúng định
              dạng "ID | Tên" và tuân thủ luật để
              có trải nghiệm tốt nhất.
            </p>
          </div>

          <div className='step-box neon-border note-box'>
            <h3>LƯU Ý</h3>
            <p>
              Đồ ăn thức uống rất đắt nên hãy dùng
              tiết kiệm. Ngủ nghỉ đầy đủ để tránh
              kiệt sức. Tôn trọng mọi người trong
              thành phố và tuân thủ các quy định
              để tránh bị phạt.
            </p>
          </div>
        </div>
      </section>
        <Footer />
      {/* POPUP AUTH (dùng chung với Navbar) */}
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