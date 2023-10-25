import { Center, Loader, Stack, Text } from "@mantine/core";
import SumsubWebSdk from "@sumsub/websdk-react";
import { showNotification } from "@mantine/notifications";
import { useActivateSubmsub } from "@/api/hooks/onboarding";
import { useEffect, useState } from "react";
import { useGetCurrentUser } from "@/api/hooks/user";
import { Verify } from "iconsax-react";

export function IdVerification() {
  const [token, setToken] = useState<null | string>(null);
  const { data: currentUser, isLoading: loadingCurrentUser } =
    useGetCurrentUser();
  const { mutateAsync: getToken, isLoading } = useActivateSubmsub();
  function activateSumsub() {
    getToken()
      .then((data) => {
        const { token } = data.data;
        setToken(token);
      })
      .catch(function (error) {
        showNotification({
          title: "An error ocurred",
          message: "Unable to generate ID verification token",
        });
      });
  }

  useEffect(activateSumsub, [getToken]);

  if (isLoading || loadingCurrentUser)
    return (
      <div className="mx-auto max-w-md flex items-center gap-x-2">
        Loading... <Loader color="green" />
      </div>
    );

  if (currentUser?.data.kyc.status === "approved") {
    return (
      <Center className="h-full">
        <Stack align="center" spacing="xl">
          <Verify size="120" variant="Bold" color="green" />
          <Text className="font-secondary" size="xl">
            Your ID has been successfully verified
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <div>
      {token && (
        <SumsubWebSdk
          accessToken={token}
          expirationHandler={() => {
            // console.log("token expired");

            setToken(null);
          }}
          onMessage={(message: string) => {
            // console.log({ message });
          }}
          onError={(error: any) => {
            //  console.log({ error })
          }}
        />
      )}
    </div>
  );
}
