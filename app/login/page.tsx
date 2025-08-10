import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthFormWrapper title="Login">
      <LoginForm />
    </AuthFormWrapper>
  );
}
