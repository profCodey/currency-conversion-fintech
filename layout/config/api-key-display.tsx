import {
  useGetClientDetails,
  useGetCurrentUser,
  useIsVerified,
} from "@/api/hooks/user";
import {
  Button,
  Group,
  Stack,
  Loader,
  CopyButton,
  Tooltip,
  ActionIcon,
  Skeleton,
  Box,
  Notification,
} from "@mantine/core";
import { Copy, CopySuccess } from "iconsax-react";
import { useState } from "react";
import Cookies from "js-cookie";

export function ApiKeyDisplay() {
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
    let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
    let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  const [showKey, setShowKey] = useState(false);
  const { data, isLoading } = useGetCurrentUser();
  const { isVerified, isLoading: isVerifyLoading } = useIsVerified();
  const { data: clientDetails, isLoading: clientDetailsLoading } =
    useGetClientDetails(data?.data.id);

  if (isLoading || clientDetailsLoading || isVerifyLoading)
    return <Skeleton className="flex-grow" />;

  return (
    <section className="max-w-[700px] rounded-lg bg-gray-30 border text-gray-90 p-5">
      {/* <h3 className="font-semibold">API Key</h3> */}
      <span className="text-sm leading-3">
        This is your API key. You can use this key to integrate with other
        platforms enabling your application or service to effortlessly
        collaborate with other systems.
      </span>

      {isVerified ? (
        <section className="mt-6 flex flex-col gap-4">
          <Stack>
            <Group noWrap>
              <section className="flex-grow overflow-hidden min-w-80 items-center">
                <span>Client ID</span>
                <div className="bg-white rounded-[4px] h-11 flex items-center px-4">
                  {showKey ? (
                    clientDetails?.data.result.clientId ?? ""
                  ) : (
                    <Dots count={40} />
                  )}
                </div>
              </section>
              <div className="shrink-0 self-end">
                <CopyButton
                  value={clientDetails?.data.result.clientId ?? ""}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                      >
                        {copied ? (
                          <CopySuccess size="28" />
                        ) : (
                          <Copy size="28" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </div>
            </Group>
            <Group noWrap>
              <section className="flex-grow overflow-hidden min-w-80 items-center">
                <span>Auth Client ID</span>
                <div className="bg-white rounded-[4px] h-11 flex items-center px-4">
                  {showKey ? (
                    clientDetails?.data.result.awsClientId ?? ""
                  ) : (
                    <Dots count={40} />
                  )}
                </div>
              </section>
              <div className="shrink-0 self-end">
                <CopyButton
                  value={clientDetails?.data.result.awsClientId ?? ""}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                      >
                        {copied ? (
                          <CopySuccess size="28" />
                        ) : (
                          <Copy size="28" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </div>
            </Group>
            <Group noWrap>
              <section className="flex-grow overflow-hidden min-w-80 items-center">
                <span>Auth Client Secret</span>
                <div className="flex-grow overflow-hidden min-w-80 bg-white rounded-[4px] h-11 flex items-center px-4">
                  {showKey ? (
                    clientDetails?.data.result.awsSecret ?? ""
                  ) : (
                    <Dots count={40} />
                  )}
                </div>
              </section>
              <div className="shrink-0 self-end">
                <CopyButton
                  value={clientDetails?.data.result.awsSecret ?? ""}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                      >
                        {copied ? (
                          <CopySuccess size="28" />
                        ) : (
                          <Copy size="28" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </div>
            </Group>
            <Group grow>
              <Button
                style={{ backgroundColor: colorSecondary }}
                size="md"
                onClick={() => setShowKey((state) => !state)}
              >
                {showKey ? "Hide Key" : "Reveal key"}
              </Button>

              {/* <Button className="bg-primary-100 hover:bg-accent" size="md">
                Reset
              </Button> */}
            </Group>
          </Stack>
        </section>
      ) : (
        <Notification
          color="dark"
          title="Unable to fetch API key"
          className="mt-10"
          withCloseButton={false}
        >
          You need to be verified to receive an API key
        </Notification>
      )}
    </section>
  );
}

function Dots({ count }: { count: number }) {
  return (
    <div className="flex justify-between items-center gap-1">
      {Array(count)
        .fill(undefined)
        .map((_, idx) => (
          <div
            key={idx}
            className="h-2 w-2 inline-block rounded-full border bg-[#7F8698]"
          >
            {""}
          </div>
        ))}
    </div>
  );
}
