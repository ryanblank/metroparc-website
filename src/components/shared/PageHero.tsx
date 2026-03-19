import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
}

export default function PageHero({ title, subtitle, imageSrc, imageAlt }: PageHeroProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-city-night">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover opacity-40"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 overlay-deep-ocean" />
      <div className="relative z-[2] text-center text-clouds max-w-[90%]">
        <h1 className="text-[clamp(2.5rem,6vw,3.5rem)] font-bold mb-4 animate-[fadeInUp_0.8s_ease_forwards]">
          {title}
        </h1>
        {subtitle && (
          <p className="font-display text-[clamp(1.25rem,3vw,2rem)] text-avocado-light animate-[fadeInUp_0.8s_ease_forwards_0.2s] [animation-fill-mode:backwards]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
