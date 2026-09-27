"use client";

import {
  useEffect,
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
     * Route thường:
     *
     * /embed/coordinates/
     *
     * KHÔNG làm gì.
     * OpeningHero scroll tự nhiên
     * giống page chính.
     */
    if (!isWix) {
      return;
    }


    /*
     * Wix mode:
     *
     * Không bắt wheel.
     * Không gửi COORD_WHEEL.
     *
     * Chỉ nhận progress từ Wix.
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


    function handleMessage(
      event: MessageEvent
    ) {
      const data =
        event.data;


      if (
        !data ||
        data.source !==
          SOURCE ||
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
        getMaxScroll();


      /*
       * OpeningHero gốc đang dùng
       * window.scroll để tính progress.
       *
       * Ta giữ nguyên OpeningHero.
       */
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


    window.addEventListener(
      "message",
      handleMessage
    );


    return () => {
      window.removeEventListener(
        "message",
        handleMessage
      );
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
      <OpeningHero />
    </main>
  );
}