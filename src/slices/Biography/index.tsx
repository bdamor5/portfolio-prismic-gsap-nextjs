"use client";

import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();

      // first & last name animation
      t1.fromTo(
        ".text-animation", //name of the class which we provided in the 'renderLetters' function
        { x: -100, opacity: 0, rotate: -10 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          ease: "elastic.out(1,0,3)",
          duration: 1,
          transformOrigin: "left",
          delay: 0.25,
        }
      );

      //job title animation
      t1.fromTo(
        ".image-animation",
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

  console.log('00000-bio',slice)

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="flex items-center flex-col-reverse md:flex-row">
        <div className="flex flex-col gap-y-10">
          <Heading
            as="h1"
            size="xl"
            className="text-animation opacity-0 col-start-1 text-center md:text-left"
          >
            {slice.primary.heading}
          </Heading>

          <div className="text-animation opacity-0 prose prose-xl prose-slate prose-invert col-start-1">
            <PrismicRichText field={slice.primary.description} />
          </div>
          <Button
            linkField={slice.primary.button_link}
            label={slice.primary.button_text}
            showIcon={true}
            className="text-animation opacity-0"
          />
        </div>
        <div className="image-animation opacity-0 mx-auto">
          <PrismicNextImage
            field={slice.primary.avatar}
            className="rounded"
            alt=""
          />
        </div>
      </div>
    </Bounded>
  );
};

export default Biography;
