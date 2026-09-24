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
    Math.max(min, value)
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

      if (maxScroll <= 1) {
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
       * Đang ở đầu và cuộn lên
       * → trả quyền scroll cho Wix.
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
       * Đang ở cuối và cuộn xuống
       * → trả quyền scroll cho Wix.
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
       * Đang ở giữa animation
       * → scroll chính iframe tọa độ.
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
      /*
       * Không cho wheel lọt ra ngoài
       * trong khi đang chạy animation.
       */
      event.preventDefault();
      event.stopPropagation();

      let delta =
        event.deltaY;

      /*
       * Chuẩn hóa mouse wheel.
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

      /*
       * Scene 560vh khá dài,
       * tăng tốc nhẹ để UX tự nhiên hơn.
       */
      moveScene(
        delta * 1.25
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

      event.preventDefault();

      const delta =
        previous -
        touch.clientY;

      touchYRef.current =
        touch.clientY;

      moveScene(
        delta * 1.4
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