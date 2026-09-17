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

import styles from "../PhaseTwo.module.css";

type DotStyle =
  CSSProperties &
  Record<
    "--delay",
    string
  >;

export default function MemorialSection() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const [
    active,
    setActive,
  ] =
    useState(false);

  const dots =
    useMemo(
      () =>
        Array.from(
          {
            length:
              STORY_STATS
                .leThiRieng
                .value,
          },
          (_, index) => ({
            id: index,

            style: {
              "--delay":
                `${
                  (
                    (
                      index *
                      17
                    ) %
                    97
                  ) *
                  4
                }ms`,
            } as DotStyle,
          })
        ),
      []
    );

  useEffect(() => {
    const node =
      sectionRef.current;

    if (!node) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setActive(true);
          }
        },
        {
          threshold: 0.22,
        }
      );

    observer.observe(node);

    return () =>
      observer.disconnect();
  }, []);

  return (
    <section
      id="memorial"
      ref={sectionRef}
      className={`${styles.memorialSection} ${
        active
          ? styles.memorialActive
          : ""
      }`}
    >
      <div
        className={
          styles.memorialIntro
        }
      >
        <p
          className={
            styles.sectionIndex
          }
        >
          04 · MỘT ĐỊA ĐIỂM
        </p>

        <h2>
          Có những con số
          <br />
          tập trung vào
          <em>
            một điểm trên bản đồ.
          </em>
        </h2>
      </div>

      <div
        className={
          styles.memorialStage
        }
      >
        <div
          className={
            styles.memorialNumber
          }
        >
          <span>
            418
          </span>

          <strong>
            hài cốt liệt sĩ
          </strong>
        </div>

        <div
          className={
            styles.memorialDots
          }
          aria-hidden="true"
        >
          {dots.map(
            (dot) => (
              <i
                key={dot.id}
                style={
                  dot.style
                }
              />
            )
          )}
        </div>

        <div
          className={
            styles.memorialLocation
          }
        >
          <span>
            10.786° N
          </span>

          <i />

          <span>
            106.667° E
          </span>
        </div>
      </div>

      <div
        className={
          styles.memorialCaption
        }
      >
        <div>
          <strong>
            {
              STORY_STATS
                .leThiRieng
                .label
            }
          </strong>

          <span>
            {
              STORY_STATS
                .leThiRieng
                .location
            }
          </span>
        </div>

        <p>
          Mỗi chấm trong
          trường dữ liệu trên
          tương ứng với một
          đơn vị trong mốc
          418 của bài tổng hợp.
        </p>
      </div>

      <small
        className={
          styles.dataSnapshot
        }
      >
        {
          STORY_STATS
            .leThiRieng
            .note
        }
      </small>
    </section>
  );
}