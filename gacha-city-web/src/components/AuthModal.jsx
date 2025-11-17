import {
  useEffect,
  useRef,
  useState,
} from "react";
import "../css/AuthModal.css";
import {
  authLogin,
  sendRegisterOtp,
  registerWithOtp,
} from "../api/strapi";

export default function AuthModal({
  open,
  mode = "login", // "login" hoặc "register"
  onClose,
  onSwitchMode,
  onLoginSuccess,
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // OTP dạng 6 ô
  const [otpDigits, setOtpDigits] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const otpRefs = useRef([]);

  const [step, setStep] = useState("form"); // "form" | "otp" | "done"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] =
    useState("");

  const isLogin = mode === "login";

  // reset form khi mở popup / đổi tab
  useEffect(() => {
    if (!open) return;
    setUsername("");
    setEmail("");
    setPassword("");
    setPassword2("");
    setOtpDigits(["", "", "", "", "", ""]);
    setStep("form");
    setError("");
    setSuccessMsg("");
    setLoading(false);
  }, [open, mode]);

  // Đóng bằng phím ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () =>
      window.removeEventListener(
        "keydown",
        handleKey,
      );
  }, [onClose, open]);

  if (!open) return null;

  // ======== HANDLE OTP INPUTS ========
  const handleOtpChange = (index, value) => {
    const digit = value
      .replace(/[^0-9]/g, "")
      .slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);

    if (digit && index < 5) {
      const nextInput =
        otpRefs.current[index + 1];
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otpDigits[index] &&
      index > 0
    ) {
      const prevInput =
        otpRefs.current[index - 1];
      prevInput?.focus();
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // ===== LOGIN: username + pass =====
    if (isLogin) {
      if (!username || !password) {
        setError(
          "Vui lòng nhập đầy đủ Username và Mật khẩu.",
        );
        return;
      }

      try {
        setLoading(true);
        const result = await authLogin(
          username,
          password,
        );

        if (!result.ok) {
          setError(result.error);
          return;
        }

        // LƯU JWT + USER ĐÃ ĐẨY LÊN HOME
        setSuccessMsg("Đăng nhập thành công!");

        // Gọi callback báo cho Home biết
        // Home sẽ setAuth + đóng popup, KHÔNG cần reload
        if (
          typeof onLoginSuccess === "function"
        ) {
          onLoginSuccess(result.data);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Có lỗi xảy ra, vui lòng thử lại sau.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // ===== REGISTER FLOW =====
    if (step === "form") {
      if (!username || !email || !password) {
        setError(
          "Vui lòng nhập đầy đủ Username, Email và Mật khẩu.",
        );
        return;
      }
      if (password !== password2) {
        setError("Mật khẩu nhập lại không khớp.");
        return;
      }

      try {
        setLoading(true);
        const result = await sendRegisterOtp(
          username,
          email,
          password,
        );

        if (!result.ok) {
          setError(result.error);
          return;
        }

        setSuccessMsg(
          "OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.",
        );
        setStep("otp");

        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 50);
      } catch (err) {
        console.error(err);
        setError(
          "Không gửi được OTP, hãy thử lại.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (step === "otp") {
      const otp = otpDigits.join("");
      if (otp.length !== 6) {
        setError("Vui lòng nhập đủ 6 số OTP.");
        return;
      }

      try {
        setLoading(true);
        const result = await registerWithOtp(
          email,
          otp,
        );

        if (!result.ok) {
          setError(result.error);
          return;
        }

        setSuccessMsg(
          "Xác thực thành công! Tài khoản của bạn đã được tạo.",
        );
        setStep("done");
      } catch (err) {
        console.error(err);
        setError(
          "Có lỗi xảy ra, vui lòng thử lại sau.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }
  };

  const goToLogin = () => {
    setStep("form");
    setUsername("");
    setEmail("");
    setPassword("");
    setPassword2("");
    setOtpDigits(["", "", "", "", "", ""]);
    setError("");
    setSuccessMsg("");
    onSwitchMode?.("login");
  };

  // ================= RENDER =================
  return (
    <div
      className='auth-overlay'
      onClick={onClose}
    >
      <div
        className='auth-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='auth-close'
          onClick={onClose}
          type='button'
        >
          ✕
        </button>

        <div className='auth-tabs'>
          <button
            className={
              isLogin
                ? "auth-tab active"
                : "auth-tab"
            }
            type='button'
            onClick={() =>
              onSwitchMode?.("login")
            }
          >
            ĐĂNG NHẬP
          </button>
          <button
            className={
              !isLogin
                ? "auth-tab active"
                : "auth-tab"
            }
            type='button'
            onClick={() =>
              onSwitchMode?.("register")
            }
          >
            ĐĂNG KÝ
          </button>
        </div>

        <h3 className='auth-title'>
          {isLogin
            ? "Chào mừng quay lại"
            : step === "otp"
            ? "Nhập mã OTP xác thực"
            : step === "done"
            ? "Đăng ký thành công"
            : "Tạo tài khoản mới"}
        </h3>
        <p className='auth-subtitle'>
          {isLogin
            ? "Đăng nhập để bắt đầu vào Gacha City."
            : step === "otp"
            ? "Chúng tôi đã gửi mã OTP 6 số tới email của bạn. Vui lòng nhập để hoàn tất đăng ký."
            : step === "done"
            ? "Bạn có thể đăng nhập bằng tài khoản vừa tạo."
            : "Chỉ mất vài giây để tham gia thành phố."}
        </p>

        {error && (
          <div className='auth-alert error'>
            {error}
          </div>
        )}
        {successMsg && (
          <div className='auth-alert success'>
            {successMsg}
          </div>
        )}

        {!isLogin && step === "done" && (
          <div className='auth-done'>
            <button
              type='button'
              className='auth-submit'
              onClick={goToLogin}
            >
              ĐẾN ĐĂNG NHẬP
            </button>
          </div>
        )}

        {!(!isLogin && step === "done") && (
          <form
            className='auth-form'
            onSubmit={handleSubmit}
          >
            {isLogin && (
              <>
                <div className='auth-field'>
                  <label>Username</label>
                  <input
                    type='text'
                    placeholder='Ví dụ: TanDev'
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    required
                  />
                </div>

                <div className='auth-field'>
                  <label>Mật khẩu</label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <div className='auth-options'>
                  <label className='auth-checkbox'>
                    <input type='checkbox' />{" "}
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type='button'
                    className='auth-link'
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </>
            )}

            {!isLogin && step === "form" && (
              <>
                <div className='auth-field'>
                  <label>Username</label>
                  <input
                    type='text'
                    placeholder='Ví dụ: TanDev'
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    required
                  />
                </div>

                <div className='auth-field'>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <div className='auth-field'>
                  <label>Mật khẩu</label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <div className='auth-field'>
                  <label>Nhập lại mật khẩu</label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    value={password2}
                    onChange={(e) =>
                      setPassword2(e.target.value)
                    }
                    required
                  />
                </div>
              </>
            )}

            {!isLogin && step === "otp" && (
              <div className='auth-field'>
                <label>Mã OTP</label>
                <div className='otp-row'>
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      type='text'
                      inputMode='numeric'
                      maxLength={1}
                      className='otp-input'
                      value={d}
                      onChange={(e) =>
                        handleOtpChange(
                          i,
                          e.target.value,
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(i, e)
                      }
                      ref={(el) =>
                        (otpRefs.current[i] = el)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type='submit'
              className='auth-submit'
              disabled={loading}
            >
              {loading
                ? isLogin
                  ? "ĐANG ĐĂNG NHẬP..."
                  : step === "form"
                  ? "ĐANG GỬI OTP..."
                  : "ĐANG XÁC NHẬN..."
                : isLogin
                ? "ĐĂNG NHẬP"
                : step === "form"
                ? "ĐĂNG KÝ"
                : "XÁC NHẬN OTP"}
            </button>

            {step !== "otp" && (
              <div className='auth-switch-bottom'>
                {isLogin ? (
                  <>
                    Chưa có tài khoản?{" "}
                    <button
                      type='button'
                      className='auth-link'
                      onClick={() =>
                        onSwitchMode?.("register")
                      }
                    >
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{" "}
                    <button
                      type='button'
                      className='auth-link'
                      onClick={goToLogin}
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
