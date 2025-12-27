import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Rejestracja | MasterZone Kwartal',
  description: 'Stwórz konto MasterZone i zapisuj swoje plany kwartalne',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
