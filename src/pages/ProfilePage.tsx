import Profile from '../features/profile/Profile';

export default function ProfilePage({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return <Profile onLogout={onLogout} />;
}
