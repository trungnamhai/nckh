import RegisterHeader from "../../components/auth/RegisterHeader/RegisterHeader";
import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";
import RegisterFooter from "../../components/auth/RegisterFooter/RegisterFooter";

import "./Register.css";

export default function Register() {
  return (
    <div className="register-page">
      <RegisterHeader />
      <RegisterForm />
      <RegisterFooter />
    </div>
  );
}
