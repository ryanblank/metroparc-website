import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
  showScrollIndicator?: boolean;
}

export default function PageHero({ title, subtitle, imageSrc, imageAlt, videoSrc, showScrollIndicator }: PageHeroProps) {
  return (
    <section className="relative h-[75vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-city-night">
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={imageSrc}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover opacity-75"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean/80 via-deep-ocean/30 to-transparent" />
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
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] animate-bounce">
          <div className="text-clouds text-2xl opacity-70">↓</div>
        </div>
      )}
    </section>
  );
}
