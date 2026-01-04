import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <AuthForm type="signup" />
    </div>
  );
}
