import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import nexora from "../../assets/images/nexora.png";
import OtpInput from "../../components/auth/RegisterOtp/OtpInput";
import { ROUTES } from "../../constants/routes";

import "./RegisterOtp.css";

// =========================
// CONSTANTS
// =========================

const OTP_LENGTH = 6;
const OTP_LIFETIME_SECONDS = 180; // OTP có hiệu lực 3 phút
const RESEND_COOLDOWN_SECONDS = 60; // Chờ 60 giây mới được gửi lại

// Giả lập API xác thực, thay bằng lời gọi API thật
const MOCK_OTP = "123456";

const MESSAGES = {
  incomplete: "Vui lòng nhập đầy đủ thông tin",
  wrong: "OTP không chính xác",
  expired: "Mã OTP đã hết hạn, vui lòng gửi lại mã mới",
};

const createEmptyOtp = () => Array<string>(OTP_LENGTH).fill("");

// =========================
// TYPES
// =========================

interface OTPVerificationProps {
  email?: string;
  phone?: string;
  onSuccess?: () => void;
  onBackClick?: () => void;
}

// Dữ liệu trang Đăng ký truyền sang qua navigate(..., { state })
interface OtpLocationState {
  email?: string;
  phone?: string;
}

// =========================
// HELPERS
// =========================

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// nguyenvanabc@gmail.com -> nguyenvana***@gmail.com
const maskEmail = (email: string): string => {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  return `${name.slice(0, 9)}***@${domain}`;
};

// 0912345678 -> +84 912***678
const maskPhone = (phone: string): string => {
  if (phone.length < 7) {
    return phone;
  }

  return `+84 ${phone.slice(1, 4)}***${phone.slice(-3)}`;
};

// Đếm ngược theo giây, restart() để đếm lại từ đầu
function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [runId, setRunId] = useState(0);

  const running = secondsLeft > 0;

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [running, runId]);

  const restart = (seconds: number) => {
    setSecondsLeft(seconds);
    setRunId((prev) => prev + 1);
  };

  return { secondsLeft, restart };
}

// =========================
// COMPONENT
// =========================

