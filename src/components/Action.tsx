import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";

type Appearance = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  iconPosition?: "start" | "end";
};
type ButtonProps = Appearance &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Appearance> & {
        href?: never;
      })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Appearance> & {
        href: string;
      })
  );

/** Shared action anatomy. Callers retain destination, events and workflow state. */
export function Button({
  children,
  variant = "primary",
  icon,
  iconPosition = "end",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `button ${variant} ${className}`.trim();
  const graphic = icon && (
    <span className="button-icon" aria-hidden="true">
      {icon}
    </span>
  );
  const content = (
    <>
      {iconPosition === "start" && graphic}
      <span className="button-label">{children}</span>
      {iconPosition === "end" && graphic}
    </>
  );
  if (typeof props.href === "string")
    return (
      <a {...props} className={classes}>
        {content}
      </a>
    );
  return (
    <button type="button" {...props} className={classes}>
      {content}
    </button>
  );
}

/** A visual affordance inside an already interactive card, never a nested button. */
export function CardAction({ label }: { label: string }) {
  return (
    <span className="card-action">
      <span>{label}</span>
      <ArrowRight size={15} aria-hidden="true" />
    </span>
  );
}
