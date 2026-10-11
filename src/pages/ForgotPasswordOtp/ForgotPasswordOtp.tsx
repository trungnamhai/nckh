import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import nexora from "../../assets/images/nexora.png";
import OtpInput from "../../components/auth/RegisterOtp/OtpInput";
import Stepper from "../../components/auth/Stepper/Stepper";
import { ROUTES } from "../../constants/routes";
import { useCountdown } from "../../hooks/useCountdown";

import "./ForgotPasswordOtp.css";

// =========================
// CONSTANTS
// =========================

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

// Giả lập API, thay bằng lời gọi API thật khi backend sẵn sàng
const MOCK_OTP = "123456";
const MOCK_PHONE = "0912345678"; // Giả lập: thay bằng SĐT backend trả về
const MOCK_DELAY_MS = 500;

const MESSAGES = {
  incomplete: "Vui lòng nhập đầy đủ mã OTP",
  wrong: "OTP không chính xác",
};

const createEmptyOtp = () => Array.from({ length: OTP_LENGTH }, () => "");

// =========================
// TYPES
// =========================

// Dữ liệu bước 1 truyền sang qua navigate(..., { state })
interface OtpLocationState {
  contact?: string;
  phone?: string; // SĐT gắn với tài khoản (nếu backend trả về)
}

// =========================
// HELPERS
// =========================

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// 0912345678 -> +84 912***678
const maskPhone = (phone: string): string =>
  phone.length < 7 ? phone : `+84 ${phone.slice(1, 4)}***${phone.slice(-3)}`;

// nguyenvanabc@gmail.com -> nguyenvana***@gmail.com
// 0912345678 -> +84 912***678
const maskContact = (contact: string): string => {
  if (contact.includes("@")) {
    const [name, domain] = contact.split("@");
    return name && domain ? `${name.slice(0, 9)}***@${domain}` : contact;
  }

  return maskPhone(contact);
};

// =========================
// COMPONENT
// =========================

export default function ForgotPasswordOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as OtpLocationState | null;
  const contact = state?.contact ?? "";

  // Chỉ hiện dòng "hoặc SĐT" khi người dùng nhập email
  const phone = contact.includes("@") ? (state?.phone ?? MOCK_PHONE) : "";

  const [otp, setOtp] = useState<string[]>(createEmptyOtp);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // OTP đã được gửi ở bước 1 nên đồng hồ chạy ngay khi vào trang
  const resendTimer = useCountdown(RESEND_COOLDOWN_SECONDS);
  const canResend = resendTimer.secondsLeft <= 0;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentYear = new Date().getFullYear();

  // Vào thẳng trang này mà chưa qua bước 1 thì quay lại bước 1
  if (!contact) {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />;
  }

  // =========================
  // NHẬP OTP
  // =========================

  const handleOTPChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Đã nhập số thì chuyển sang ô tiếp theo
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") {
      return;
    }

    const newOtp = [...otp];

    // Ô hiện tại trống thì xóa ô trước và quay lại ô trước
    if (!otp[index]) {
      if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }

      return;
    }

    newOtp[index] = "";
    setOtp(newOtp);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!digits) {
      return;
    }

    const newOtp = [...otp];

    digits.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  // =========================
  // XÁC THỰC OTP
  // =========================

  const handleVerify = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      setError(MESSAGES.incomplete);
      return;
    }

    setError("");
    setIsVerifying(true);

    // Giả lập API xác thực OTP
    window.setTimeout(() => {
      if (otpValue === MOCK_OTP) {
        void navigate(ROUTES.RESET_PASSWORD, {
          state: { contact, otp: otpValue },
        });
        return;
      }

      setError(MESSAGES.wrong);
      setIsVerifying(false);
    }, MOCK_DELAY_MS);
  };

  // =========================
  // GỬI LẠI OTP
  // =========================

  const handleResend = () => {
    if (!canResend) {
      return;
    }

    // Giả lập API gửi lại OTP
    setOtp(createEmptyOtp());
    setError("");
    resendTimer.restart(RESEND_COOLDOWN_SECONDS);
    inputRefs.current[0]?.focus();
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="verify-page">
      <div className="verify-page__content">
        <header className="verify-header">
          <div className="verify-header__inner">
            <img className="verify-header__logo" src={nexora} alt="nexora" />
          </div>
        </header>

        <main className="verify-main">
          <div className="verify-card">
            {/* Thanh các bước: bước 1 xanh, bước 2 đang chọn */}
            <div className="verify-card__steps">
              <Stepper currentStep={2} />
            </div>

            {/* Nhóm 1: title + mô tả + người nhận */}
            <div className="verify-card__header">
              <div className="verify-card__title-row">
                <h2 className="verify-card__title">Xác thực mã OTP</h2>
                <div className="verify-card__title-dot"></div>
              </div>

              <div className="verify-card__desc">
                <p className="verify-card__desc-text">
                  Mã xác thực gồm 6 chữ số đã được gửi tới:
                </p>
                <p className="verify-card__recipient">{maskContact(contact)}</p>
                {phone && (
                  <p className="verify-card__recipient-phone">
                    (hoặc SĐT {maskPhone(phone)})
                  </p>
                )}
              </div>
            </div>

            {/* Nhóm 2: ô OTP + gửi lại + nút + quay lại */}
            <form onSubmit={handleVerify} className="verify-form" noValidate>
              <div className={`verify-otp${error ? " verify-otp--error" : ""}`}>
                <p className="verify-otp__label">NHẬP MÃ BẢO MẬT</p>

                <OtpInput
                  otp={otp}
                  inputRefs={inputRefs}
                  otpExpired={false}
                  onChange={handleOTPChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />

                {error && (
                  <div className="verify-otp__error" role="alert">
                    <span className="verify-otp__error-icon" aria-hidden="true">
                      ⚠
                    </span>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="verify-resend">
                <div className="verify-resend__info">
                  <i
                    className="fa-regular fa-clock verify-resend__icon"
                    aria-hidden="true"
                  ></i>
                  <span>
                    {resendTimer.secondsLeft > 0
                      ? "Gửi lại mã sau:"
                      : "Chưa nhận được mã?"}
                  </span>
                  {resendTimer.secondsLeft > 0 && (
                    <span className="verify-resend__timer">
                      {formatTime(resendTimer.secondsLeft)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="verify-resend__btn"
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  <i
                    className="fa-solid fa-rotate-right"
                    aria-hidden="true"
                  ></i>
                  <span>Gửi lại mã</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="verify-form__submit"
              >
                <span>{isVerifying ? "Đang xác thực..." : "Xác nhận OTP"}</span>
                {!isVerifying && (
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                )}
              </button>

              <Link to={ROUTES.FORGOT_PASSWORD} className="verify-form__back">
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                <span>Quay lại nhập email / SĐT khác</span>
              </Link>
            </form>
          </div>
        </main>

        <footer className="verify-footer">
          <div className="verify-footer__container">
            <span className="verify-footer__text">
              © {currentYear} Nexora Inc.
            </span>
            <nav
              className="verify-footer__nav"
              aria-label="Liên kết chân trang"
            >
              <Link to="/privacy" className="verify-footer__link">
                Bảo mật thông tin
              </Link>
              <Link to="/terms" className="verify-footer__link">
                Điều khoản sử dụng
              </Link>
              <Link to="/help" className="verify-footer__link">
                Trợ giúp
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
