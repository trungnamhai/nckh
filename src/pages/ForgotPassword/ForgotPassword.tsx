import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import nexora from "../../assets/images/nexora.png";
import Stepper from "../../components/auth/Stepper/Stepper";
import { ROUTES } from "../../constants/routes";

import "./ForgotPassword.css";

// Regex không quay lui nhiều (tránh cảnh báo S8786)
const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
const PHONE_REGEX = /^(0|\+84)\d{9}$/; // SĐT Việt Nam

const MESSAGES = {
  empty: "Vui lòng nhập email hoặc số điện thoại",
  invalid: "Email hoặc số điện thoại không hợp lệ",
};

// Giả lập API, thay bằng lời gọi API thật khi backend sẵn sàng
const MOCK_DELAY_MS = 500;

export default function ForgotPasswordEmail() {
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = contact.trim();

    if (!value) {
      setError(MESSAGES.empty);
      return;
    }

    if (!EMAIL_REGEX.test(value) && !PHONE_REGEX.test(value)) {
      setError(MESSAGES.invalid);
      return;
    }

    setError("");
    setIsSending(true);

    // Giả lập API gửi OTP
    window.setTimeout(() => {
      setIsSending(false);

      // Sang bước 2, truyền email/SĐT qua state
      void navigate(ROUTES.FORGOT_PASSWORD_OTP, { state: { contact: value } });
    }, MOCK_DELAY_MS);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-page__content">
        <header className="forgot-header">
          <div className="forgot-header__inner">
            <img className="forgot-header__logo" src={nexora} alt="nexora" />
          </div>
        </header>

        <main className="forgot-main">
          <div className="forgot-card">
            <Stepper currentStep={1} />

            <div className="forgot-card__header">
              <div className="forgot-card__title-row">
                <h2 className="forgot-card__title">Quên mật khẩu</h2>
                <div className="forgot-card__title-dot"></div>
              </div>

              <div className="forgot-card__desc">
                <p className="forgot-card__desc-text">
                  Đừng lo lắng! Vui lòng nhập Email hoặc Số điện thoại đã đăng
                  ký để nhận mã OTP xác thực khôi phục tài khoản.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="forgot-form" noValidate>
              <div className="forgot-field">
                <label htmlFor="contact" className="forgot-field__label">
                  EMAIL HOẶC SỐ ĐIỆN THOẠI{" "}
                  <span className="forgot-field__required">*</span>
                </label>

                <div
                  className={`forgot-field__input${
                    error ? " forgot-field__input--error" : ""
                  }`}
                >
                  <i
                    className="fa-regular fa-envelope forgot-field__icon"
                    aria-hidden="true"
                  ></i>
                  <input
                    id="contact"
                    type="text"
                    value={contact}
                    placeholder="Nhập email hoặc số điện thoại của bạn"
                    autoComplete="username"
                    onChange={(e) => {
                      setContact(e.target.value);
                      setError("");
                    }}
                  />
                </div>

                {error && (
                  <div className="forgot-field__error" role="alert">
                    <span
                      className="forgot-field__error-icon"
                      aria-hidden="true"
                    >
                      ⚠
                    </span>
                    <span className="forgot-field__error-text">{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="forgot-form__submit"
              >
                <span>
                  {isSending ? "Đang gửi mã..." : "Tiếp tục gửi mã OTP"}
                </span>
                {!isSending && (
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                )}
              </button>

              <Link to="/login" className="forgot-form__back">
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                <span>Quay lại Đăng nhập</span>
              </Link>
            </form>
          </div>
        </main>

        <footer className="forgot-footer">
          <div className="forgot-footer__container">
            <span className="forgot-footer__text">
              © {currentYear} Nexora Inc.
            </span>
            <nav
              className="forgot-footer__nav"
              aria-label="Liên kết chân trang"
            >
              <Link to="/privacy" className="forgot-footer__link">
                Bảo mật thông tin
              </Link>
              <Link to="/terms" className="forgot-footer__link">
                Điều khoản sử dụng
              </Link>
              <Link to="/help" className="forgot-footer__link">
                Trợ giúp
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
