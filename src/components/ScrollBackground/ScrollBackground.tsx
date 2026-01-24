import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollBackground.css";

gsap.registerPlugin(ScrollTrigger);



export default function ScrollBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLDivElement>(".scroll-bg-section");

    sections.forEach((section, i) => {
      gsap.to(section, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      if (i > 0) {
        gsap.to(sections[i - 1], {
          opacity: 0,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        });
      }
    });
  }, []);

  return (
    <div className="scroll-bg-wrapper" ref={containerRef}>
      
      <div className="scroll-bg-spacer" />
    </div>
  );
}

