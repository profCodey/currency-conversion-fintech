import OnboardingPendingStatus from "@/public/onboarding-pending-status.svg";
import { useGetCurrentUser } from "@/api/hooks/user";
import { Center, Loader, Stack, Text } from "@mantine/core";
import { Verify } from "iconsax-react";

export function OnboardingStatus() {
  const { data, isLoading } = useGetCurrentUser();
  if (isLoading) return <Loader color="green" />;

  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center w-[305px] mx-auto">
        {!data?.data.is_approved ? (
          <Stack align="center" spacing="xl">
            <OnboardingPendingStatus />
            <div className="text-gray-90 text-2xl font-semibold text-center font-secondary">
              Please wait while we Approve your Account
            </div>
          </Stack>
        ) : (
          <Center className="h-full">
            <Stack align="center" spacing="xl">
              <Verify size="120" variant="Bold" color="green" />
              <Text className="font-secondary" size="xl" align="center">
                Your account has been successfully verified
              </Text>
            </Stack>
          </Center>
        )}
      </div>
    </section>
  );
}
