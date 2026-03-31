import Login from '../features/auth/Login';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  return <Login onLogin={onLogin} />;
}
