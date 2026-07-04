import { ProfileSection } from './ProfileSection'
import { EmailSection } from './EmailSection'

/** "Profile & Contact" — personal info + email confirmation on one screen. */
export function ProfileStep() {
  return (
    <div className="space-y-8">
      <ProfileSection />
      <div className="border-t border-border pt-8">
        <EmailSection />
      </div>
    </div>
  )
}
