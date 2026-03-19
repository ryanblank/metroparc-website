interface SectionHeadlineProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export default function SectionHeadline({
  children,
  as: Tag = "h2",
  className = "",
}: SectionHeadlineProps) {
  const sizeClasses = {
    h1: "text-[clamp(2rem,5vw,3rem)] font-bold",
    h2: "text-[clamp(1.75rem,4vw,2.25rem)] font-semibold",
    h3: "text-[clamp(1.375rem,3vw,1.75rem)] font-semibold",
  };

  return (
    <Tag className={`${sizeClasses[Tag]} text-city-night leading-[1.2] ${className}`}>
      {children}
    </Tag>
  );
}
