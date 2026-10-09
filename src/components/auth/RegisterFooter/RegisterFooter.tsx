import "./RegisterFooter.css";

const FOOTER_LINKS = [
  { label: "Điều khoản Nexora", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Trợ giúp", href: "#" },
];

export default function RegisterFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="register-footer">
      <div className="register-footer__container">
        {/* Nội dung bên trái */}
        <div className="register-footer__content">
          <span className="register-footer__copyright">
            © {currentYear} Nexora. Bảo lưu mọi quyền.
          </span>

          <nav aria-label="Liên kết chân trang">
            <ul className="register-footer__links">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a className="register-footer__link" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Số trang bên phải */}
        <div className="register-footer__pages">
          <button type="button" className="register-footer__page">
            01
          </button>

          {/* Trang đang active */}
          <button
            type="button"
            className="register-footer__page register-footer__page--active"
            aria-current="page"
          >
            02
          </button>

          {/* Đường gạch */}
          <span
            className="register-footer__page-line"
            aria-hidden="true"
          ></span>

          <button type="button" className="register-footer__page">
            03
          </button>
        </div>
      </div>
    </footer>
  );
}
