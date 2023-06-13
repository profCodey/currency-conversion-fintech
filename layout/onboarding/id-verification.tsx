import { Button, Loader } from "@mantine/core";
import SumsubWebSdk from "@sumsub/websdk-react";
import { showNotification } from "@mantine/notifications";
import { useActivateSubmsub } from "@/api/hooks/onboarding";
import { useEffect, useState } from "react";

export function IdVerification() {
  const [token, setToken] = useState<null | string>(null);
  const { mutateAsync: getToken, isLoading } = useActivateSubmsub();
  function activateSumsub() {
    getToken()
      .then((data) => {
        const { token, user_id } = data.data;
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

  if (isLoading)
    return (
      <div>
        Loading... <Loader color="green" />
      </div>
    );

  return (
    <div>
      {/* <Button
        size="lg"
        className="bg-accent hover:bg-accent"
        loading={isLoading}
        onClick={activateSumsub}
        disabled={!!token}
      >
        Proceed to ID Verification
      </Button> */}

      {token && (
        <SumsubWebSdk
          accessToken={token}
          expirationHandler={() => {
            console.log("token expired");
            setToken(null);
          }}
          onMessage={(message: string) => console.log({ message })}
          onError={(error: any) => console.log({ error })}
        />
      )}
    </div>
  );
}
