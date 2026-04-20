import Profile from '../features/profile/Profile';
import type { UserMe } from "../shared/types/api";

export default function ProfilePage({
 onLogout,
 onUserUpdate,
}: {
 onLogout: () => void;
 onUserUpdate: (user: UserMe) => void;
}) {
 return <Profile onLogout={onLogout} onUserUpdate={onUserUpdate} />;
}
