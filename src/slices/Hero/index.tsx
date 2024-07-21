"use client";

import Bounded from "@/components/Bounded";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { Shapes } from "./Shapes";
import Experience from "@/components/Experience";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();

      // first & last name animation
      t1.fromTo(
        ".name-animation", //name of the class which we provided in the 'renderLetters' function
        { x: -100, opacity: 0, rotate: -10 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          ease: "elastic.out(1,0,3)",
          duration: 1,
          transformOrigin: "left top",
          delay: 0.5,
          stagger: {
            //adds separate seconds between each letters
            each: 0.1,
            from: "random",
          },
        }
      );

      //job title animation
      t1.fromTo(
        ".tag-line-animation",
        {
          y: 20,
          opacity: 0,
          scale: 1.2,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1,0,3)",
        }
      );
    }, component);

    return () => ctx.revert();
  }, []);

  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span
        key={index}
        className={`name-animation name-animation-${key} inline-block opacity-0`}
      >
        {letter}
      </span>
    ));
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center -mt-15 md:-mt-20">
        <Shapes />
        <div className="col-start-1 md:row-start-1">
          <h1
            className="text-7xl md:text-9xl mb-8 text-[clamp(3rem, 20vmin,20rem)] font-extrabold leading-none tracking-tighter text-center md:text-left"
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className="block text-slate-300">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="block text-slate-500 -mt-[.2em]">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
            <span className="tag-line-animation block text-slate-300 bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent md:text-4xl opacity-0">
              {slice.primary.tag_line}
            </span>
          </h1>
        </div>        
      </div>
      <Experience/>
    </Bounded>
  );
};

export default Hero;
