import type { ReactNode } from "react";
import Balancer from "react-wrap-balancer";

export function CaptionComponent({ children }: { children: ReactNode }) {
  return (
    <span className="my-3 block w-full text-center font-mono text-gray-500 text-xs leading-normal">
      <Balancer>
        <span className="[&>a]:post-link">{children}</span>
      </Balancer>
    </span>
  );
}
