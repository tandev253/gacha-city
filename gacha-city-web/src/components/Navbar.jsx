import { useEffect, useState } from "react";
import "../css/Navbar.css";
import { getCurrentUser } from "../api/strapi";

export default function Navbar({
  links,
  onLoginClick,
  onRegisterClick,
}) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] =
    useState(null);
  const [accountOpen, setAccountOpen] =
    useState(false);

  const [auth, setAuth] = useState({
    loading: true,
    isLoggedIn: false,
    user: null,
  });

  const currentPath = window.location.pathname;

  // ===== LẤY TRẠNG THÁI LOGIN TỪ STRAPI (JWT trong localStorage) =====
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const user = await getCurrentUser();
        setAuth({
          loading: false,
          isLoggedIn: !!user,
          user: user || null,
        });
      } catch (err) {
        console.error("Auth check error:", err);
        setAuth((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    fetchAuth();
  }, []);

  // đóng menu khi resize lên desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
        setOpenDropdown(null);
        setAccountOpen(false);
      }
    };
    window.addEventListener(
      "resize",
      handleResize,
    );
    return () =>
      window.removeEventListener(
        "resize",
        handleResize,
      );
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
    setOpenDropdown(null);
    setAccountOpen(false);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((cur) =>
      cur === id ? null : id,
    );
  };

  const toggleAccount = () => {
    setAccountOpen((cur) => !cur);
  };

  const isLoggedIn = auth.isLoggedIn;
  const user = auth.user;

  // ===== Hàm gọi popup auth từ dropdown =====
  const handleLoginPopup = () => {
    handleLinkClick();
    onLoginClick?.();
  };

  const handleRegisterPopup = () => {
    handleLinkClick();
    onRegisterClick?.();
  };

  return (
    <header className='navbar'>
      <div className='navbar-left'>
        <div className='logo-glow'>
          <img
            src='/gacha-logo.png'
            className='navbar-logo'
            alt='Gacha City'
          />
        </div>
        <span className='navbar-brand'>
          GACHA CITY
        </span>
      </div>

       {/* Nút hamburger mobile */}
      <button
        className={`nav-toggle ${
          open ? "nav-toggle-open" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button> 

      <nav
        className={`navbar-right ${
          open ? "navbar-right-open" : ""
        }`}
      >
        {/* Các link bình thường (trừ Tài khoản, vì ta render riêng) */}
        {links?.map((l) => {
          // Filter tất cả các tên có chứa "tài khoản" hoặc "account" (không phân biệt hoa thường)
          const linkName = l.name?.toLowerCase().trim() || '';
          if (linkName.includes('tài khoản') || linkName.includes('account') || linkName === 'tai khoan') {
            return null;
          }

          const isChildActive =
            l.children?.some(
              (c) => currentPath === c.url,
            ) ?? false;

          const isSelfActive =
            currentPath === l.url ||
            (l.url !== "/" &&
              currentPath.startsWith(l.url));

          const isActive =
            isSelfActive || isChildActive;

          return l.children &&
            l.children.length ? (
            <div
              key={l.id}
              className={`nav-item dropdown ${
                openDropdown === l.id
                  ? "dropdown-open"
                  : ""
              }`}
            >
              <button
                type='button'
                className={`dropdown-toggle ${
                  isActive ? "active" : ""
                }`}
                onClick={() =>
                  toggleDropdown(l.id)
                }
              >
                {l.name}
                <span className='caret' />
              </button>

              <div className='dropdown-menu'>
                {l.children.map((c) => {
                  const isChildActive =
                    currentPath === c.url;
                  return (
                    <a
                      key={c.id}
                      href={c.url}
                      className={
                        isChildActive
                          ? "active"
                          : ""
                      }
                      onClick={handleLinkClick}
                    >
                      {c.name}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <a
              key={l.id}
              href={l.url}
              onClick={handleLinkClick}
              className={`nav-link ${
                isActive ? "active" : ""
              }`}
            >
              {l.name}
            </a>
          );
        })}

        {/* DROPDOWN TÀI KHOẢN */}
        <div
          className={`account-wrapper ${
            accountOpen ? "account-open" : ""
          }`}
        >
          <button
            type='button'
            className='account-toggle'
            onClick={toggleAccount}
          >
            {isLoggedIn ? (
              <>
                <div className='account-avatar-small'>
                  <img
                    src={
                      user?.avatar ||
                      "/default-avatar.png"
                    }
                    alt='avatar'
                  />
                </div>
                <span className='account-label'>
                  Tài khoản
                </span>
                <span className='caret' />
              </>
            ) : (
              <>
                <span className='account-label'>
                  Tài khoản
                </span>
                <span className='caret' />
              </>
            )}
          </button>

          <div className='account-dropdown'>
            {isLoggedIn ? (
              <div className='account-header'>
                <div className='account-avatar'>
                  <img
                    src={
                      user?.avatar ||
                      "/default-avatar.png"
                    }
                    alt='avatar'
                  />
                </div>
                <div className='account-text'>
                  <div className='account-title'>
                    Tên nhân vật
                  </div>
                  <div className='account-name'>
                    {user?.characterName ||
                      user?.username ||
                      "Noname"}
                  </div>
                </div>
              </div>
            ) : null}

            {!isLoggedIn && (
              <>
                <button
                  type='button'
                  className='account-item primary'
                  onClick={handleLoginPopup}
                >
                  Đăng nhập
                </button>
                <button
                  type='button'
                  className='account-item'
                  onClick={handleRegisterPopup}
                >
                  Đăng ký
                </button>
              </>
            )}

            <a
              href='/support'
              className='account-item'
              onClick={handleLinkClick}
            >
              Trợ giúp và hỗ trợ
            </a>

            {isLoggedIn && (
              <>
                <a
                  href='/change-password'
                  className='account-item'
                  onClick={handleLinkClick}
                >
                  Thay đổi mật khẩu
                </a>

                <a
                  href='/logout'
                  className='account-item'
                  onClick={handleLinkClick}
                >
                  Đăng xuất
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}