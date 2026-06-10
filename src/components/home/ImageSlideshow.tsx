import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface SlideImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageSlideshowProps {
  images: SlideImage[];
  intervalMs?: number;
  eager?: boolean; // true para imágenes sobre el pliegue (hero)
  className?: string;
}

// Carrusel accesible: avanza solo, se pausa al pasar el cursor o enfocar,
// con flechas y puntos para control manual.
export const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  images,
  intervalMs = 5000,
  eager = false,
  className = '',
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number>();

  const goTo = useCallback(
    (i: number) => setIndex(((i % images.length) + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (paused || images.length < 2) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(timerRef.current);
  }, [paused, images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl group ${className}`}
      aria-roledescription="carrusel"
      aria-label={images[0].alt}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading={eager && i === 0 ? 'eager' : 'lazy'}
          // React 18 aún no tipa fetchpriority; se pasa como atributo plano
          {...(eager && i === 0 ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
          aria-hidden={i !== index}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
