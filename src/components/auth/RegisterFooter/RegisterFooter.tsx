import "./RegisterFooter.css";

export default function RegisterFooter() {
  return (
    <footer className="register-footer">
      <div className="register-footer__container">
        {/* Nội dung bên trái */}
        <div className="register-footer__content">
          <span className="register-footer__copyright">
            © 2024 Nexora. Bảo lưu mọi quyền.
          </span>

          <ul className="register-footer__link">
            <li className="register-footer__separator">•</li>

            <li>
              <a href="#">Điều khoản Nexora</a>
            </li>

            <li className="register-footer__separator">•</li>

            <li>
              <a href="#">Chính sách bảo mật</a>
            </li>

            <li className="register-footer__separator">•</li>

            <li>
              <a href="#">Trợ giúp</a>
            </li>
          </ul>
        </div>

        {/* Số trang bên phải */}
        <div className="register-footer__page-number">
          {/* Nút 01 */}
          <button
            type="button"
            className="register-footer__page-button register-footer__page-button--01"
          >
            01
          </button>

          {/* Nút 02 - Active */}
          <button
            type="button"
            className="register-footer__page-button register-footer__page-button--02"
          >
            02
          </button>

          {/* Đường gạch */}
          <span className="register-footer__page-line"></span>

          {/* Nút 03 */}
          <button
            type="button"
            className="register-footer__page-button register-footer__page-button--03"
          >
            03
          </button>
        </div>
      </div>
    </footer>
  );
}
