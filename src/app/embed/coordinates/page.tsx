"use client";

import {
  useEffect,
  useRef,
  useState,
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
  const [
    wixMode,
    setWixMode,
  ] =
    useState(false);

  const [
    progress,
    setProgress,
  ] =
    useState(0);

  const touchYRef =
    useRef<number | null>(
      null
    );

  const wheelDeltaRef =
    useRef(0);

  const wheelFrameRef =
    useRef<number | null>(
      null
    );


  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const isWix =
      params.get("wix") ===
      "1";

    setWixMode(
      isWix
    );


    /*
     * =====================================================
     * DIRECT MODE
     *
     * /embed/coordinates/
     *
     * OpeningHero tự scroll như page chính.
     * =====================================================
     */

    if (!isWix) {
      return;
    }


    /*
     * =====================================================
     * WIX MODE
     *
     * Iframe là viewport duy nhất 100vh.
     * Không có document scroll bên trong.
     * =====================================================
     */

    const html =
      document.documentElement;

    const body =
      document.body;

    const oldHtmlOverflow =
      html.style.overflow;

    const oldBodyOverflow =
      body.style.overflow;

    html.style.overflow =
      "hidden";

    body.style.overflow =
      "hidden";


    /* =====================================================
       MESSAGE FROM WIX
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
        setProgress(
          clamp(
            Number(
              data.progress
            ) || 0
          )
        );
      }
    }


    /* =====================================================
       SEND WHEEL TO WIX
    ===================================================== */

    function flushWheel() {
      wheelFrameRef.current =
        null;

      let delta =
        wheelDeltaRef.current;

      wheelDeltaRef.current =
        0;

      delta =
        Math.max(
          -240,
          Math.min(
            240,
            delta
          )
        );

      if (
        Math.abs(delta) <
        0.1
      ) {
        return;
      }

      window.parent.postMessage(
        {
          source:
            SOURCE,

          type:
            "COORD_WHEEL",

          deltaY:
            delta,
        },
        "*"
      );
    }


    function scheduleWheel() {
      if (
        wheelFrameRef.current !==
        null
      ) {
        return;
      }

      wheelFrameRef.current =
        requestAnimationFrame(
          flushWheel
        );
    }


    function handleWheel(
      event: WheelEvent
    ) {
      /*
       * Iframe KHÔNG scroll.
       *
       * Wheel được chuyển cho
       * trang Wix bên ngoài.
       */
      event.preventDefault();

      let delta =
        event.deltaY;

      if (
        event.deltaMode ===
        1
      ) {
        delta *= 18;
      }

      if (
        event.deltaMode ===
        2
      ) {
        delta *=
          window.innerHeight;
      }

      wheelDeltaRef.current +=
        delta;

      scheduleWheel();
    }


    /* =====================================================
       TOUCH
    ===================================================== */

    function handleTouchStart(
      event: TouchEvent
    ) {
      touchYRef.current =
        event.touches[0]
          ?.clientY ??
        null;
    }


    function handleTouchMove(
      event: TouchEvent
    ) {
      const touch =
        event.touches[0];

      const previous =
        touchYRef.current;

      if (
        !touch ||
        previous === null
      ) {
        return;
      }

      event.preventDefault();

      const delta =
        previous -
        touch.clientY;

      touchYRef.current =
        touch.clientY;

      wheelDeltaRef.current +=
        delta *
        1.25;

      scheduleWheel();
    }


    function handleTouchEnd() {
      touchYRef.current =
        null;
    }


    window.addEventListener(
      "message",
      handleMessage
    );

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "touchstart",
      handleTouchStart,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd
    );


    /* =====================================================
       READY
    ===================================================== */

    let secondFrame =
      0;

    const firstFrame =
      requestAnimationFrame(
        () => {
          secondFrame =
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
        }
      );


    return () => {
      window.removeEventListener(
        "message",
        handleMessage
      );

      window.removeEventListener(
        "wheel",
        handleWheel
      );

      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );

      cancelAnimationFrame(
        firstFrame
      );

      cancelAnimationFrame(
        secondFrame
      );

      if (
        wheelFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          wheelFrameRef.current
        );
      }

      html.style.overflow =
        oldHtmlOverflow;

      body.style.overflow =
        oldBodyOverflow;
    };
  }, []);


  return (
    <main
      className={[
        magazineStyles.magazine,
        styles.page,
        styles.redTheme,

        wixMode
          ? styles.wixMode
          : "",
      ].join(" ")}
    >
      <OpeningHero
        externalProgress={
          wixMode
            ? progress
            : undefined
        }
      />
    </main>
  );
}