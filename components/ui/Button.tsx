import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary: "tm-btn tm-btn-primary",
  secondary: "tm-btn tm-btn-secondary",
  ghost: "tm-btn tm-btn-ghost",
};

interface SharedProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsLink = SharedProps & {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

type ButtonAsButton = SharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const classes = cn(variantClass[props.variant ?? "primary"], props.className);

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
      >
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;

  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
      aria-label={buttonProps["aria-label"]}
      form={buttonProps.form}
      name={buttonProps.name}
      value={buttonProps.value}
    >
      {buttonProps.children}
    </button>
  );
}
