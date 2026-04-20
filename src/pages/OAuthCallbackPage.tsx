import OAuthCallback from "../features/auth/OAuthCallback";
import type { UserMe } from "../shared/types/api";

export default function OAuthCallbackPage({
 onLogin,
}: {
 onLogin: (user: UserMe) => void;
}) {
 return <OAuthCallback onLogin={onLogin} />;
}
