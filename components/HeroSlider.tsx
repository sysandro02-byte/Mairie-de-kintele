"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HeroSlide } from "../lib/content";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const safeSlides = slides.length ? slides : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  if (!safeSlides.length) return null;

  return (
    <section className="hero-slider" aria-roledescription="carousel" aria-label="À la une à Kintélé">
      {safeSlides.map((slide, slideIndex) => (
        <article
          className={`hero-slide ${slideIndex === index ? "is-active" : ""}`}
          key={slide.id}
          aria-hidden={slideIndex !== index}
          style={{ backgroundImage: `url("${slide.image_url}")` }}
        >
          <div className="hero-slide-overlay" />
          <div className="container hero-content">
            <span className="eyebrow light">Portail municipal de Kintélé</span>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <div className="hero-actions">
              <Link href={slide.button_href || "/demarches"} className="button button-primary">
                {slide.button_label || "En savoir plus"}
              </Link>
              <Link href="/contact" className="button button-glass">Contacter la mairie</Link>
            </div>
          </div>
        </article>
      ))}

      <div className="hero-slider-controls container">
        <button
          type="button"
          className="slider-arrow"
          aria-label="Image précédente"
          onClick={() => setIndex((index - 1 + safeSlides.length) % safeSlides.length)}
        >
          ←
        </button>
        <div className="slider-dots" aria-label="Choisir une image">
          {safeSlides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              className={slideIndex === index ? "is-active" : ""}
              aria-label={`Afficher l’image ${slideIndex + 1}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
        <button
          type="button"
          className="slider-arrow"
          aria-label="Image suivante"
          onClick={() => setIndex((index + 1) % safeSlides.length)}
        >
          →
        </button>
      </div>
    </section>
  );
}
