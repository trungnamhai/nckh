import "./RegisterForm.css";

import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import google from "../../../assets/icons/google.svg";
import outlook from "../../../assets/icons/outlook.svg";

import { ROUTES } from "../../../constants/routes";

// ==================== CONSTANTS ====================

const PHONE_LENGTH = 10;
const MIN_PASSWORD_LENGTH = 6;

const SOCIAL_PROVIDERS = [
  { name: "Google", icon: google },
  { name: "Outlook", icon: outlook },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

const UPPERCASE_REGEX = /[A-Z]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9\s]/;

const MESSAGES = {
  empty: "Vui lòng nhập đầy đủ thông tin",
  emailInvalid: "Email không đúng định dạng",
  emailExists:
    "Email này đã được đăng ký, vui lòng sử dụng email khác hoặc đăng nhập",
  phoneInvalid: `Số điện thoại không hợp lệ (vui lòng nhập đủ ${PHONE_LENGTH} chữ số)`,
  passwordInvalid: `Mật khẩu phải có từ ${MIN_PASSWORD_LENGTH} kí tự trở lên, bao gồm kí tự in hoa và kí tự đặc biệt`,
  confirmMismatch: "Mật khẩu không trùng khớp",
  termRequired: "Vui lòng đồng ý với điều khoản và chính sách",
};

// ==================== TYPES ====================

type FieldKey = "fullName" | "phone" | "email" | "password" | "confirmPassword";
type FormValues = Record<FieldKey, string>;

// Giá trị "" = ô bị bỏ trống
type FormErrors = Partial<Record<FieldKey, string>>;

const INITIAL_FORM: FormValues = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// ==================== VALIDATE ====================

// Từ MIN_PASSWORD_LENGTH ký tự trở lên, có ít nhất 1 chữ in hoa và 1 ký tự đặc biệt
function isStrongPassword(password: string) {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    UPPERCASE_REGEX.test(password) &&
    SPECIAL_CHAR_REGEX.test(password)
  );
}

function validate(form: FormValues) {
  const errors: FormErrors = {};
  let hasEmpty = false;

  // 1. Trống dữ liệu
  (Object.keys(form) as FieldKey[]).forEach((key) => {
    if (!form[key].trim()) {
      errors[key] = "";
      hasEmpty = true;
    }
  });

  // 2. Các ô đã nhập thì kiểm tra định dạng
  if (errors.email === undefined && !EMAIL_REGEX.test(form.email.trim())) {
    errors.email = MESSAGES.emailInvalid;
  }

  if (errors.phone === undefined && form.phone.length !== PHONE_LENGTH) {
    errors.phone = MESSAGES.phoneInvalid;
  }

  if (errors.password === undefined && !isStrongPassword(form.password)) {
    errors.password = MESSAGES.passwordInvalid;
  }

  if (
    errors.confirmPassword === undefined &&
    form.confirmPassword !== form.password
  ) {
    errors.confirmPassword = MESSAGES.confirmMismatch;
  }

  return { errors, hasEmpty };
}

// Hàm tạm:thay bằng lời gọi API kiểm tra email đã tồn tại (1 email / 1 tài khoản)
function isEmailRegistered(_email: string): Promise<boolean> {
  return Promise.resolve(false);
}

// ==================== FORM FIELD ====================

interface FormFieldProps {
  id: string;
  label: string;
  icon: string;
  type?: "text" | "tel" | "email" | "password";
  inputMode?: "text" | "numeric" | "email";
  maxLength?: number;
  placeholder: string;
  value: string;
  autoComplete?: string;
  error?: string;
  onChange: (value: string) => void;
}

