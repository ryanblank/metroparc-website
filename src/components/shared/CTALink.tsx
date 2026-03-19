import Link from "next/link";

interface CTALinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export default function CTALink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: CTALinkProps) {
  const baseClasses =
    "inline-flex items-center gap-2 px-6 py-3 rounded-full font-decorative text-[0.85rem] uppercase tracking-[0.1em] transition-all duration-300 no-underline";

  const variantClasses = {
    primary:
      "bg-deep-ocean text-clouds hover:bg-deep-ocean-hover",
    secondary:
      "bg-avocado text-city-night hover:bg-avocado-hover",
    outline:
      "bg-transparent text-clouds border border-clouds/40 hover:bg-clouds/10 hover:border-clouds/80",
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} cursor-pointer border-none ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
