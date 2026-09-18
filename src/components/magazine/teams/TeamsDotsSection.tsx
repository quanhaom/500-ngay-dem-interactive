"use client";

import { useEffect, useRef } from "react";

import styles from "./TeamsDotsSection.module.css";

type TeamGroup =
  | "vietnam"
  | "laos"
  | "cambodia";

type TeamNode = {
  id: number;
  group: TeamGroup;
  x: number;
  y: number;
};

const TEAMS: TeamNode[] = [
  /* 13 đội trong nước */

  { id: 1, group: "vietnam", x: 28, y: 22 },
  { id: 2, group: "vietnam", x: 37, y: 18 },
  { id: 3, group: "vietnam", x: 46, y: 25 },
  { id: 4, group: "vietnam", x: 31, y: 34 },
  { id: 5, group: "vietnam", x: 42, y: 38 },
  { id: 6, group: "vietnam", x: 52, y: 34 },
  { id: 7, group: "vietnam", x: 34, y: 49 },
  { id: 8, group: "vietnam", x: 46, y: 50 },
  { id: 9, group: "vietnam", x: 57, y: 46 },
  { id: 10, group: "vietnam", x: 40, y: 61 },
  { id: 11, group: "vietnam", x: 51, y: 62 },
  { id: 12, group: "vietnam", x: 59, y: 58 },
  { id: 13, group: "vietnam", x: 48, y: 73 },

  /* 8 đội tại Lào */

  { id: 14, group: "laos", x: 17, y: 29 },
  { id: 15, group: "laos", x: 20, y: 40 },
  { id: 16, group: "laos", x: 16, y: 51 },
  { id: 17, group: "laos", x: 23, y: 58 },
  { id: 18, group: "laos", x: 20, y: 69 },
  { id: 19, group: "laos", x: 29, y: 67 },
  { id: 20, group: "laos", x: 25, y: 77 },
  { id: 21, group: "laos", x: 34, y: 80 },

  /* 11 đội tại Campuchia */

  { id: 22, group: "cambodia", x: 67, y: 35 },
  { id: 23, group: "cambodia", x: 75, y: 40 },
  { id: 24, group: "cambodia", x: 66, y: 48 },
  { id: 25, group: "cambodia", x: 78, y: 50 },
  { id: 26, group: "cambodia", x: 70, y: 58 },
  { id: 27, group: "cambodia", x: 81, y: 60 },
  { id: 28, group: "cambodia", x: 65, y: 67 },
  { id: 29, group: "cambodia", x: 76, y: 70 },
  { id: 30, group: "cambodia", x: 84, y: 73 },
  { id: 31, group: "cambodia", x: 70, y: 79 },
  { id: 32, group: "cambodia", x: 80, y: 82 },
];

export default function TeamsDotsSection() {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          section.classList.toggle(
            styles.active,
            entry.isIntersecting
          );
        },
        {
          threshold: 0.25,
        }
      );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            LỰC LƯỢNG TÌM KIẾM
          </span>

          <h2>
            32 đội.
          </h2>

          <p className={styles.people}>
            1.559 người
          </p>

          <p className={styles.description}>
            Các đội tìm kiếm,
            quy tập được triển
            khai trong nước và
            tại Lào, Campuchia.
          </p>
        </div>

        <div
          className={styles.visual}
          aria-label="32 đội tìm kiếm, quy tập"
        >
          <div
            className={styles.field}
          >
            {TEAMS.map(
              (team, index) => (
                <span
                  key={team.id}
                  className={`${styles.node} ${styles[team.group]}`}
                  style={{
                    left: `${team.x}%`,
                    top: `${team.y}%`,
                    animationDelay:
                      `${index * 35}ms`,
                  }}
                />
              )
            )}

            <span
              className={`${styles.label} ${styles.labelVietnam}`}
            >
              VIỆT NAM
              <strong>
                13
              </strong>
            </span>

            <span
              className={`${styles.label} ${styles.labelLaos}`}
            >
              LÀO
              <strong>
                8
              </strong>
            </span>

            <span
              className={`${styles.label} ${styles.labelCambodia}`}
            >
              CAMPUCHIA
              <strong>
                11
              </strong>
            </span>
          </div>

          <div className={styles.legend}>
            <span>
              <i className={styles.vietnamDot} />
              Trong nước
            </span>

            <span>
              <i className={styles.laosDot} />
              Lào
            </span>

            <span>
              <i className={styles.cambodiaDot} />
              Campuchia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}