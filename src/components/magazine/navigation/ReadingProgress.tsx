"use client";

import {
  useEffect,
  useRef,
} from "react";

import styles from "../MagazineExperience.module.css";

export default function ReadingProgress() {
  const progressRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    let frame = 0;

    function update() {
      cancelAnimationFrame(frame);

      frame =
        requestAnimationFrame(() => {
          const maxScroll =
            document.documentElement
              .scrollHeight -
            window.innerHeight;

          const progress =
            maxScroll > 0
              ? window.scrollY /
                maxScroll
              : 0;

          if (
            progressRef.current
          ) {
            progressRef.current.style.transform =
              `scaleX(${Math.min(
                1,
                Math.max(
                  0,
                  progress
                )
              )})`;
          }
        });
    }

    update();

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        "scroll",
        update
      );

      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  return (
    <div
      className={
        styles.progressTrack
      }
    >
      <div
        ref={progressRef}
        className={
          styles.progressBar
        }
      />
    </div>
  );
}