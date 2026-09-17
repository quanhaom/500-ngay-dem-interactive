"use client";

import {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  STORY_STATS,
} from "../../../data/magazine/story";

import styles from "../MagazineExperience.module.css";

type DotStyle =
  CSSProperties &
  Record<
    | "--sx"
    | "--sy"
    | "--tx"
    | "--ty"
    | "--delay",
    string
  >;

interface DotData {
  id: number;

  region:
    | "vietnam"
    | "laos"
    | "cambodia";

  style: DotStyle;
}

/* =========================================================
   DETERMINISTIC RANDOM

   Không dùng Math.sin / Math.random vì có thể tạo sai lệch
   floating point rất nhỏ giữa SSR và browser.
========================================================= */

function seededRandom(
  seed: number
) {
  let value =
    (seed +
      0x6d2b79f5) |
    0;

  value =
    Math.imul(
      value ^
        (value >>> 15),
      value | 1
    );

  value ^=
    value +
    Math.imul(
      value ^
        (value >>> 7),
      value | 61
    );

  return (
    (
      value ^
      (value >>> 14)
    ) >>>
    0
  ) /
    4294967296;
}

function percent(
  value: number
) {
  return `${value.toFixed(
    4
  )}%`;
}

function seconds(
  value: number
) {
  return `${value.toFixed(
    3
  )}s`;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ScaleSection() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const [
    active,
    setActive,
  ] =
    useState(false);

  /* =======================================================
     DOT DATA

     Toàn bộ giá trị inline style giờ deterministic 100%.
  ======================================================= */

  const dots =
    useMemo<DotData[]>(
      () => {
        const total =
          120;

        return Array.from(
          {
            length: total,
          },
          (_, index) => {
            let region:
              | "vietnam"
              | "laos"
              | "cambodia";

            let localIndex:
              number;

            let count:
              number;

            let centerX:
              number;

            if (
              index < 54
            ) {
              region =
                "vietnam";

              localIndex =
                index;

              count = 54;

              centerX =
                21;
            } else if (
              index < 65
            ) {
              region =
                "laos";

              localIndex =
                index -
                54;

              count = 11;

              centerX =
                50;
            } else {
              region =
                "cambodia";

              localIndex =
                index -
                65;

              count = 55;

              centerX =
                79;
            }

            const columns =
              Math.ceil(
                Math.sqrt(
                  count
                )
              );

            const rows =
              Math.ceil(
                count /
                  columns
              );

            const column =
              localIndex %
              columns;

            const row =
              Math.floor(
                localIndex /
                  columns
              );

            /*
             * Vị trí cuối.
             */

            const targetX =
              centerX +
              (
                column -
                (
                  columns -
                  1
                ) /
                  2
              ) *
                1.55;

            const targetY =
              48 +
              (
                row -
                (
                  rows -
                  1
                ) /
                  2
              ) *
                2.7;

            /*
             * Vị trí xuất phát.
             *
             * seededRandom dùng toán tử integer nên server/client
             * cho cùng kết quả.
             */

            const startX =
              42 +
              seededRandom(
                index +
                  2
              ) *
                16;

            const startY =
              38 +
              seededRandom(
                index +
                  99
              ) *
                23;

            const delay =
              (
                index %
                18
              ) *
              0.025;

            return {
              id: index,

              region,

              style: {
                "--sx":
                  percent(
                    startX
                  ),

                "--sy":
                  percent(
                    startY
                  ),

                "--tx":
                  percent(
                    targetX
                  ),

                "--ty":
                  percent(
                    targetY
                  ),

                "--delay":
                  seconds(
                    delay
                  ),
              },
            };
          }
        );
      },
      []
    );

  /* =======================================================
     REVEAL
  ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setActive(
              true
            );
          }
        },
        {
          threshold:
            0.3,
        }
      );

    observer.observe(
      section
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="scale"
      data-chapter="scale"
      ref={sectionRef}
      className={`${styles.scaleSection} ${
        active
          ? styles.scaleActive
          : ""
      }`}
    >
      <div
        className={
          styles.scaleHeading
        }
      >
        <p
          className={
            styles.eyebrow
          }
        >
          01 · QUY MÔ
        </p>

        <div
          className={
            styles.scaleNumber
          }
        >
          1.863
        </div>

        <h2>
          hài cốt liệt sĩ
          đã được tìm kiếm,
          quy tập
        </h2>
      </div>

      <div
        className={
          styles.dotVisual
        }
      >
        {dots.map(
          (dot) => (
            <span
              key={
                dot.id
              }
              style={
                dot.style
              }
              className={`${styles.scaleDot} ${
                styles[
                  `scaleDot_${dot.region}`
                ]
              }`}
            />
          )
        )}

        <div
          className={`${styles.countryStat} ${styles.countryVietnam}`}
        >
          <strong>
            {
              STORY_STATS
                .countries[0]
                .value
            }
          </strong>

          <span>
            Việt Nam
          </span>
        </div>

        <div
          className={`${styles.countryStat} ${styles.countryLaos}`}
        >
          <strong>
            {
              STORY_STATS
                .countries[1]
                .value
            }
          </strong>

          <span>
            Lào
          </span>
        </div>

        <div
          className={`${styles.countryStat} ${styles.countryCambodia}`}
        >
          <strong>
            {
              STORY_STATS
                .countries[2]
                .value
            }
          </strong>

          <span>
            Campuchia
          </span>
        </div>
      </div>

      <p
        className={
          styles.dotNote
        }
      >
        Biểu đồ chấm được
        giản lược để thể hiện
        tỷ lệ tương đối giữa
        ba khu vực.
      </p>
    </section>
  );
}