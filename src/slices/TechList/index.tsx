"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useRef, useEffect } from "react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `TechList`.
 */
export type TechListProps = SliceComponentProps<Content.TechListSlice>;

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ slice }: TechListProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 5,
        },
      });
      t1.fromTo(
        ".tech-row",
        {
          x: (index) =>
            index % 2
              ? gsap.utils.random(-450, -400)
              : gsap.utils.random(450, 400),
        },
        {
          x: (index) =>
            index % 2
              ? gsap.utils.random(450, 400)
              : gsap.utils.random(-450, -400),
        }
      );
    });

    return () => ctx.revert();
  }, [component]);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden"
    >
      <Bounded as="div" ref={component}>
        <Heading size="xl" as="h2" className="mb-8 text-center md:text-left">
          {slice.primary.heading}
        </Heading>
      </Bounded>
      {slice.primary.tech.map(({ tech_name, tech_color }, index) => (
        <div
          key={index}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={tech_name || ""}
        >
          {Array.from({ length: 15 }, (_, index) => (
            <React.Fragment key={index}>
              <span
                style={{
                  color: index === 7 && tech_color ? tech_color : "inherit",
                }}
                className="tech-item text-xl md:text-8xl font-extrabold uppercase tracking-tighter"
              >
                {tech_name}
              </span>
              <span>
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;
