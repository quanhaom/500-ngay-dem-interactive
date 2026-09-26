"use client";

import {
  useEffect,
  useRef,
} from "react";

import OpeningHero from "../../../components/magazine/OpeningHero";
import magazineStyles from "../../../components/magazine/MagazineExperience.module.css";
import styles from "./page.module.css";


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


function normalizeWheelDelta(
  event: WheelEvent
) {
  let delta =
    event.deltaY;

  if (
    event.deltaMode === 1
  ) {
    delta *= 18;
  }

  if (
    event.deltaMode === 2
  ) {
    delta *=
      window.innerHeight;
  }

  return delta;
}


export default function CoordinatesEmbedPage() {
  const touchYRef =
    useRef<number | null>(
      null
    );


  useEffect(() => {
    /*
     * iframe KHÔNG tự quyết định progress nữa.
     *
     * Wheel được gửi ra Wix.
     * Wix scroll page chính.
     *
     * Wix sau đó gửi progress 0 → 1
     * trở lại iframe.
     */


    /* =============================================
       RECEIVE PROGRESS FROM WIX
    ============================================== */

    function handleMessage(
      event: MessageEvent
    ) {
      const data =
        event.data;

      if (
        !data ||
        data.source !==
          "500-ngay-dem" ||
        data.type !==
          "COORD_PROGRESS"
      ) {
        return;
      }

      const progress =
        clamp(
          Number(
            data.progress
          ) || 0
        );

      const maxScroll =
        Math.max(
          0,
          document.documentElement
            .scrollHeight -
            window.innerHeight
        );

      /*
       * Programmatically move OpeningHero
       * according to Wix page progress.
       */
      window.scrollTo({
        top:
          maxScroll *
          progress,

        left: 0,

        behavior:
          "auto",
      });
    }


    /* =============================================
       MOUSE WHEEL → WIX
    ============================================== */

    function handleWheel(
      event: WheelEvent
    ) {
      event.preventDefault();
      event.stopPropagation();

      const deltaY =
        normalizeWheelDelta(
          event
        );

      window.parent.postMessage(
        {
          source:
            "500-ngay-dem",

          type:
            "COORD_WHEEL",

          deltaY,
        },
        "*"
      );
    }


    /* =============================================
       TOUCH → WIX
    ============================================== */

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

      const deltaY =
        (
          previous -
          touch.clientY
        ) *
        1.25;

      touchYRef.current =
        touch.clientY;

      window.parent.postMessage(
        {
          source:
            "500-ngay-dem",

          type:
            "COORD_WHEEL",

          deltaY,
        },
        "*"
      );
    }


    function handleTouchEnd() {
      touchYRef.current =
        null;
    }


    /* =============================================
       INITIAL STATE
    ============================================== */

    if (
      "scrollRestoration" in
      history
    ) {
      history.scrollRestoration =
        "manual";
    }

    window.scrollTo(
      0,
      0
    );


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


    /*
     * Báo cho Wix biết iframe đã sẵn sàng.
     */
    window.parent.postMessage(
      {
        source:
          "500-ngay-dem",

        type:
          "COORD_READY",
      },
      "*"
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