import { useGetGateways } from "@/api/hooks/gateways";

export function GatewayOptions() {
  const {} = useGetGateways();
  return <section></section>;
}
