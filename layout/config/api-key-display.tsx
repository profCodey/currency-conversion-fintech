import { Button } from "@mantine/core";
import { useState } from "react";

export function ApiKeyDisplay() {
  const [showKey, setShowKey] = useState(true);
  return (
    <section className="max-w-[700px] rounded-lg bg-gray-30 border text-gray-90 p-5">
      <h3 className="font-semibold">API Key</h3>
      <span className="text-sm leading-3">
        This is your API key. You can use this key to integrate with other
        platforms enabling your application or service to effortlessly
        collaborate with other systems.
      </span>

      <section className="mt-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="min-w-80 bg-white rounded-[4px] h-11 flex items-center">
            {showKey && <Dots count={25} />}
          </div>
          <Button className="bg-accent" size="md">
            Reveal key
          </Button>
        </div>
      </section>
    </section>
  );
}

function Dots({ count }: { count: number }) {
  return (
    <div className="flex justify-between items-center gap-1 px-4">
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
