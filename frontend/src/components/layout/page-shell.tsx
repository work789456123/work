import type { HTMLAttributes, ReactNode } from "react";

export type PageShellProps = {
  id?: string;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/** Server-safe page wrapper (no client JS). */
export function PageShell({ id, className, children, ...rest }: PageShellProps) {
  return (
    <div id={id} className={className} {...rest}>
      {children}
    </div>
  );
}
