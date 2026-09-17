"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "../PhaseTwo.module.css";

export default function EndingSection() {
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
          threshold:
            0.3,
        }
      );

    observer.observe(node);

    return () =>
      observer.disconnect();
  }, []);

  return (
    <section
      id="identity"
      ref={sectionRef}
      className={`${styles.endingSection} ${
        active
          ? styles.endingActive
          : ""
      }`}
    >
      <div
        className={
          styles.identityRecords
        }
        aria-hidden="true"
      >
        {Array.from(
          {
            length: 12,
          },
          (_, index) => (
            <div
              key={index}
            >
              <span>
                HỌ VÀ TÊN
              </span>

              <i />

              <small>
                CHƯA XÁC ĐỊNH
              </small>
            </div>
          )
        )}
      </div>

      <div
        className={
          styles.endingContent
        }
      >
        <p>
          ĐÍCH ĐẾN
        </p>

        <h2>
          Cuối cùng,
          <br />
          hành trình ấy
          <br />
          không hướng tới
          <span>
            một con số.
          </span>
        </h2>

        <div
          className={
            styles.endingPause
          }
        />

        <strong>
          MÀ LÀ
          <br />
          MỘT CÁI TÊN.
        </strong>

        <div
          className={
            styles.identityLine
          }>
          <span>
            HỌ VÀ TÊN
          </span>

          <i />
        </div>
      </div>

      <div
        className={
          styles.endingFooter
        }
      >
        <span>
          500 NGÀY ĐÊM
        </span>

        <span>
          TÌM KIẾM · QUY TẬP
          · XÁC ĐỊNH DANH TÍNH
        </span>
      </div>
    </section>
  );
}