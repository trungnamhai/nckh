import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

// ==================== ĐĂNG KÝ ====================

export function registerUser(data) {
  return apiClient(ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyRegisterOtp(data) {
  return apiClient(ENDPOINTS.AUTH.VERIFY_OTP, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resendRegisterOtp(data) {
  return apiClient(ENDPOINTS.AUTH.RESEND_OTP, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ==================== QUÊN MẬT KHẨU ====================

export function forgotPassword(data) {
  return apiClient(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyResetOtp(data) {
  return apiClient(ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resetPassword(data) {
  return apiClient(ENDPOINTS.AUTH.RESET_PASSWORD, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
