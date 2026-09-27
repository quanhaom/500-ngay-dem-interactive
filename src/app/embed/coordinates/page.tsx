"use client";

import {
  useEffect,
  useRef,
} from "react";

import OpeningHero from "../../../components/magazine/OpeningHero";
import magazineStyles from "../../../components/magazine/MagazineExperience.module.css";
import styles from "./page.module.css";


const SOURCE =
  "500-ngay-dem";


function clamp(
  value: number,
  min = 0,
  max = 1
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}


export default function CoordinatesEmbedPage() {
  const pendingProgressRef =
    useRef(0);

  const frameRef =
    useRef<number | null>(
      null
    );


  useEffect(() => {
    /*
     * QUAN TRỌNG:
     *
     * Không bắt wheel.
     * Không preventDefault.
     *
     * Vì vậy khi mở trực tiếp:
     *
     * /embed/coordinates/
     *
     * nó vẫn scroll tự nhiên giống web chính.
     *
     * Khi ở Wix, progress sẽ được parent
     * gửi vào bằng postMessage.
     */


    function getMaxScroll() {
      const documentHeight =
        Math.max(
          document.documentElement
            .scrollHeight,

          document.body
            .scrollHeight
        );


      return Math.max(
        0,

        documentHeight -
          window.innerHeight
      );
    }


    /* =====================================================
       APPLY WIX PROGRESS
    ===================================================== */

    function applyProgress() {
      frameRef.current =
        null;


      const progress =
        clamp(
          pendingProgressRef.current
        );


      const maxScroll =
        getMaxScroll();


      window.scrollTo({
        top:
          maxScroll *
          progress,

        left:
          0,

        behavior:
          "auto",
      });
    }


    function setExternalProgress(
      progress: number
    ) {
      pendingProgressRef.current =
        clamp(
          progress
        );


      if (
        frameRef.current !==
        null
      ) {
        return;
      }


      frameRef.current =
        requestAnimationFrame(
          applyProgress
        );
    }


    /* =====================================================
       POINTER FROM WIX
    ===================================================== */

    function applyExternalPointer(
      rawX: unknown,
      rawY: unknown
    ) {
      const x =
        clamp(
          Number(
            rawX
          ) || 0.5
        );


      const y =
        clamp(
          Number(
            rawY
          ) || 0.5
        );


      const hero =
        document.getElementById(
          "opening"
        );


      if (!hero) {
        return;
      }


      const pointerEvent =
        new PointerEvent(
          "pointermove",
          {
            bubbles:
              true,

            pointerType:
              "mouse",

            clientX:
              x *
              window.innerWidth,

            clientY:
              y *
              window.innerHeight,
          }
        );


      hero.dispatchEvent(
        pointerEvent
      );
    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function handleMessage(
      event: MessageEvent
    ) {
      const data =
        event.data;


      if (
        !data ||
        data.source !==
          SOURCE
      ) {
        return;
      }


      if (
        data.type ===
          "COORD_PROGRESS"
      ) {
        setExternalProgress(
          Number(
            data.progress
          ) || 0
        );

        return;
      }


      if (
        data.type ===
          "COORD_POINTER"
      ) {
        applyExternalPointer(
          data.x,
          data.y
        );
      }
    }


    window.addEventListener(
      "message",
      handleMessage
    );


    /*
     * Báo wrapper iframe đã load.
     */
    const readyFrame =
      requestAnimationFrame(
        () => {
          window.parent.postMessage(
            {
              source:
                SOURCE,

              type:
                "COORD_READY",
            },
            "*"
          );
        }
      );


    return () => {
      window.removeEventListener(
        "message",
        handleMessage
      );


      cancelAnimationFrame(
        readyFrame
      );


      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, []);


  return (
    <main
      className={[
        magazineStyles.magazine,
        styles.page,
        styles.redTheme,
      ].join(" ")}
    >
      <OpeningHero />
    </main>
  );
}