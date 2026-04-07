import Login from '../features/auth/Login';
import type { UserMe } from '../shared/types/api';

export default function LoginPage({ onLogin }: { onLogin: (user: UserMe) => void }) {
  return <Login onLogin={onLogin} />;
}
