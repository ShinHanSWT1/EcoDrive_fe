import OAuthCallback from "../features/auth/OAuthCallback";

export default function OAuthCallbackPage({
  onLogin,
}: {
  onLogin: () => void;
}) {
  return <OAuthCallback onLogin={onLogin} />;
}