export default function RegisterOtpVerification({
  email: emailProp = "nguyenvana***@gmail.com",
  phone: phoneProp = "+84 912***678",
  onSuccess,
}: Readonly<OTPVerificationProps>) {
  const navigate = useNavigate();
  const location = useLocation();

  // Email / SĐT người dùng vừa đăng ký (nếu có), không có thì dùng giá trị mặc định
  const locationState = location.state as OtpLocationState | null;
  const email = locationState?.email
    ? maskEmail(locationState.email)
    : emailProp;
  const phone = locationState?.phone
    ? maskPhone(locationState.phone)
    : phoneProp;

  // =========================
  // STATE
  // =========================

  // Lưu 6 số OTP
  const [otp, setOtp] = useState<string[]>(createEmptyOtp);

  // Lỗi do người dùng thao tác (chưa đủ số, sai OTP)
  const [error, setError] = useState("");

  // Trạng thái đang xác thực
  const [isVerifying, setIsVerifying] = useState(false);

  // OTP đã được gửi ngay sau khi đăng ký thành công,
  // nên cả hai đồng hồ chạy ngay khi vào trang
  const otpTimer = useCountdown(OTP_LIFETIME_SECONDS);
  const resendTimer = useCountdown(RESEND_COOLDOWN_SECONDS);

  const otpExpired = otpTimer.secondsLeft <= 0;

  // Hết hạn thì ưu tiên hiện thông báo hết hạn
  const message = otpExpired ? MESSAGES.expired : error;

  // =========================
  // REF
  // =========================

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // =========================
  // NHẬP OTP
  // =========================

  const handleOTPChange = (index: number, value: string) => {
    if (otpExpired) {
      return;
    }

    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    // Chỉ lấy 1 ký tự cuối
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    // Xóa lỗi khi người dùng nhập lại
    setError("");

    // Đã nhập số thì chuyển sang ô tiếp theo
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // =========================
  // BACKSPACE
  // =========================

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") {
      return;
    }

    const newOtp = [...otp];

    // Ô hiện tại đang trống thì xóa ô trước và quay lại ô trước
    if (!otp[index]) {
      if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }

      return;
    }

    // Ô hiện tại có số thì xóa số
    newOtp[index] = "";
    setOtp(newOtp);
  };

  // =========================
  // PASTE OTP
  // =========================

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (otpExpired) {
      return;
    }

    // Chỉ lấy số trong dữ liệu được paste
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!digits) {
      return;
    }

    const newOtp = [...otp];

    // Điền từng số vào từng ô
    digits.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    // Paste đủ thì focus ô cuối, chưa đủ thì focus ô tiếp theo
    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  // =========================
  // XÁC THỰC OTP
  // =========================

  const handleVerify = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hết hạn: thông báo đã hiện sẵn, người dùng phải gửi lại mã
    if (otpExpired) {
      return;
    }

    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      setError(MESSAGES.incomplete);
      return;
    }

    setIsVerifying(true);

    // Giả lập API xác thực OTP
    window.setTimeout(() => {
      if (otpValue === MOCK_OTP) {
        setError("");
        setOtp(createEmptyOtp());

        onSuccess?.();

        void navigate(ROUTES.REGISTER_SUCCESS);
        return;
      }

      setError(MESSAGES.wrong);
      setIsVerifying(false);
    }, 500);
  };

  // =========================
  // GỬI LẠI OTP
  // =========================

  const handleResendOTP = () => {
    // Đang trong thời gian chờ thì không cho gửi
    if (resendTimer.secondsLeft > 0) {
      return;
    }

    // Gọi API gửi lại OTP ở đây

    setOtp(createEmptyOtp());
    setError("");

    // OTP mới có hiệu lực 3 phút, 60 giây sau mới được gửi tiếp
    otpTimer.restart(OTP_LIFETIME_SECONDS);
    resendTimer.restart(RESEND_COOLDOWN_SECONDS);

    inputRefs.current[0]?.focus();
  };

  const currentYear = new Date().getFullYear();

  // =========================
  // JSX
  // =========================

  return (
    <div className="main-container">
      <div className="right-auth-section">
        {/* =========================
            HEADER
        ========================= */}

        <header className="header-top-bar">
          <div className="logo-nexora-container">
            <img className="logo-nexora" src={nexora} alt="nexora" />
          </div>
        </header>

        {/* =========================
            CARD
        ========================= */}

        <div className="center-card-otp-container">
          <div className="center-card-otp-form">
            {/* Title */}
            <div className="icon-header-group">
              <div className="heading-2-title">
                <h1 className="heading-2-title-text">Xác thực mã OTP</h1>
                <span className="heading-2-title-dot" aria-hidden="true">
                  .
                </span>
              </div>

              <div className="description-container">
                <p className="description-text">
                  Mã xác thực gồm 6 chữ số đã được gửi tới:
                </p>

                {/* Email + Phone */}
                <p className="recipient-email">{email}</p>
                <p className="recipient-phone">(hoặc SDT: {phone})</p>
              </div>

              {/* Thời gian hiệu lực của OTP */}
              <div className="otp-timer-note">
                <span>Mã OTP có hiệu lực trong:</span>

                <span
                  className={`timer-value${
                    otpTimer.secondsLeft <= 60 ? " timer-warning" : ""
                  }`}
                >
                  {formatTime(otpTimer.secondsLeft)}
                </span>
              </div>
            </div>

            {/* =========================
                FORM
            ========================= */}
            <form onSubmit={handleVerify} className="form-element">
              <div
                className={`otp-input-container${
                  message ? " otp-input-container--error" : ""
                }`}
              >
                <p className="otp-label">NHẬP MÃ BẢO MẬT</p>

                <OtpInput
                  otp={otp}
                  inputRefs={inputRefs}
                  otpExpired={otpExpired}
                  onChange={handleOTPChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />
              </div>

              {/* Thông báo lỗi */}
              {message && (
                <div className="error-message" role="alert">
                  <span className="error-icon" aria-hidden="true">
                    ⚠
                  </span>

                  <span className="error-text">{message}</span>
                </div>
              )}

              {/* Gửi lại mã */}
              <div className="resend-row">
                <div className="resend-info">
                  <i
                    className="fa-regular fa-clock resend-icon"
                    aria-hidden="true"
                  ></i>

                  <span className="resend-text">
                    {resendTimer.secondsLeft > 0
                      ? "Gửi lại mã sau:"
                      : "Chưa nhận được mã?"}
                  </span>

                  {resendTimer.secondsLeft > 0 && (
                    <span className="resend-timer-value">
                      {resendTimer.secondsLeft}s
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer.secondsLeft > 0}
                  className="btn-resend"
                >
                  <i
                    className="fa-solid fa-rotate-right"
                    aria-hidden="true"
                  ></i>
                  Gửi lại mã OTP
                </button>
              </div>

              {/* Xác nhận */}
              <button
                type="submit"
                disabled={isVerifying || otpExpired}
                className="btn-verify"
              >
                {isVerifying ? "Đang xác thực..." : "Xác nhận"}
                {!isVerifying && (
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                )}
              </button>

              {/* Quay lại */}
              <Link to={ROUTES.REGISTER} className="link-back">
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                Quay lại Đăng nhập / Đăng ký
              </Link>
            </form>
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="right-footer">
          <div className="right-footer__container">
            <span className="right-footer__text">
              © {currentYear} Nexora Inc.
            </span>

            <nav className="right-footer__nav" aria-label="Liên kết chân trang">
              <Link to="/privacy" className="right-footer__link">
                Bảo mật thông tin
              </Link>
              <Link to="/terms" className="right-footer__link">
                Điều khoản sử dụng
              </Link>
              <Link to="/help" className="right-footer__link">
                Trợ giúp
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
