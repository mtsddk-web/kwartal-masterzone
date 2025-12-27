import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Logowanie | MasterZone Kwartal',
  description: 'Zaloguj się do swojego konta MasterZone',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
