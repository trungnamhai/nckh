import React from "react";
import "./OtpInput.css";

const OTP_INPUT_IDS = [
  "otp-input-1",
  "otp-input-2",
  "otp-input-3",
  "otp-input-4",
  "otp-input-5",
  "otp-input-6",
];

interface OtpInputProps {
  otp: string[];

  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;

  otpExpired: boolean;

  onChange: (index: number, value: string) => void;

  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;

  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  otp,
  inputRefs,
  otpExpired,
  onChange,
  onKeyDown,
  onPaste,
}) => {
  return (
    <div className="otp-inputs-container">
      {otp.map((digit, index) => (
        <input
          key={OTP_INPUT_IDS[index]}
          id={`otp-${index + 1}`}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          maxLength={1}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          disabled={otpExpired}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={index === 0 ? onPaste : undefined}
          className={`otp-input ${digit ? "otp-input-filled" : ""} ${
            otpExpired ? "otp-input-disabled" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
