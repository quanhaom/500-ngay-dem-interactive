"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CHAPTERS,
} from "../../data/magazine/story";

import styles from "./MagazineExperience.module.css";

export default function ChapterNav() {
  const [
    activeChapter,
    setActiveChapter,
  ] =
    useState<string>(
      "opening"
    );

  useEffect(() => {
    const sections =
      CHAPTERS.map(
        (chapter) =>
          document.getElementById(
            chapter.id
          )
      ).filter(
        (
          item
        ): item is HTMLElement =>
          Boolean(item)
      );

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (visible[0]) {
            setActiveChapter(
              visible[0]
                .target.id
            );
          }
        },
        {
          rootMargin:
            "-25% 0px -55% 0px",

          threshold: [
            0.05,
            0.2,
            0.4,
            0.7,
          ],
        }
      );

    sections.forEach(
      (section) =>
        observer.observe(section)
    );

    return () =>
      observer.disconnect();
  }, []);

  return (
    <nav
      className={
        styles.chapterNav
      }
      aria-label="Điều hướng nội dung"
    >
      <div
        className={
          styles.chapterRail
        }
      />

      {CHAPTERS.map(
        (chapter) => {
          const active =
            activeChapter ===
            chapter.id;

          return (
            <a
              key={
                chapter.id
              }
              href={`#${chapter.id}`}
              className={`${styles.chapterLink} ${
                active
                  ? styles.chapterLinkActive
                  : ""
              }`}
            >
              <span
                className={
                  styles.chapterNumber
                }
              >
                {
                  chapter.number
                }
              </span>

              <i
                className={
                  styles.chapterDot
                }
              />

              <span
                className={
                  styles.chapterLabel
                }
              >
                {
                  chapter.label
                }
              </span>
            </a>
          );
        }
      )}
    </nav>
  );
}