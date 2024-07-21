"use client";

import React, { useRef, useEffect, useState } from "react";
import { Content, isFilled, asImageSrc } from "@prismicio/client";
import { MdArrowOutward } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
  items: Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
};

const ContentList = ({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = "Visit Project",
}: ContentListProps) => {
  const component = useRef(null);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const revealRef = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  //list of items' arrival animation
  useEffect(() => {
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "eastic.out(1,0.3)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          }
        );
      });

      return () => ctx.revert();
    }, component);
  }, []);

  //hover image animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };

      //calculate speed & acceleration
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      let ctx = gsap.context(() => {
        if (currentItem !== null) {
          const maxX = window.innerWidth - 250;
          const maxY = window.scrollY + window.innerHeight - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 100),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 100),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
            ease: "back.out(2)",
            duration: 1.3,
            opacity: 1,
          });
        }
        lastMousePos.current = mousePos;
        return () => ctx.revert();
      }, component);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [currentItem]);

  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;

    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -10,
    });
  });

  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  const handleMouseEnter = (index: number) => {
    setCurrentItem(index);
  };

  const handleMouseLeave = () => {
    setCurrentItem(null);
  };

  return (
    <div className="mt-10" ref={component}>
      <ul
        className="grid border-b border-b-slate-100"
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, index) => (
          <>
            {isFilled.keyText(item.data.title) && (
              <li
                key={index}
                className="list-item opacity-1"
                onMouseEnter={() => handleMouseEnter(index)}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
              >
                <div
                  className="flex flex-col md:flex-row justify-between border-t border-t-slate-100 py-10 text-slate-200"
                  aria-label={item.data.title}
                >
                  <div className="flex flex-col w-[100%] break-all md:break-keep">
                    <span className="text-3xl font-bold">
                      {item.data.title}
                    </span>
                    <div className="flex gap-3 text-yellow-400 text-lg font-bold my-5">
                      {item.tags.map((tag, ind) => (
                        <span key={ind}>{tag}</span>
                      ))}
                    </div>
                    <div className="prose prose-xl prose-slate prose-invert col-start-1">
                      <PrismicRichText field={item.data.description} />
                    </div>
                  </div>

                  <PrismicNextLink
                    field={item.data.link}
                    className="text-yellow-400 font-bold mr-auto md:ml-auto flex items-center gap-2 text-xl  mt-5 md:mt-0"
                  >
                    {viewMoreText} <MdArrowOutward />
                  </PrismicNextLink>
                </div>
              </li>
            )}
          </>
        ))}
      </ul>

      {/* Hover element */}
      <div
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[200px] w-[200px] rounded-lg bg-over bg-center bg-no-repeat opacity-0 transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem !== null ? `url(${contentImages[currentItem]})` : "",
        }}
        ref={revealRef}
      ></div>
    </div>
  );
};

export default ContentList;
