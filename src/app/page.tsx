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
  min: number,
  max: number
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
  const touchYRef =
    useRef<number | null>(
      null
    );

  useEffect(() => {
    function getMaxScroll() {
      return Math.max(
        0,
        document.documentElement.scrollHeight -
          window.innerHeight
      );
    }


    function sendScrollToWix(
      deltaY: number
    ) {
      window.parent.postMessage(
        {
          source:
            "500-ngay-dem",

          type:
            "COORD_SCROLL_OUT",

          deltaY,
        },
        "*"
      );
    }


    function moveScene(
      deltaY: number
    ) {
      const maxScroll =
        getMaxScroll();

      const current =
        window.scrollY;

      if (
        maxScroll <= 1
      ) {
        sendScrollToWix(
          deltaY
        );

        return;
      }


      const atTop =
        current <= 1;

      const atBottom =
        current >=
        maxScroll - 1;


      /*
       * Nếu đang ở đầu scene
       * và người dùng scroll lên
       * → trả scroll về Wix.
       */
      if (
        deltaY < 0 &&
        atTop
      ) {
        sendScrollToWix(
          deltaY
        );

        return;
      }


      /*
       * Nếu đã chạy hết scene
       * và người dùng tiếp tục scroll xuống
       * → trả scroll về Wix.
       */
      if (
        deltaY > 0 &&
        atBottom
      ) {
        sendScrollToWix(
          deltaY
        );

        return;
      }


      /*
       * Nếu đang trong scene
       * → dùng scroll để chạy OpeningHero.
       */
      const next =
        clamp(
          current +
            deltaY,
          0,
          maxScroll
        );

      window.scrollTo({
        top: next,
        left: 0,
        behavior:
          "auto",
      });
    }


    function handleWheel(
      event: WheelEvent
    ) {
      let delta =
        event.deltaY;


      /*
       * Chuẩn hóa wheel.
       */
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


      const maxScroll =
        getMaxScroll();

      const current =
        window.scrollY;

      const atTop =
        current <= 1;

      const atBottom =
        current >=
        maxScroll - 1;


      /*
       * Khi đang chạy animation,
       * không cho parent Wix scroll.
       */
      const consumingScene =
        !(
          delta < 0 &&
          atTop
        ) &&
        !(
          delta > 0 &&
          atBottom
        );


      if (
        consumingScene
      ) {
        event.preventDefault();
        event.stopPropagation();
      }


      /*
       * OpeningHero dài 560vh.
       * 1.35 giúp animation không bị quá chậm.
       */
      moveScene(
        delta * 1.35
      );
    }


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


      const delta =
        previous -
        touch.clientY;

      touchYRef.current =
        touch.clientY;


      const maxScroll =
        getMaxScroll();

      const current =
        window.scrollY;

      const atTop =
        current <= 1;

      const atBottom =
        current >=
        maxScroll - 1;


      const consumingScene =
        !(
          delta < 0 &&
          atTop
        ) &&
        !(
          delta > 0 &&
          atBottom
        );


      if (
        consumingScene
      ) {
        event.preventDefault();
      }


      moveScene(
        delta * 1.5
      );
    }


    function handleTouchEnd() {
      touchYRef.current =
        null;
    }


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


    return () => {
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