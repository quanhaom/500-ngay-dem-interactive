"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  STORY_STATS,
} from "../../../data/magazine/story";

import TeamsVisual from "../visuals/TeamsVisual";

import styles from "../PhaseTwo.module.css";

export default function TeamsSection() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const [
    active,
    setActive,
  ] =
    useState(false);

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
          threshold: 0.2,
        }
      );

    observer.observe(node);

    return () =>
      observer.disconnect();
  }, []);

  return (
    <section
      id="teams"
      ref={sectionRef}
      className={
        styles.teamsSection
      }
    >
      <div
        className={
          styles.teamsHeader
        }
      >
        <p
          className={
            styles.sectionIndex
          }
        >
          05 · CON NGƯỜI
        </p>

        <h2>
          Trên những điểm
          tìm kiếm ấy là
          <em>
            32 đội.
          </em>
        </h2>

        <div
          className={
            styles.peopleStat
          }
        >
          <span>
            {
              STORY_STATS
                .teams.people
                .toLocaleString(
                  "vi-VN"
                )
            }
          </span>

          <div>
            <strong>
              người
            </strong>

            <small>
              tham gia các đội
              tìm kiếm, quy tập
            </small>
          </div>
        </div>
      </div>

      <TeamsVisual
        active={
          active
        }
      />

      <div
        className={
          styles.teamsFooter
        }
      >
        <span>
          TRONG NƯỚC
        </span>

        <i />

        <span>
          LÀO
        </span>

        <i />

        <span>
          CAMPUCHIA
        </span>
      </div>
    </section>
  );
}