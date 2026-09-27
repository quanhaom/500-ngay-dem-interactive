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
  const touchYRef =
    useRef<number | null>(
      null
    );


  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );


    /*
     * Không có ?wix=1
     * → hoạt động hoàn toàn như page chính.
     */
    const wixMode =
      params.get("wix") ===
      "1";


    if (!wixMode) {
      return;
    }


    /*
     * Chỉ khóa wheel iframe sau khi
     * Velo xác nhận bridge đã hoạt động.
     *
     * Nếu Wix/Velo lỗi thì iframe vẫn
     * scroll được, không bị "đóng băng".
     */
    let bridgeReady =
      false;


    let wheelDelta =
      0;


    let wheelFrame =
      0;


    /* =====================================================
       DOCUMENT
    ===================================================== */

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
       POST TO WIX
    ===================================================== */

    function sendToWix(
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
       RECEIVE FROM WIX
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
         Wix bridge đã sẵn sàng.
      ------------------------------------------------ */

      if (
        data.type ===
          "COORD_ACK"
      ) {
        bridgeReady =
          true;

        return;
      }


      /* -----------------------------------------------
         Wix scroll → OpeningHero progress.
      ------------------------------------------------ */

      if (
        data.type ===
          "COORD_PROGRESS"
      ) {
        const progress =
          clamp(
            Number(
              data.progress
            ) || 0
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
    }


    /* =====================================================
       WHEEL BATCH
    ===================================================== */

    function flushWheel() {
      wheelFrame =
        0;


      let delta =
        wheelDelta;


      wheelDelta =
        0;


      /*
       * Tránh touchpad tạo spike quá mạnh.
       */
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


      sendToWix({
        type:
          "COORD_WHEEL",

        deltaY:
          delta,
      });
    }


    /* =====================================================
       WHEEL
    ===================================================== */

    function handleWheel(
      event: WheelEvent
    ) {
      /*
       * Nếu Velo chưa ACK thì KHÔNG chặn.
       *
       * Nhờ vậy route không bao giờ
       * bị khóa scroll.
       */
      if (
        !bridgeReady
      ) {
        return;
      }


      event.preventDefault();
      event.stopPropagation();


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


      wheelDelta +=
        delta;


      if (
        !wheelFrame
      ) {
        wheelFrame =
          requestAnimationFrame(
            flushWheel
          );
      }
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
      if (
        !bridgeReady
      ) {
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


      wheelDelta +=
        delta;


      if (
        !wheelFrame
      ) {
        wheelFrame =
          requestAnimationFrame(
            flushWheel
          );
      }
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
        passive:
          false,
      }
    );


    window.addEventListener(
      "touchstart",
      handleTouchStart,
      {
        passive:
          true,
      }
    );


    window.addEventListener(
      "touchmove",
      handleTouchMove,
      {
        passive:
          false,
      }
    );


    window.addEventListener(
      "touchend",
      handleTouchEnd
    );


    /* =====================================================
       READY
    ===================================================== */

    const readyTimer =
      window.setTimeout(
        () => {
          sendToWix({
            type:
              "COORD_READY",
          });
        },
        250
      );


    /*
     * Gửi thêm lần nữa phòng trường hợp
     * Wix Page Code load chậm hơn iframe.
     */
    const retryTimer =
      window.setTimeout(
        () => {
          if (
            !bridgeReady
          ) {
            sendToWix({
              type:
                "COORD_READY",
            });
          }
        },
        1000
      );


    /* =====================================================
       CLEANUP
    ===================================================== */

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


      window.clearTimeout(
        readyTimer
      );


      window.clearTimeout(
        retryTimer
      );


      if (
        wheelFrame
      ) {
        cancelAnimationFrame(
          wheelFrame
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