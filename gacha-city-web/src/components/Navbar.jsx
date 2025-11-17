// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({
  links,
  auth, // { loading, isLoggedIn, user }
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] =
    useState(null);
  const [accountOpen, setAccountOpen] =
    useState(false);

  // lấy path hiện tại từ react-router
  const location = useLocation();
  const currentPath = location.pathname;

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

  const isLoggedIn = auth?.isLoggedIn;
  const user = auth?.user;

  // popup auth
  const handleLoginPopup = () => {
    handleLinkClick();
    onLoginClick?.();
  };

  const handleRegisterPopup = () => {
    handleLinkClick();
    onRegisterClick?.();
  };

  // toggle tài khoản (KHÔNG auto mở popup nữa)
  const toggleAccount = () => {
    setAccountOpen((cur) => !cur);
    setOpenDropdown(null); // đóng các dropdown khác nếu có
  };

  const avatarUrl =
    user?.avatar ||
    user?.avatarUrl ||
    "/default-avatar.png";

  const displayName =
    user?.characterName ||
    user?.username ||
    "Noname";

  // những path coi là "khu tài khoản" -> highlight
  const accountPaths = [
    "/tai-khoan",
    "/profile",
    "/support",
    "/change-password",
  ];
  const isAccountActive = accountPaths.some((p) =>
    currentPath.startsWith(p),
  );

  return (
    <header className='navbar'>
      <div className='navbar-left'>
        <div className='logo-glow'>
          <Link to='/' onClick={handleLinkClick}>
            <img
              src='/gacha-logo.png'
              className='navbar-logo'
              alt='Gacha City'
            />
          </Link>
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
          const nameNormalized = l.name
            ?.trim()
            .toLowerCase();

          // bỏ qua menu tài khoản lấy từ Strapi
          if (nameNormalized === "tài khoản")
            return null;

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

          // có submenu  
          if (l.children && l.children.length) {
            return (
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
                      <Link
                        key={c.id}
                        to={c.url}
                        className={
                          isChildActive
                            ? "active"
                            : ""
                        }
                        onClick={handleLinkClick}
                      >
                        {c.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          // link thường
          return (
            <Link
              key={l.id}
              to={l.url}
              onClick={handleLinkClick}
              className={`nav-link ${
                isActive ? "active" : ""
              }`}
            >
              {l.name}
            </Link>
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
            className={`account-toggle ${
              isAccountActive ? "active" : ""
            }`}
            onClick={toggleAccount}
          >
            {isLoggedIn ? (
              <>
                <div className='account-avatar-small'>
                  <img
                    src={avatarUrl}
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

          {/* ĐÃ LOGIN: dropdown lớn */}
          {isLoggedIn && accountOpen && (
            <div className='account-dropdown'>
              <div className='account-header'>
                <div className='account-avatar'>
                  <img
                    src={avatarUrl}
                    alt='avatar'
                  />
                </div>
                <div className='account-text'>
                  <div className='account-title'>
                    Tên nhân vật
                  </div>
                  <div className='account-name'>
                    {displayName}
                  </div>
                </div>
              </div>

              <Link
                to='/profile'
                className='account-item'
                onClick={handleLinkClick}
              >
                Trang cá nhân
              </Link>

              <Link
                to='/support'
                className='account-item'
                onClick={handleLinkClick}
              >
                Trợ giúp và hỗ trợ
              </Link>

              <Link
                to='/change-password'
                className='account-item'
                onClick={handleLinkClick}
              >
                Thay đổi mật khẩu
              </Link>

              <button
                type='button'
                className='account-item'
                onClick={() => {
                  handleLinkClick();
                  onLogout?.();
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}

          {/* CHƯA LOGIN: menu nhỏ */}
          {!isLoggedIn && accountOpen && (
            <div className='account-dropdown'>
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
              <Link
                to='/support'
                className='account-item'
                onClick={handleLinkClick}
              >
                Trợ giúp và hỗ trợ
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// End of src/components/Navbar.jsx ]