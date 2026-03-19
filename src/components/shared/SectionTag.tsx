interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTag({ children, className = "" }: SectionTagProps) {
  return (
    <p
      className={`font-decorative text-[0.85rem] tracking-[0.15em] text-calm-waves mb-2 ${className}`}
    >
      {children}
    </p>
  );
}