function FormField({
  id,
  label,
  icon,
  type = "text",
  inputMode,
  maxLength,
  placeholder,
  value,
  autoComplete,
  error,
  onChange,
}: Readonly<FormFieldProps>) {
  // Hiện / ẩn mật khẩu (chỉ dùng khi type = "password")
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const invalid = error !== undefined;

  return (
    <div className="register-card__field">
      <label className="register-card__label" htmlFor={id}>
        {label}{" "}
        <span className="register-card__required" aria-hidden="true">
          *
        </span>
      </label>

      <div
        className={`register-card__input-box${
          invalid ? " register-card__input-box--error" : ""
        }`}
      >
        <i
          className={`fa-solid ${icon} register-card__icon`}
          aria-hidden="true"
        ></i>

        <input
          id={id}
          className="register-card__input"
          type={isPassword && visible ? "text" : type}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />

        {isPassword && (
          <button
            type="button"
            className="register-card__eye-button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={visible}
          >
            <i
              className={`fa-solid ${
                visible ? "fa-eye-slash" : "fa-eye"
              } register-card__eye-icon`}
              aria-hidden="true"
            ></i>
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="register-card__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ==================== REGISTER FORM ====================

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Gõ vào ô nào thì xóa lỗi của ô đó
  const updateField = (key: FieldKey) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    setFormError("");
  };

  const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const { errors: found, hasEmpty } = validate(form);

    setErrors(found);
    setFormError(hasEmpty ? MESSAGES.empty : "");

    setTermError(term ? "" : MESSAGES.termRequired);

    if (Object.keys(found).length > 0 || !term) return;

    setSubmitting(true);

    try {
      if (await isEmailRegistered(form.email.trim())) {
        setErrors({ email: MESSAGES.emailExists });
        return;
      }

      // Truyền email / SĐT sang trang OTP để hiển thị
      void navigate(ROUTES.REGISTER_OTP, {
        state: { email: form.email.trim(), phone: form.phone },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <main className="register-main">
        <div className="register-card">
          {/* ==================== CARD HEADER ==================== */}

          <div className="register-card__header">
            <h1 className="register-card__title">
              <span>Tạo tài khoản mới</span>
              <span className="register-card__dot" aria-hidden="true"></span>
            </h1>

            <p className="register-card__discount">
              Nhận ngay{" "}
              <span className="register-card__discount-highlight">
                Voucher 500.000đ
              </span>{" "}
              và đặc quyền khách hàng công nghệ cao cấp.
            </p>
          </div>

          {/* ==================== REGISTER FORM ==================== */}

          <form
            className="register-card__form"
            onSubmit={(e) => void handleRegister(e)}
            noValidate
          >
            <div className="register-card__row">
              <FormField
                id="fullName"
                label="HỌ VÀ TÊN"
                icon="fa-user"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                value={form.fullName}
                error={errors.fullName}
                onChange={updateField("fullName")}
              />

              <FormField
                id="tel"
                label="SỐ ĐIỆN THOẠI"
                icon="fa-phone"
                type="tel"
                inputMode="numeric"
                maxLength={PHONE_LENGTH}
                placeholder="0912345678"
                autoComplete="tel"
                value={form.phone}
                error={errors.phone}
                // Chỉ cho nhập số
                onChange={(value) =>
                  updateField("phone")(value.replace(/\D/g, ""))
                }
              />
            </div>

            <FormField
              id="email"
              label="EMAIL"
              icon="fa-envelope"
              inputMode="email"
              placeholder="tenban@gmail.com"
              autoComplete="email"
              value={form.email}
              error={errors.email}
              onChange={updateField("email")}
            />

            <div className="register-card__row">
              <FormField
                id="password"
                label="MẬT KHẨU"
                icon="fa-lock"
                type="password"
                placeholder={`≥ ${MIN_PASSWORD_LENGTH} ký tự`}
                autoComplete="new-password"
                value={form.password}
                error={errors.password}
                onChange={updateField("password")}
              />

              <FormField
                id="confirmPassword"
                label="NHẬP LẠI MẬT KHẨU"
                icon="fa-shield"
                type="password"
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                value={form.confirmPassword}
                error={errors.confirmPassword}
                onChange={updateField("confirmPassword")}
              />
            </div>

            {formError && (
              <p className="register-card__form-error" role="alert">
                {formError}
              </p>
            )}

            {/* ==================== TERM ==================== */}

            <div className="register-card__term-group">
              <div className="register-card__term">
                <input
                  id="term"
                  className="register-card__term-checkbox"
                  type="checkbox"
                  checked={term}
                  aria-describedby={termError ? "term-error" : undefined}
                  onChange={(e) => {
                    setTerm(e.target.checked);
                    setTermError("");
                  }}
                />

                <label className="register-card__term-label" htmlFor="term">
                  Đồng ý với{" "}
                  <span className="register-card__term-link">
                    Điều khoản Nexora
                  </span>{" "}
                  và{" "}
                  <span className="register-card__term-link">
                    Chính sách bảo vệ dữ liệu
                  </span>
                </label>
              </div>

              {termError && (
                <p
                  id="term-error"
                  className="register-card__error"
                  role="alert"
                >
                  {termError}
                </p>
              )}
            </div>

            {/* ==================== SUBMIT ==================== */}

            <button
              className="register-card__submit"
              type="submit"
              disabled={submitting}
            >
              <span>Tạo tài khoản Nexora</span>

              <i
                className="fa-solid fa-arrow-right-long register-card__submit-icon"
                aria-hidden="true"
              ></i>
            </button>
          </form>

          {/* ==================== FAST REGISTER ==================== */}

          <div className="register-card__divider">
            <span className="register-card__divider-text">
              HOẶC ĐĂNG KÝ NHANH
            </span>
          </div>

          <div className="register-card__social">
            {SOCIAL_PROVIDERS.map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className="register-card__social-button"
              >
                <img className="register-card__social-icon" src={icon} alt="" />
                <span className="register-card__social-text">{name}</span>
              </button>
            ))}
          </div>

          {/* ==================== CARD FOOTER ==================== */}

          <div className="register-card__footer">
            <span className="register-card__footer-text">
              Bạn đã có tài khoản?
            </span>

            <Link to="/login" className="register-card__footer-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
