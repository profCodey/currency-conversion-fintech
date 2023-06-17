import Image from "next/image";
import OnboardingPendingStatus from "@/public/onboarding-pending-status.svg";
import { useGetCurrentUser } from "@/api/hooks/user";
import { Loader } from "@mantine/core";

export function OnboardingStatus() {
  const { data, isLoading } = useGetCurrentUser();
  if (isLoading) return <Loader color="green" />;

  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center w-[305px] mx-auto">
        {!data?.data.is_approved ? (
          <>
            <OnboardingPendingStatus />
            <div className="text-gray-90 text-2xl font-semibold text-center">
              Please wait while we Approve your Account
            </div>
          </>
        ) : (
          <div className="text-gray-90 text-2xl font-semibold text-center">
            Your account has been approved
          </div>
        )}
      </div>
    </section>
  );
}
