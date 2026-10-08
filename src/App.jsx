import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register/Register";
import RegisterOtp from "./pages/RegisterOtp/RegisterOtp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ForgotPasswordOtp from "./pages/ForgotPasswordOtp/ForgotPasswordOtp";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import { ROUTES } from "./constants/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.REGISTER} replace />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route path={ROUTES.REGISTER_OTP} element={<RegisterOtp />} />

        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        <Route
          path={ROUTES.FORGOT_PASSWORD_OTP}
          element={<ForgotPasswordOtp />}
        />

        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
