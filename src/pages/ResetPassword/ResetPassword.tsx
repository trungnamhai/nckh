import { useState, type SyntheticEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import nexora from "../../assets/images/nexora.png";
import Stepper from "../../components/auth/Stepper/Stepper";
import { ROUTES } from "../../constants/routes";

import "./ResetPassword.css";

// =========================
// CONSTANTS
// =========================

// Giả lập API, thay bằng lời gọi API thật khi backend sẵn sàng
const MOCK_DELAY_MS = 500;

// Đường dẫn trang đăng nhập (do phần đăng nhập quản lý), đổi sang ROUTES.LOGIN khi route có sẵn
const LOGIN_PATH = "/login";
const MIN_LENGTH = 8;

const MESSAGES = {
  empty: "Vui lòng nhập mật khẩu mới",
  weak: "Mật khẩu chưa đáp ứng đủ yêu cầu",
  noConfirm: "Vui lòng nhập lại mật khẩu để xác nhận",
  mismatch: "Mật khẩu xác nhận chưa khớp",
};

// Các tiêu chí độ mạnh mật khẩu (đủ 4 tiêu chí = mạnh nhất)
const RULES = [
  {
    key: "length",
    label: "8+ ký tự",
    test: (v: string) => v.length >= MIN_LENGTH,
  },
  {
    key: "case",
    label: "Chữ hoa & thường",
    test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { key: "number", label: "Số", test: (v: string) => /\d/.test(v) },
  {
    key: "special",
    label: "Ký tự đặc biệt (#,@,$,!)",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
];

// Số tiêu chí đạt -> nhãn độ mạnh
const STRENGTH_LABELS = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"];

// =========================
// TYPES
// =========================

// Dữ liệu bước 2 truyền sang qua navigate(..., { state })
interface ResetLocationState {
  contact?: string;
  otp?: string;
}

// =========================
// COMPONENT
// =========================

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ResetLocationState | null;
  const contact = state?.contact ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoutAll, setLogoutAll] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();

  // Độ mạnh mật khẩu
  const ruleResults = RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
  const score = ruleResults.filter((rule) => rule.passed).length;

  // Ba tiêu chí đầu là bắt buộc, ký tự đặc biệt chỉ để tăng độ mạnh
  const meetsRequired = ruleResults.slice(0, 3).every((rule) => rule.passed);

  const showMatch = confirm.length > 0;
  const isMatch = password === confirm;

  // Vào thẳng trang này mà chưa qua bước 2 thì quay lại bước 1
  if (!contact) {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />;
  }

  // =========================
  // CẬP NHẬT MẬT KHẨU
  // =========================

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      setError(MESSAGES.empty);
      return;
    }

    if (!meetsRequired) {
      setError(MESSAGES.weak);
      return;
    }

    if (!confirm) {
      setError(MESSAGES.noConfirm);
      return;
    }

    if (!isMatch) {
      setError(MESSAGES.mismatch);
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Giả lập API đặt lại mật khẩu (kèm tuỳ chọn đăng xuất các thiết bị khác)
    window.setTimeout(() => {
      setIsSubmitting(false);
      void navigate(LOGIN_PATH, { replace: true });
    }, MOCK_DELAY_MS);
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="reset-page">
      <div className="reset-page__content">
        <header className="reset-header">
          <div className="reset-header__inner">
            <img className="reset-header__logo" src={nexora} alt="nexora" />
          </div>
        </header>

        <main className="reset-main">
          <div className="reset-card">
            {/* Bước 1, 2 xanh, bước 3 đang chọn */}
            <Stepper currentStep={3} />

            {/* Nhóm 1: title + mô tả */}
            <div className="reset-card__header">
              <div className="reset-card__title-row">
                <h2 className="reset-card__title">Đặt lại mật khẩu mới</h2>
                <div className="reset-card__title-dot"></div>
              </div>

              <p className="reset-card__desc">
                Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước
                đây và có ít nhất 8 ký tự.
              </p>
            </div>

            {/* Nhóm 2: form */}
            <form onSubmit={handleSubmit} className="reset-form" noValidate>
              {/* Mật khẩu mới */}
              <div className="reset-field">
                <div className="reset-field__head">
                  <label htmlFor="new-password" className="reset-field__label">
                    MẬT KHẨU MỚI{" "}
                    <span className="reset-field__required">*</span>
                  </label>

                  {password && (
                    <span className="reset-field__strength">
                      {STRENGTH_LABELS[score] || STRENGTH_LABELS[1]}
                    </span>
                  )}
                </div>

                <div className="reset-field__input">
                  <i
                    className="fa-solid fa-lock reset-field__icon"
                    aria-hidden="true"
                  ></i>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Nhập mật khẩu mới"
                    autoComplete="new-password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    className="reset-field__toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <i
                      className={`fa-regular ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>

                {/* Thanh độ mạnh: 4 đoạn */}
                <div className="reset-strength" aria-hidden="true">
                  {RULES.map((rule, index) => (
                    <span
                      key={rule.key}
                      className={`reset-strength__bar${
                        index < score ? " reset-strength__bar--active" : ""
                      }`}
                    ></span>
                  ))}
                </div>

                {/* Các tiêu chí */}
                <ul className="reset-rules">
                  {ruleResults.map((rule) => (
                    <li
                      key={rule.key}
                      className={`reset-rules__item${
                        rule.passed ? " reset-rules__item--passed" : ""
                      }`}
                    >
                      <i
                        className={`${
                          rule.passed
                            ? "fa-solid fa-circle-check"
                            : "fa-regular fa-circle"
                        } reset-rules__icon`}
                        aria-hidden="true"
                      ></i>
                      <span>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="reset-field">
                <label
                  htmlFor="confirm-password"
                  className="reset-field__label"
                >
                  XÁC NHẬN MẬT KHẨU MỚI{" "}
                  <span className="reset-field__required">*</span>
                </label>

                <div
                  className={`reset-field__input${
                    showMatch && !isMatch ? " reset-field__input--error" : ""
                  }`}
                >
                  <i
                    className="fa-solid fa-shield-halved reset-field__icon"
                    aria-hidden="true"
                  ></i>
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    className="reset-field__toggle"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <i
                      className={`fa-regular ${
                        showConfirm ? "fa-eye-slash" : "fa-eye"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>

                {showMatch && (
                  <p
                    className={`reset-match${
                      isMatch ? " reset-match--ok" : " reset-match--error"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        isMatch ? "fa-check-double" : "fa-circle-exclamation"
                      }`}
                      aria-hidden="true"
                    ></i>
                    <span>
                      {isMatch
                        ? "Mật khẩu trùng khớp hoàn toàn"
                        : MESSAGES.mismatch}
                    </span>
                  </p>
                )}
              </div>

              {/* Đăng xuất các thiết bị khác */}
              {/* Đăng xuất các thiết bị khác */}
              <div className="reset-logout">
                <input
                  id="logout-all"
                  type="checkbox"
                  className="reset-logout__checkbox"
                  checked={logoutAll}
                  aria-describedby="logout-all-desc"
                  onChange={(e) => setLogoutAll(e.target.checked)}
                />
                <div className="reset-logout__text">
                  <label htmlFor="logout-all" className="reset-logout__title">
                    Đăng xuất khỏi tất cả thiết bị khác
                  </label>
                  <p id="logout-all-desc" className="reset-logout__desc">
                    Khuyến nghị nếu bạn nghi ngờ mật khẩu cũ bị lộ để bảo vệ tài
                    khoản tối đa.
                  </p>
                </div>
              </div>

              {error && (
                <div className="reset-form__error" role="alert">
                  <span aria-hidden="true">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="reset-form__submit"
              >
                <span>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu mới"}
                </span>
                {!isSubmitting && (
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                )}
              </button>

              <div className="reset-form__footer">
                <Link to={LOGIN_PATH} className="reset-form__back">
                  <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                  <span>Quay lại Đăng nhập</span>
                </Link>
              </div>
            </form>
          </div>
        </main>

        <footer className="reset-footer">
          <div className="reset-footer__container">
            <span className="reset-footer__text">
              © {currentYear} Nexora Inc.
            </span>
            <nav className="reset-footer__nav" aria-label="Liên kết chân trang">
              <Link to="/privacy" className="reset-footer__link">
                Bảo mật thông tin
              </Link>
              <Link to="/terms" className="reset-footer__link">
                Điều khoản sử dụng
              </Link>
              <Link to="/help" className="reset-footer__link">
                Trợ giúp
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
