import React from "react";
import { Link } from "react-router-dom";
import nexora from "../../assets/images/nexora.png";

import "./RegisterSuccess.css";

const RegisterSuccess: React.FC = () => {
  return (
    <div className="success-page">
      {/* HEADER */}
      <header className="success-header">
        <img className="success-logo" src={nexora} alt="Nexora" />
      </header>

      {/* CARD */}
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
              <i className="fa-solid fa-arrow-right"></i>
            </Link>

            <Link to="/" className="success-btn success-btn--secondary">
              <i className="fa-solid fa-house"></i>
              Về trang chủ Nexora
            </Link>
          </div>

          <p className="success-note">
            <span className="success-note-dot" aria-hidden="true"></span>
            Phiên đăng nhập cũ đã được tự động đăng xuất để đảm bảo an toàn
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="success-footer">
        <span>© 2025 Nexora Inc.</span>
        <span className="success-footer-sep">•</span>
        <a href="#" className="success-footer-link">
          Bảo mật thông tin
        </a>
        <span className="success-footer-sep">•</span>
        <a href="#" className="success-footer-link">
          Điều khoản sử dụng
        </a>
        <span className="success-footer-sep">•</span>
        <a href="#" className="success-footer-link">
          Trợ giúp
        </a>
      </footer>
    </div>
  );
};

export default RegisterSuccess;
