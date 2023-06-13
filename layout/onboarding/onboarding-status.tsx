import Image from "next/image";
import OnboardingPendingStatus from "@/public/onboarding-pending-status.svg";

export function OnboardingStatus() {
  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center w-[305px] mx-auto">
        <OnboardingPendingStatus />
        <div className="text-gray-90 text-2xl font-semibold text-center">
          Please wait while we Approve your Account
        </div>
      </div>
      {/* <Image src={OnboardingPendingStatus} alt="" /> */}
    </section>
  );
}
