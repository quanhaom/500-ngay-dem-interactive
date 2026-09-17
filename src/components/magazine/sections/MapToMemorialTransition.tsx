"use client";

import {
  useEffect,
  useRef,
} from "react";

import styles from "../PhaseTwo.module.css";

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

function phase(
  value: number,
  start: number,
  end: number
) {
  return clamp(
    (value - start) /
      (end - start)
  );
}

export default function MapToMemorialTransition() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const gridRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const ringRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const pointRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const locationRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const numberRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const lineRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    let frame = 0;

    function update() {
      cancelAnimationFrame(
        frame
      );

      frame =
        requestAnimationFrame(
          () => {
            const section =
              sectionRef.current;

            if (!section) {
              return;
            }

            const rect =
              section.getBoundingClientRect();

            const travel =
              Math.max(
                section.offsetHeight -
                  window.innerHeight,
                1
              );

            const progress =
              clamp(
                -rect.top /
                  travel
              );

            const search =
              phase(
                progress,
                0.05,
                0.42
              );

            const lock =
              phase(
                progress,
                0.34,
                0.65
              );

            const reveal =
              phase(
                progress,
                0.61,
                0.9
              );

            if (
              gridRef.current
            ) {
              gridRef.current.style.opacity =
                String(
                  0.28 *
                    (
                      1 -
                      reveal
                    )
                );

              gridRef.current.style.transform =
                `scale(${
                  1 +
                  search *
                    0.16
                })`;
            }

            if (
              ringRef.current
            ) {
              ringRef.current.style.transform =
                `
                translate(
                  -50%,
                  -50%
                )
                scale(
                  ${
                    2.7 -
                    lock *
                      1.7
                  }
                )
              `;

              ringRef.current.style.opacity =
                String(
                  0.15 +
                    lock *
                      0.85
                );
            }

            if (
              pointRef.current
            ) {
              pointRef.current.style.transform =
                `translate(
                  -50%,
                  -50%
                )
                scale(
                  ${
                    0.5 +
                    lock *
                      1.2
                  }
                )`;

              pointRef.current.style.opacity =
                String(
                  lock
                );
            }

            if (
              locationRef.current
            ) {
              locationRef.current.style.opacity =
                String(
                  phase(
                    progress,
                    0.35,
                    0.55
                  ) *
                    (
                      1 -
                      reveal
                    )
                );

              locationRef.current.style.transform =
                `translate3d(
                  -50%,
                  ${
                    (
                      1 -
                      lock
                    ) *
                    25
                  }px,
                  0
                )`;
            }

            if (
              numberRef.current
            ) {
              numberRef.current.style.opacity =
                String(
                  reveal
                );

              numberRef.current.style.transform =
                `
                translate(
                  -50%,
                  -50%
                )
                scale(
                  ${
                    0.75 +
                    reveal *
                      0.25
                  }
                )
              `;
            }

            if (
              lineRef.current
            ) {
              lineRef.current.style.transform =
                `scaleX(${reveal})`;
            }
          }
        );
    }

    update();

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        "scroll",
        update
      );

      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={
        styles.mapToMemorial
      }
    >
      <div
        className={
          styles.mapTransitionSticky
        }
      >
        <div
          ref={gridRef}
          className={
            styles.mapTransitionGrid
          }
        />

        <div
          className={
            styles.mapTransitionVignette
          }
        />

        <div
          className={
            styles.transitionChrome
          }
        >
          <span>
            ĐỊNH VỊ
          </span>

          <span>
            TP. HỒ CHÍ MINH
          </span>
        </div>

        <div
          ref={ringRef}
          className={
            styles.targetRing
          }
        >
          <span />

          <span />

          <span />
        </div>

        <div
          ref={pointRef}
          className={
            styles.targetPoint
          }
        >
          <i />
        </div>

        <div
          ref={locationRef}
          className={
            styles.targetLocation
          }
        >
          <span>
            10.786° N
          </span>

          <strong>
            CÔNG VIÊN
            <br />
            LÊ THỊ RIÊNG
          </strong>

          <span>
            106.667° E
          </span>
        </div>

        <div
          ref={numberRef}
          className={
            styles.transition418
          }
        >
          <small>
            MỘT ĐIỂM
            <br />
            TRÊN BẢN ĐỒ
          </small>

          <strong>
            418
          </strong>

          <p>
            hài cốt liệt sĩ
          </p>

          <div
            ref={lineRef}
            className={
              styles.transition418Line
            }
          />
        </div>
      </div>
    </section>
  );
}