"use client";

import {
  useEffect,
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
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );


    const wixMode =
      params.get("wix") ===
      "1";


    /*
     * Direct route:
     *
     * /embed/coordinates/
     *
     * giữ nguyên scroll tự nhiên
     * giống web chính.
     */
    if (!wixMode) {
      return;
    }


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


      window.scrollTo({
        top:
          progress *
          maxScroll,

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
      ].join(" ")}
    >
      <OpeningHero />
    </main>
  );
}