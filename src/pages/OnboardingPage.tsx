import Onboarding from '../features/onboarding/Onboarding';
import type { UserMe } from '../shared/types/api';

export default function OnboardingPage({
  onUserUpdate,
}: {
  onUserUpdate: (user: UserMe) => void;
}) {
  return <Onboarding onUserUpdate={onUserUpdate} />;
}
