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

/*
 * Tổng lượng wheel cần để chạy
 * progress 0 → 1.
 *
 * Tăng = hiệu ứng chậm hơn.
 * Giảm = nhanh hơn.
 */
const SCENE_SCROLL_DISTANCE =
  2600;


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
    bridgeReady,
    setBridgeReady,
  ] =
    useState(false);


  const [
    progress,
    setProgress,
  ] =
    useState(0);


  const progressRef =
    useRef(0);


  const capturedRef =
    useRef(false);


  const capturePendingRef =
    useRef(false);


  const pendingDeltaRef =
    useRef(0);


  const touchYRef =
    useRef<number | null>(
      null
    );


  /* =======================================================
     KEEP REF SYNCED
  ======================================================= */

  function commitProgress(
    value: number
  ) {
    const next =
      clamp(value);

    progressRef.current =
      next;

    setProgress(
      next
    );
  }


  /* =======================================================
     WIX BRIDGE
  ======================================================= */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );


    const wixRequested =
      params.get("wix") ===
      "1";


    /*
     * Direct route:
     *
     * /embed/coordinates/
     *
     * giữ nguyên behavior
     * như page chính.
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
       POST MESSAGE
    ===================================================== */

    function post(
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
       ACTIVATE WIX MODE
    ===================================================== */

    function activateBridge() {
      if (
        connected
      ) {
        return;
      }


      connected =
        true;


      /*
       * Iframe không còn document scroll.
       *
       * Scroll gesture sẽ điều khiển
       * timeline trực tiếp.
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


      setBridgeReady(
        true
      );
    }


    /* =====================================================
       APPLY WHEEL DELTA TO SCENE
    ===================================================== */

    function applyDelta(
      delta: number
    ) {
      const current =
        progressRef.current;


      /*
       * ĐÃ Ở CUỐI + scroll xuống
       *
       * → thả scroll cho Wix.
       */
      if (
        current >=
          0.9999 &&
        delta > 0
      ) {
        capturedRef.current =
          false;

        post({
          type:
            "COORD_RELEASE",

          direction:
            "down",

          deltaY:
            delta,
        });

        return;
      }


      /*
       * ĐÃ Ở ĐẦU + scroll lên
       *
       * → quay lại nội dung Wix trước.
       */
      if (
        current <=
          0.0001 &&
        delta < 0
      ) {
        capturedRef.current =
          false;

        post({
          type:
            "COORD_RELEASE",

          direction:
            "up",

          deltaY:
            delta,
        });

        return;
      }


      const change =
        delta /
        SCENE_SCROLL_DISTANCE;


      commitProgress(
        current +
          change
      );
    }


    /* =====================================================
       CAPTURE SCENE
    ===================================================== */

    function requestCapture(
      delta: number
    ) {
      pendingDeltaRef.current =
        clamp(
          pendingDeltaRef.current +
            delta,
          -500,
          500
        );


      if (
        capturePendingRef.current
      ) {
        return;
      }


      capturePendingRef.current =
        true;


      /*
       * Yêu cầu Wix căn iframe
       * chính xác lên đầu viewport.
       */
      post({
        type:
          "COORD_CAPTURE",
      });
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
        data.source !==
          SOURCE
      ) {
        return;
      }


      /* -----------------------------------------------
         Wix ready
      ------------------------------------------------ */

      if (
        data.type ===
          "COORD_ACK"
      ) {
        activateBridge();

        return;
      }


      /* -----------------------------------------------
         Wix đã căn scene full viewport.
      ------------------------------------------------ */

      if (
        data.type ===
          "COORD_CAPTURED"
      ) {
        capturePendingRef.current =
          false;

        capturedRef.current =
          true;


        const delta =
          pendingDeltaRef.current;


        pendingDeltaRef.current =
          0;


        if (
          Math.abs(delta) >
          0.1
        ) {
          applyDelta(
            delta
          );
        }

        return;
      }
    }


    /* =====================================================
       WHEEL
    ===================================================== */

    function handleWheel(
      event: WheelEvent
    ) {
      /*
       * Nếu Wix chưa ACK,
       * không chặn browser.
       *
       * Fail-safe:
       * iframe không thể khóa trang.
       */
      if (!connected) {
        return;
      }


      event.preventDefault();


      let delta =
        event.deltaY;


      if (
        event.deltaMode ===
        1
      ) {
        delta *=
          18;
      }


      if (
        event.deltaMode ===
        2
      ) {
        delta *=
          window.innerHeight;
      }


      /*
       * Clamp trackpad spike.
       */
      delta =
        Math.max(
          -220,
          Math.min(
            220,
            delta
          )
        );


      if (
        capturedRef.current
      ) {
        applyDelta(
          delta
        );

        return;
      }


      requestCapture(
        delta
      );
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


      if (
        capturedRef.current
      ) {
        applyDelta(
          delta
        );

        return;
      }


      requestCapture(
        delta
      );
    }


    function handleTouchEnd() {
      touchYRef.current =
        null;
    }


    /* =====================================================
       EVENTS
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
       READY HANDSHAKE
    ===================================================== */

    function sendReady() {
      post({
        type:
          "COORD_READY",
      });
    }


    sendReady();


    /*
     * Retry để tránh Wix/Vercel
     * load khác thời điểm.
     */
    const readyTimer =
      window.setInterval(
        () => {
          if (
            !connected
          ) {
            sendReady();
          }
        },
        600
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


      html.style.overflow =
        oldHtmlOverflow;

      body.style.overflow =
        oldBodyOverflow;
    };
  }, []);


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className={[
        magazineStyles.magazine,
        styles.page,
        styles.redTheme,

        bridgeReady
          ? styles.sceneMode
          : "",
      ].join(" ")}
    >
      <OpeningHero
        key={
          bridgeReady
            ? "wix-controlled"
            : "native"
        }
        externalProgress={
          bridgeReady
            ? progress
            : undefined
        }
      />
    </main>
  );
}