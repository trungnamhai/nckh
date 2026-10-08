import React, { useEffect, useRef, useState } from "react";
import nexora from "../../assets/images/nexora.png";
import { Link } from "react-router-dom";

import "./RegisterOtp.css";
import OtpInput from "../../components/auth/RegisterOtp/OtpInput";

interface OTPVerificationProps {
  email?: string;
  phone?: string;
  onSuccess?: () => void;
  onBackClick?: () => void;
}

const RegisterOtpVerification: React.FC<OTPVerificationProps> = ({
  email = "nguyenvana***@gmail.com",
  phone = "+84 912***678",
  onSuccess,
  onBackClick,
}) => {
  // =========================
  // STATE
  // =========================

  // Lưu 6 số OTP
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  // Lưu thông báo lỗi
  const [error, setError] = useState("");

  // Đã bấm gửi OTP lần nào chưa
  // Chỉ khi đã gửi thì đồng hồ OTP mới bắt đầu chạy
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Thời gian OTP còn hiệu lực
  // Ban đầu là 0 vì chưa gửi, sau khi gửi sẽ là 180 giây = 3 phút
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);

  // Thời gian chờ trước khi gửi lại OTP
  const [resendTimeLeft, setResendTimeLeft] = useState(0);

  // Trạng thái đang xác thực
  const [isVerifying, setIsVerifying] = useState(false);

  // OTP chỉ được coi là hết hạn khi ĐÃ gửi
  // và thời gian đã về 0 (chưa gửi thì không tính là hết hạn)
  const otpExpired = isOtpSent && otpTimeLeft <= 0;

  // =========================
  // REF
  // =========================

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // =========================
  // OTP TIMER
  // =========================

  useEffect(() => {
    if (!isOtpSent || otpTimeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setOtpTimeLeft((prev) => {
        if (prev <= 1) {
          setError("Mã OTP đã hết hạn, vui lòng gửi lại mã mới");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOtpSent, otpTimeLeft]);
  // =========================
  // RESEND TIMER
  // =========================

  useEffect(() => {
    // Không còn thời gian chờ
    if (resendTimeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resendTimeLeft]);

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // =========================
  // NHẬP OTP
  // =========================

  const handleOTPChange = (index: number, value: string) => {
    // Chưa gửi OTP
    if (!isOtpSent) {
      setError("Vui lòng nhấn gửi mã OTP trước");

      return;
    }

    // OTP đã hết hạn
    if (otpExpired) {
      setError("Mã OTP đã hết hạn, vui lòng gửi lại mã mới");

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

    // Nếu đã nhập số
    // chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // =========================
  // BACKSPACE
  // =========================

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== "Backspace") {
      return;
    }

    // Nếu ô hiện tại đang trống
    // thì quay lại ô trước
    if (!otp[index]) {
      if (index > 0) {
        const newOtp = [...otp];

        newOtp[index - 1] = "";

        setOtp(newOtp);

        inputRefs.current[index - 1]?.focus();
      }

      return;
    }

    // Nếu ô hiện tại có số
    // thì xóa số
    const newOtp = [...otp];

    newOtp[index] = "";

    setOtp(newOtp);
  };

  // =========================
  // PASTE OTP
  // =========================

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    // Lấy dữ liệu được paste
    const pastedData = e.clipboardData.getData("text");

    // Chỉ lấy số
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    // Không có số
    if (!digits) {
      return;
    }

    const newOtp = [...otp];

    // Điền từng số vào từng ô
    digits.split("").forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Paste đủ 6 số
    if (digits.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      // Chưa đủ thì focus ô tiếp theo
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }

    setError("");
  };

  // =========================
  // XÁC THỰC OTP
  // =========================

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Chưa gửi OTP
    if (!isOtpSent) {
      setError("Vui lòng nhấn gửi mã OTP trước");

      return;
    }

    // OTP hết hạn
    if (otpExpired) {
      setError("Mã OTP đã hết hạn, vui lòng gửi lại mã mới");

      return;
    }

    // Ghép 6 ô thành 1 chuỗi
    const otpValue = otp.join("");

    // Chưa đủ 6 số
    if (otpValue.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số");

      return;
    }

    setIsVerifying(true);

    // =========================
    // GIẢ LẬP API
    // =========================

    setTimeout(() => {
      // OTP test
      if (otpValue === "123456") {
        setError("");

        // Nếu component cha truyền onSuccess
        if (onSuccess) {
          onSuccess();
        } else {
          alert("Xác thực OTP thành công!");
        }

        // Reset OTP
        setOtp(["", "", "", "", "", ""]);

        // Focus ô đầu tiên
        inputRefs.current[0]?.focus();
      } else {
        setError("OTP không chính xác");
      }

      setIsVerifying(false);
    }, 500);
  };

  // =========================
  // GỬI / GỬI LẠI OTP
  // =========================

  const handleResendOTP = () => {
    // Nếu vẫn đang trong thời gian chờ
    // thì không cho gửi
    if (resendTimeLeft > 0) {
      return;
    }

    // Reset OTP
    setOtp(["", "", "", "", "", ""]);

    // Xóa lỗi
    setError("");

    // Đánh dấu đã gửi OTP
    // => từ lúc này đồng hồ hiệu lực mới bắt đầu đếm
    setIsOtpSent(true);

    // OTP mới có hiệu lực 3 phút
    setOtpTimeLeft(180);

    // Chờ 60 giây mới được gửi tiếp
    setResendTimeLeft(60);

    // Focus ô đầu tiên
    inputRefs.current[0]?.focus();
  };

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
                <p className="heading-2-title-text">Xác thực mã OTP</p>
                <span className="heading-2-title-dot">.</span>
              </div>

              <div className="description-container">
                {/* Description */}
                <p className="description-text">
                  Mã xác thực gồm 6 chữ số đã được gửi tới:
                </p>

                {/* Email + Phone */}

                <p className="recipient-email">{email}</p>
                <p className="recipient-phone">(hoặc SDT: {phone})</p>
              </div>

              {/* =========================
              OTP TIMER
              Chỉ hiện sau khi đã bấm gửi OTP
          ========================= */}

              {isOtpSent && (
                <div className="otp-timer-note">
                  <span>Mã OTP có hiệu lực trong:</span>

                  <span
                    className={`timer-value ${
                      otpTimeLeft <= 60 ? "timer-warning" : ""
                    }`}
                  >
                    {formatTime(otpTimeLeft)}
                  </span>
                </div>
              )}
            </div>

            {/* =========================
              FORM
          ========================= */}
            <form onSubmit={handleVerify} className="form-element">
              <div className="otp-input-container">
                {/* Label */}
                <p className="otp-label">NHẬP MÃ BẢO MẬT</p>

                {/* OTP INPUT */}
                <OtpInput
                  otp={otp}
                  inputRefs={inputRefs}
                  otpExpired={otpExpired}
                  onChange={handleOTPChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />
              </div>

              {/* =========================
                ERROR
            ========================= */}

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>

                  <span className="error-text">{error}</span>
                </div>
              )}

              {/* =========================
                RESEND TIMER
            ========================= */}
              <div className="resend-row">
                <div className="resend-info">
                  <i className="fa-regular fa-clock resend-icon"></i>
                  <span className="resend-text">Gửi lại mã sau: </span>

                  {resendTimeLeft > 0 && (
                    <span className="resend-timer-value">
                      {resendTimeLeft}s
                    </span>
                  )}
                </div>

                {/* =========================
              RESEND BUTTON
          ========================= */}

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimeLeft > 0}
                  className="btn-resend"
                >
                  {isOtpSent && <i className="fa-solid fa-rotate-right"></i>}
                  {isOtpSent ? "Gửi lại mã" : "Gửi mã OTP"}
                </button>
              </div>

              {/* =========================
                VERIFY BUTTON
            ========================= */}

              <button
                type="submit"
                disabled={isVerifying || !isOtpSent || otpExpired}
                className="btn-verify"
              >
                {isVerifying ? "Đang xác thực..." : "Xác nhận OTP"}
                {!isVerifying && <i className="fa-solid fa-arrow-right"></i>}
              </button>

              {/* =========================
              BACK BUTTON
          ========================= */}

              <Link to="/register" className="link-back">
                <i className="fa-solid fa-arrow-left"></i>
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
            <span className="right-footer__text">© 2025 Nexora Inc.</span>

            <a href="#" className="right-footer__link">
              Bảo mật thông tin
            </a>

            <span className="right-footer__separator">•</span>

            <a href="#" className="right-footer__link">
              Điều khoản sử dụng
            </a>

            <span className="right-footer__separator">•</span>

            <a href="#" className="right-footer__link">
              Trợ giúp
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RegisterOtpVerification;
