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
 * Tổng wheel delta để đi
 * từ progress 0 → 1.
 *
 * 2400 = nhanh hơn
 * 2800 = chậm hơn
 */
const SCENE_SCROLL_DISTANCE =
  2500;


type ReleaseSide =
  | "top"
  | "bottom"
  | null;


type CaptureDirection =
  | "from-top"
  | "from-bottom";


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


  /*
   * Scene hiện đang giữ wheel?
   */
  const capturedRef =
    useRef(false);


  /*
   * Đang chờ Wix căn iframe
   * vào viewport?
   */
  const capturePendingRef =
    useRef(false);


  /*
   * Scene đã thoát ở phía nào?
   *
   * bottom:
   * user vừa đi qua cuối scene.
   *
   * top:
   * user vừa đi ngược qua đầu scene.
   */
  const releasedSideRef =
    useRef<ReleaseSide>(
      null
    );


  const pendingDeltaRef =
    useRef(0);


  const pendingDirectionRef =
    useRef<CaptureDirection>(
      "from-top"
    );


  const touchYRef =
    useRef<number | null>(
      null
    );


  /* =======================================================
     PROGRESS
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
     * Mở trực tiếp:
     *
     * /embed/coordinates/
     *
     * OpeningHero vẫn dùng
     * native scroll như page chính.
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
       ACTIVATE
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
       * Không cho iframe tạo
       * internal document scroll.
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
       SCROLL WIX PAGE
    ===================================================== */

    function passToWix(
      delta: number
    ) {
      post({
        type:
          "COORD_PAGE_SCROLL",

        deltaY:
          delta,
      });
    }


    /* =====================================================
       RELEASE SCENE
    ===================================================== */

    function releaseBottom(
      delta: number
    ) {
      capturedRef.current =
        false;


      capturePendingRef.current =
        false;


      releasedSideRef.current =
        "bottom";


      /*
       * KHÔNG nhảy 1 viewport.
       *
       * Chỉ truyền đúng wheel hiện tại
       * về Wix.
       */
      passToWix(
        delta
      );
    }


    function releaseTop(
      delta: number
    ) {
      capturedRef.current =
        false;


      capturePendingRef.current =
        false;


      releasedSideRef.current =
        "top";


      passToWix(
        delta
      );
    }


    /* =====================================================
       APPLY DELTA TO ANIMATION
    ===================================================== */

    function applySceneDelta(
      delta: number
    ) {
      const current =
        progressRef.current;


      /* -----------------------------------------------
         ĐÃ HOÀN THÀNH + vẫn scroll xuống
         → Wix tiếp tục.
      ------------------------------------------------ */

      if (
        current >=
          0.9999 &&
        delta > 0
      ) {
        releaseBottom(
          delta
        );

        return;
      }


      /* -----------------------------------------------
         ĐÃ VỀ ĐẦU + vẫn scroll lên
         → Wix quay về content trước.
      ------------------------------------------------ */

      if (
        current <=
          0.0001 &&
        delta < 0
      ) {
        releaseTop(
          delta
        );

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
       REQUEST CAPTURE
    ===================================================== */

    function requestCapture(
      delta: number,
      direction:
        CaptureDirection
    ) {
      pendingDeltaRef.current =
        clamp(
          pendingDeltaRef.current +
            delta,
          -600,
          600
        );


      pendingDirectionRef.current =
        direction;


      if (
        capturePendingRef.current
      ) {
        return;
      }


      capturePendingRef.current =
        true;


      post({
        type:
          "COORD_CAPTURE",

        direction:
          direction,
      });
    }


    /* =====================================================
       INPUT STATE MACHINE
    ===================================================== */

    function handleInputDelta(
      rawDelta: number
    ) {
      let delta =
        rawDelta;


      /*
       * Trackpad có thể tạo spike lớn.
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
        Math.abs(delta) <
        0.01
      ) {
        return;
      }


      /* ===============================================
         ĐÃ THOÁT PHÍA DƯỚI
      =============================================== */

      if (
        releasedSideRef.current ===
        "bottom"
      ) {
        /*
         * Vẫn đi xuống:
         *
         * không capture lại.
         * cứ để Wix scroll.
         */
        if (
          delta > 0
        ) {
          passToWix(
            delta
          );

          return;
        }


        /*
         * ĐẢO CHIỀU:
         *
         * user scroll lên.
         *
         * capture lại scene ở
         * trạng thái cuối.
         */
        releasedSideRef.current =
          null;


        requestCapture(
          delta,
          "from-bottom"
        );


        return;
      }


      /* ===============================================
         ĐÃ THOÁT PHÍA TRÊN
      =============================================== */

      if (
        releasedSideRef.current ===
        "top"
      ) {
        /*
         * Vẫn scroll lên:
         * pass về Wix.
         */
        if (
          delta < 0
        ) {
          passToWix(
            delta
          );

          return;
        }


        /*
         * Đảo chiều xuống:
         * capture lại từ đầu.
         */
        releasedSideRef.current =
          null;


        requestCapture(
          delta,
          "from-top"
        );


        return;
      }


      /* ===============================================
         SCENE ĐANG CAPTURE
      =============================================== */

      if (
        capturedRef.current
      ) {
        applySceneDelta(
          delta
        );

        return;
      }


      /* ===============================================
         SCENE CHƯA CAPTURE
      =============================================== */

      requestCapture(
        delta,

        delta < 0
          ? "from-bottom"
          : "from-top"
      );
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
         HANDSHAKE
      ------------------------------------------------ */

      if (
        data.type ===
          "COORD_ACK"
      ) {
        activateBridge();

        return;
      }


      /* -----------------------------------------------
         CAPTURE COMPLETE
      ------------------------------------------------ */

      if (
        data.type ===
          "COORD_CAPTURED"
      ) {
        capturePendingRef.current =
          false;


        capturedRef.current =
          true;


        const direction =
          (
            data.direction ===
            "from-bottom"
          )
            ? "from-bottom"
            : pendingDirectionRef.current;


        /*
         * Quan trọng cho reverse scroll.
         *
         * Nếu vào scene từ phía dưới
         * thì scene phải bắt đầu tại
         * progress = 1.
         */
        if (
          direction ===
            "from-bottom"
        ) {
          /*
           * Nếu đang ở 0 do reload/state reset,
           * đưa thẳng về final frame.
           */
          if (
            progressRef.current <
            0.001
          ) {
            commitProgress(
              1
            );
          }

        } else {
          /*
           * Nếu vào từ phía trên mà
           * progress vô tình đang ở 1.
           */
          if (
            progressRef.current >
            0.999
          ) {
            commitProgress(
              0
            );
          }
        }


        const delta =
          pendingDeltaRef.current;


        pendingDeltaRef.current =
          0;


        if (
          Math.abs(delta) >
          0.01
        ) {
          applySceneDelta(
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
       * Fail-safe:
       *
       * Wix chưa handshake
       * → không khóa browser.
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
        delta *=
          18;
      }


      if (
        event.deltaMode === 2
      ) {
        delta *=
          window.innerHeight;
      }


      handleInputDelta(
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
        1.25;


      touchYRef.current =
        touch.clientY;


      handleInputDelta(
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
       READY
    ===================================================== */

    function sendReady() {
      post({
        type:
          "COORD_READY",
      });
    }


    sendReady();


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
        externalProgress={
          bridgeReady
            ? progress
            : undefined
        }
      />
    </main>
  );
}