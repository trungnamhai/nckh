import "./RegisterHeader.css";
import register_logo from "../../../assets/images/register-logo.svg";

export default function AuthHeader() {
  return (
    <header className="auth-header">
      <a href="#" className="auth-header__link">
        <div className="auth-header__logo">
          <img src={register_logo} alt="" />
        </div>
        <div className="auth-header__text">NEXORA</div>
      </a>

      <button className="auth-header__explore">
        <a href="#" className="auth-header__explore-text">
          Khám phá ngay
        </a>
        <div className="auth-header__explore-icon">
          <i className="fa-solid fa-arrow-right auth-header__explore-icon-image"></i>
        </div>
      </button>
    </header>
  );
}
