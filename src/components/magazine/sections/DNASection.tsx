"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  STORY_STATS,
} from "../../../data/magazine/story";

import DNAVisual from "../visuals/DNAVisual";

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

export default function DNASection() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const routeRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    step,
    setStep,
  ] =
    useState(0);

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
            const node =
              sectionRef.current;

            if (!node) {
              return;
            }

            const rect =
              node.getBoundingClientRect();

            const travel =
              Math.max(
                node.offsetHeight -
                  window.innerHeight,
                1
              );

            const progress =
              clamp(
                -rect.top /
                  travel
              );

            let nextStep =
              0;

            if (
              progress >=
              0.76
            ) {
              nextStep =
                3;
            } else if (
              progress >=
              0.5
            ) {
              nextStep =
                2;
            } else if (
              progress >=
              0.24
            ) {
              nextStep =
                1;
            }

            setStep(
              (
                previous
              ) =>
                previous ===
                nextStep
                  ? previous
                  : nextStep
            );

            const routeProgress =
              clamp(
                (
                  progress -
                  0.73
                ) /
                  0.22
              );

            if (
              routeRef.current
            ) {
              routeRef.current.style.setProperty(
                "--route",
                String(
                  routeProgress
                )
              );
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
      id="dna"
      ref={sectionRef}
      className={
        styles.dnaSection
      }
    >
      <div
        className={
          styles.dnaSticky
        }
      >
        <div
          className={
            styles.dnaHeading
          }
        >
          <p
            className={
              styles.sectionIndex
            }
          >
            06 · SAU KHI
            TÌM THẤY
          </p>

          <h2>
            Quy tập chưa phải
            <em>
              điểm kết thúc.
            </em>
          </h2>
        </div>

        <DNAVisual
          step={
            step
          }
        />

        <div
          className={
            styles.dnaSteps
          }
        >
          <article
            className={
              step === 0
                ? styles.dnaStepActive
                : ""
            }
          >
            <span>
              01
            </span>

            <strong>
              {STORY_STATS.dna.gravesSampled.toLocaleString(
                "vi-VN"
              )}
            </strong>

            <p>
              mộ liệt sĩ đã
              được lấy mẫu
            </p>

            <small>
              {
                STORY_STATS
                  .dna
                  .gravesProgress
              }
              % tiến độ
            </small>
          </article>

          <article
            className={
              step === 1
                ? styles.dnaStepActive
                : ""
            }
          >
            <span>
              02
            </span>

            <strong>
              {STORY_STATS.dna.familySamples.toLocaleString(
                "vi-VN"
              )}
            </strong>

            <p>
              mẫu sinh phẩm
              thân nhân
            </p>

            <small>
              nguồn dữ liệu
              phục vụ đối sánh
            </small>
          </article>

          <article
            className={
              step === 2
                ? styles.dnaStepActive
                : ""
            }
          >
            <span>
              03
            </span>

            <div
              className={
                styles.analysisPair
              }
            >
              <div>
                <strong>
                  {STORY_STATS.dna.analyzed.toLocaleString(
                    "vi-VN"
                  )}
                </strong>

                <small>
                  đã phân tích
                </small>
              </div>

              <i />

              <div>
                <strong>
                  {STORY_STATS.dna.synced.toLocaleString(
                    "vi-VN"
                  )}
                </strong>

                <small>
                  vào cơ sở dữ
                  liệu
                </small>
              </div>
            </div>
          </article>

          <article
            className={
              step === 3
                ? styles.dnaStepActive
                : ""
            }
          >
            <span>
              04
            </span>

            <strong>
              {STORY_STATS.dna.transferred.toLocaleString(
                "vi-VN"
              )}
            </strong>

            <p>
              mẫu sinh phẩm
            </p>

            <small>
              TP.HCM → Hà Nội
            </small>
          </article>
        </div>

        <div
          ref={routeRef}
          className={
            styles.sampleRoute
          }
        >
          <div
            className={
              styles.routeCityTop
            }
          >
            <i />

            <span>
              HÀ NỘI
            </span>
          </div>

          <div
            className={
              styles.routeLine
            }
          >
            <span
              className={
                styles.routeFill
              }
            />

            <b
              className={
                styles.routeAircraft
              }
            >
              ✦
            </b>
          </div>

          <div
            className={
              styles.routeCityBottom
            }
          >
            <i />

            <span>
              TP.HCM
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}