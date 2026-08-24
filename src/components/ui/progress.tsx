import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-primary-lighter", className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
