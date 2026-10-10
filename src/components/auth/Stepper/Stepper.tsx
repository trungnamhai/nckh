import "./Stepper.css";

const STEPS = ["Nhập thông tin", "Xác thực OTP", "Mật khẩu mới"];

interface StepperProps {
  currentStep: 1 | 2 | 3; // bước đang ở
}

export default function Stepper({ currentStep }: Readonly<StepperProps>) {
  return (
    <ol className="stepper" aria-label="Các bước khôi phục mật khẩu">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const status =
          step < currentStep
            ? "done"
            : step === currentStep
              ? "active"
              : "todo";

        return (
          <li
            key={label}
            className={`stepper__item stepper__item--${status}`}
            aria-current={status === "active" ? "step" : undefined}
          >
            <span className="stepper__circle">
              {status === "done" ? (
                <i className="fa-solid fa-check" aria-hidden="true"></i>
              ) : (
                step
              )}
            </span>
            <span className="stepper__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
