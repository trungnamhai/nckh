import "./RegisterForm.css";
import { registerUser } from "../../../services/authService";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import google from "../../../assets/icons/google.svg";
import outlook from "../../../assets/icons/outlook.svg";

import { ROUTES } from "../../../constants/routes";

export default function AuthLayout() {
  const navigate = useNavigate();

  // ==================== FORM STATE ====================

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [term, setTerm] = useState(false);

  // Hiện / ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==================== REGISTER ====================

  //

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra dữ liệu bắt buộc
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Kiểm tra mật khẩu
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Kiểm tra điều khoản
    if (!term) {
      alert("Vui lòng đồng ý với điều khoản và chính sách.");
      return;
    }

    void navigate(ROUTES.REGISTER_OTP);
  };

  return (
    <div className="auth-layout">
      <main className="register-main">
        <div className="register-card">
          {/* ==================== CARD HEADER ==================== */}

          <div className="register-card__header">
            <div className="register-card__title">
              <h1 className="register-card__text">Tạo tài khoản mới</h1>

              <div className="register-card__circle-container">
                <div className="register-card__circle"></div>
              </div>
            </div>

            <div className="register-card__discount">
              <p className="register-card__discount-text">
                Nhận ngay{" "}
                <span className="register-card__discount-text--highlight">
                  Voucher 500.000đ
                </span>{" "}
                và đặc quyền khách hàng công nghệ cao cấp.
              </p>
            </div>
          </div>

          {/* ==================== REGISTER FORM ==================== */}

          <form className="register-card__form" onSubmit={handleRegister}>
            {/* HỌ VÀ TÊN + SỐ ĐIỆN THOẠI */}

            <div className="register-card__row--two-columns">
              {/* Họ và tên */}

              <div className="register-card__full-name">
                <label
                  className="register-card__full-name-label"
                  htmlFor="fullName"
                >
                  HỌ VÀ TÊN <span className="register-card__request">*</span>
                </label>

                <div className="register-card__input-box">
                  <i className="fa-solid fa-user register-card__icon"></i>

                  <input
                    id="fullName"
                    className="register-card__input"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Số điện thoại */}

              <div className="register-card__tel">
                <label className="register-card__tel-label" htmlFor="tel">
                  SỐ ĐIỆN THOẠI{" "}
                  <span className="register-card__request">*</span>
                </label>

                <div className="register-card__input-box">
                  <i className="fa-solid fa-phone register-card__icon"></i>

                  <input
                    id="tel"
                    className="register-card__input"
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* GMAIL */}

            <div className="register-card__row--one-column">
              <div className="register-card__email">
                <label className="register-card__email-label" htmlFor="email">
                  GMAIL <span className="register-card__request">*</span>
                </label>

                <div className="register-card__input-box">
                  <i className="fa-solid fa-envelope register-card__icon"></i>

                  <input
                    id="email"
                    className="register-card__input"
                    type="email"
                    placeholder="tenban@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* MẬT KHẨU + XÁC NHẬN MẬT KHẨU */}

            <div className="register-card__row--two-columns">
              {/* Mật khẩu */}

              <div className="register-card__password">
                <label
                  className="register-card__password-label"
                  htmlFor="password"
                >
                  MẬT KHẨU <span className="register-card__request">*</span>
                </label>

                <div className="register-card__input-box">
                  <i className="fa-solid fa-lock register-card__icon"></i>

                  <input
                    id="password"
                    className="register-card__input"
                    type={showPassword ? "text" : "password"}
                    placeholder="≥ 8 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-card__eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } register-card__eye-icon`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}

              <div className="register-card__auth-password">
                <label
                  className="register-card__auth-password-label"
                  htmlFor="authPassword"
                >
                  XÁC THỰC MẬT KHẨU{" "}
                  <span className="register-card__request">*</span>
                </label>

                <div className="register-card__input-box">
                  <i className="fa-solid fa-shield register-card__icon"></i>

                  <input
                    id="authPassword"
                    className="register-card__input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-card__eye-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      } register-card__eye-icon`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== TERM ==================== */}

            <div className="register-card__term">
              <input
                type="checkbox"
                id="term"
                checked={term}
                onChange={(e) => setTerm(e.target.checked)}
              />

              <label className="register-card__term-label" htmlFor="term">
                Đồng ý với{" "}
                <span className="register-card__term-label--highlight">
                  Điều khoản Nexora
                </span>{" "}
                và{" "}
                <span className="register-card__term-label--highlight">
                  Chính sách bảo vệ dữ liệu
                </span>
              </label>
            </div>

            {/* ==================== SUBMIT ==================== */}

            <button className="register-card__submit" type="submit">
              <span className="register-card__submit-text">
                Tạo tài khoản Nexora
              </span>

              <i className="fa-solid fa-arrow-right-long register-card__submit-icon"></i>
            </button>
          </form>

          {/* ==================== FAST REGISTER ==================== */}

          <div className="register-card--fast-register-label">
            <div className="register-card__line"></div>

            <span className="register-card--fast-register-text">
              HOẶC ĐĂNG KÝ NHANH
            </span>
          </div>

          <div className="register-card--fast-register">
            {/* Google */}

            <button
              type="button"
              className="register-card--fast-register-google"
            >
              <img
                className="register-card--fast-register-icon"
                src={google}
                alt="Google"
              />

              <span className="register-card--fast-register-desc">Google</span>
            </button>

            {/* Outlook */}

            <button
              type="button"
              className="register-card--fast-register-outlook"
            >
              <img
                className="register-card--fast-register-icon"
                src={outlook}
                alt="Outlook"
              />

              <span className="register-card--fast-register-desc">Outlook</span>
            </button>
          </div>

          {/* ==================== CARD FOOTER ==================== */}

          <div className="register-card-footer">
            <span className="register-card__haveAccount">
              Bạn đã có tài khoản
            </span>

            <a href="#" className="register-card__loginNow">
              Đăng nhập ngay ›
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
