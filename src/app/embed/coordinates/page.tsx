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
    Math.max(min, value)
  );
}

export default function CoordinatesEmbedPage() {
  const [
    bridgeReady,
    setBridgeReady,
  ] = useState(false);

  const [
    progress,
    setProgress,
  ] = useState(0);

  const touchYRef =
    useRef<number | null>(null);

  const wheelDeltaRef =
    useRef(0);

  const wheelFrameRef =
    useRef<number | null>(null);

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const wixRequested =
      params.get("wix") === "1";

    /*
     * Route thường:
     *
     * /embed/coordinates/
     *
     * Không làm gì.
     * OpeningHero dùng native scroll.
     */
    if (!wixRequested) {
      return;
    }

    let connected =
      false;

    const html =
      document.documentElement;

    const body =
      document.body;

    const oldHtmlOverflow =
      html.style.overflow;

    const oldBodyOverflow =
      body.style.overflow;

    /* =====================================================
       POST
    ===================================================== */

    function postToWix(
      data: Record<
        string,
        unknown
      >
    ) {
      window.parent.postMessage(
        {
          source:
            SOURCE,

          ...data,
        },
        "*"
      );
    }

    /* =====================================================
       CONNECT
    ===================================================== */

    function activateBridge() {
      if (connected) {
        return;
      }

      connected =
        true;

      /*
       * Chỉ khóa internal scroll
       * SAU KHI Wix ACK.
       */
      html.style.overflow =
        "hidden";

      body.style.overflow =
        "hidden";

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      setBridgeReady(true);
    }

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
        data.source !== SOURCE
      ) {
        return;
      }

      /*
       * Wix xác nhận Velo
       * đã sẵn sàng.
       */
      if (
        data.type ===
        "COORD_ACK"
      ) {
        activateBridge();

        if (
          typeof data.progress ===
          "number"
        ) {
          setProgress(
            clamp(
              data.progress
            )
          );
        }

        return;
      }

      /*
       * Timeline mới từ Wix.
       */
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
       WHEEL → WIX
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
          -260,
          Math.min(
            260,
            delta
          )
        );

      if (
        Math.abs(delta) <
        0.1
      ) {
        return;
      }

      postToWix({
        type:
          "COORD_WHEEL",

        deltaY:
          delta,
      });
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
       * Velo chưa ACK:
       *
       * KHÔNG chặn wheel.
       * Route vẫn hoạt động như native.
       *
       * Đây là fail-safe quan trọng.
       */
      if (!connected) {
        return;
      }

      event.preventDefault();

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
      if (!connected) {
        return;
      }

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
        (
          previous -
          touch.clientY
        ) *
        1.2;

      touchYRef.current =
        touch.clientY;

      wheelDeltaRef.current +=
        delta;

      scheduleWheel();
    }

    function handleTouchEnd() {
      touchYRef.current =
        null;
    }

    /* =====================================================
       LISTENERS
    ===================================================== */

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
       HANDSHAKE
    ===================================================== */

    function sendReady() {
      postToWix({
        type:
          "COORD_READY",
      });
    }

    /*
     * Gửi ngay...
     */
    sendReady();

    /*
     * ...và retry.
     *
     * Tránh trường hợp iframe load
     * trước Page Code Wix.
     */
    const readyTimer =
      window.setInterval(
        () => {
          if (!connected) {
            sendReady();
          }
        },
        700
      );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      window.clearInterval(
        readyTimer
      );

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

        bridgeReady
          ? styles.wixMode
          : "",
      ].join(" ")}
    >
      <OpeningHero
        externalProgress={
          bridgeReady
            ? progress
            : undefined
        }
      />
    </main>
  );
}