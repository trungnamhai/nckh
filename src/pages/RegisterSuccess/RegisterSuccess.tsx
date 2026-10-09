import React from "react";
import { Link } from "react-router-dom";
import nexora from "../../assets/images/nexora.png";

import "./RegisterSuccess.css";

const RegisterSuccess: React.FC = () => {
  return (
    <div className="success-page">
      <header className="success-header">
        <Link to="/" aria-label="Về trang chủ Nexora">
          <img className="success-logo" src={nexora} alt="Nexora" />
        </Link>
      </header>

      <main className="success-main">
        <section className="success-card">
          <div className="success-card-text">
            <h1 className="success-title">
              Tạo tài khoản thành công
              <span className="success-title-dot">.</span>
            </h1>

            <p className="success-description">
              Tài khoản Nexora của bạn đã được cập nhật mật khẩu mới an toàn.
              Các phiên đăng nhập cũ đã được vô hiệu hóa.
            </p>
          </div>

          <div className="success-actions">
            <Link to="/login" className="success-btn success-btn--primary">
              Đăng nhập ngay
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>

            <Link to="/" className="success-btn success-btn--secondary">
              <i className="fa-solid fa-house" aria-hidden="true"></i>
              Về trang chủ Nexora
            </Link>
          </div>

          <p className="success-note" role="status">
            <span className="success-note-dot" aria-hidden="true"></span>
            Phiên đăng nhập cũ đã được tự động đăng xuất để đảm bảo an toàn
          </p>
        </section>
      </main>

      <footer className="success-footer">
        <span className="success-footer-copy">
          © {new Date().getFullYear()} Nexora Inc.
        </span>

        <nav className="success-footer-nav" aria-label="Liên kết chân trang">
          <Link to="/privacy" className="success-footer-link">
            Bảo mật thông tin
          </Link>
          <Link to="/terms" className="success-footer-link">
            Điều khoản sử dụng
          </Link>
          <Link to="/help" className="success-footer-link">
            Trợ giúp
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default RegisterSuccess;
