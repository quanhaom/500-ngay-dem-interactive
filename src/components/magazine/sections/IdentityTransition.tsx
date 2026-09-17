"use client";

import {
  useEffect,
  useRef,
} from "react";

import styles from "../PhaseTwo.module.css";

function clamp(
  value: number
) {
  return Math.max(
    0,
    Math.min(
      1,
      value
    )
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

export default function IdentityTransition() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const helixRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const lineRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const labelRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const identityRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    let frame =
      0;

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

            const collapse =
              phase(
                progress,
                0.08,
                0.52
              );

            const line =
              phase(
                progress,
                0.42,
                0.67
              );

            const identity =
              phase(
                progress,
                0.63,
                0.91
              );

            if (
              helixRef.current
            ) {
              helixRef.current.style.opacity =
                String(
                  1 -
                    collapse
                );

              helixRef.current.style.transform =
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scaleY(
                    ${
                      1 -
                      collapse *
                        0.92
                    }
                  )
                  scaleX(
                    ${
                      1 +
                      collapse *
                        0.16
                    }
                  )
                `;
            }

            if (
              lineRef.current
            ) {
              lineRef.current.style.transform =
                `scaleX(${line})`;

              lineRef.current.style.opacity =
                String(
                  line
                );
            }

            if (
              labelRef.current
            ) {
              labelRef.current.style.opacity =
                String(
                  phase(
                    progress,
                    0.25,
                    0.5
                  ) *
                    (
                      1 -
                      identity
                    )
                );
            }

            if (
              identityRef.current
            ) {
              identityRef.current.style.opacity =
                String(
                  identity
                );

              identityRef.current.style.transform =
                `translate3d(
                  -50%,
                  ${
                    (
                      1 -
                      identity
                    ) *
                    30
                  }px,
                  0
                )`;
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
        styles.identityTransition
      }
    >
      <div
        className={
          styles.identityTransitionSticky
        }
      >
        <div
          className={
            styles.identityTransitionGlow
          }
        />

        <div
          ref={helixRef}
          className={
            styles.collapsingHelix
          }
        >
          <svg
            viewBox="0 0 1000 260"
            aria-hidden="true"
          >
            <path
              d="
                M0 130
                C100 0 200 260 300 130
                S500 0 600 130
                S800 260 1000 130
              "
            />

            <path
              d="
                M0 130
                C100 260 200 0 300 130
                S500 260 600 130
                S800 0 1000 130
              "
            />
          </svg>
        </div>

        <div
          ref={labelRef}
          className={
            styles.identityProcessLabel
          }
        >
          <span>
            MẪU
          </span>

          <i />

          <span>
            PHÂN TÍCH
          </span>

          <i />

          <span>
            ĐỐI SÁNH
          </span>
        </div>

        <div
          ref={lineRef}
          className={
            styles.identityTransformLine
          }
        />

        <div
          ref={identityRef}
          className={
            styles.identityReveal
          }
        >
          <small>
            ĐÍCH ĐẾN
          </small>

          <div>
            <span>
              HỌ VÀ TÊN
            </span>

            <i />
          </div>

          <p>
            Một dữ liệu sinh học
            chỉ thật sự hoàn tất
            hành trình khi nó có
            thể được nối lại với
            một danh tính.
          </p>
        </div>
      </div>
    </section>
  );
}