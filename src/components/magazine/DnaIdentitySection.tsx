"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./DnaIdentitySection.module.css";

type DnaStory = {
  image: string;
  alt: string;
  side: "left" | "right";
  eyebrow?: string;
  text: string;
};

const STORIES: DnaStory[] = [
  {
    image:
      "/images/readymag/dna/dna-1.jpg",

    alt:
      "Lực lượng chức năng thực hiện lấy mẫu hài cốt liệt sĩ",

    side:
      "left",

    eyebrow:
      "LẤY MẪU HÀI CỐT",

    text:
      "Đến ngày 22/8/2026, lực lượng chức năng đã lấy mẫu tại 148.601 mộ liệt sĩ, đạt 69,8% tiến độ. Trong đó, 102.689 mộ đủ điều kiện lấy mẫu, đạt 69,1%, còn 45.912 mộ chưa đủ điều kiện lấy mẫu.",
  },

  {
    image:
      "/images/readymag/dna/dna-2.jpg",

    alt:
      "Các tổ đội triển khai lấy mẫu tại nghĩa trang liệt sĩ",

    side:
      "right",

    eyebrow:
      "264 TỔ, ĐỘI LẤY MẪU",

    text:
      "Để triển khai nhiệm vụ, 264 tổ, đội lấy mẫu với khoảng 3.500 người đã được huy động. Đến nay, 11/34 tỉnh, thành phố đã hoàn thành công tác lấy mẫu. Những con số này cho thấy quy mô lớn của quá trình thu thập dữ liệu, đồng thời phản ánh khối lượng công việc vẫn đang được tiếp tục tại nhiều địa phương.",
  },

  {
    image:
      "/images/readymag/dna/dna-3.jpg",

    alt:
      "Thu thập mẫu ADN của thân nhân liệt sĩ",

    side:
      "left",

    eyebrow:
      "MẪU SINH PHẨM THÂN NHÂN",

    text:
      "Song song với việc lấy mẫu hài cốt, công tác thu thập mẫu sinh phẩm của thân nhân liệt sĩ cũng được đẩy mạnh. Đến ngày 22/8, tổng số mẫu thân nhân đã được lấy là 265.761 mẫu, trong đó 71.102 mẫu đã được phân tích và 66.909 mẫu được đồng bộ vào cơ sở dữ liệu. Đây là nguồn dữ liệu quan trọng phục vụ quá trình phân tích, đối sánh ADN, từng bước xác định danh tính những liệt sĩ còn thiếu thông tin.",
  },

  {
    image:
      "/images/readymag/dna/dna-4.jpg",

    alt:
      "Tiếp nhận, lưu trữ và giám định mẫu hài cốt liệt sĩ",

    side:
      "right",

    eyebrow:
      "GIÁM ĐỊNH VÀ ĐỐI SÁNH",

    text:
      "Đằng sau những con số là một quy trình đòi hỏi sự chính xác và cẩn trọng ở từng khâu. Đến ngày 22/8, các cơ quan chức năng đã tiếp nhận, lưu trữ và bảo quản 35.983 mẫu hài cốt liệt sĩ của các địa phương. Riêng Viện Pháp y Quân đội đã tiếp nhận 27.169 mẫu hài cốt liệt sĩ của 16/17 tỉnh, thành phố và thực hiện giám định 195 mẫu.",
  },
];

export default function DnaIdentitySection() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const stepRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  useEffect(() => {
    const observers:
      IntersectionObserver[] =
      [];

    stepRefs.current.forEach(
      (element, index) => {
        if (!element) {
          return;
        }

        const observer =
          new IntersectionObserver(
            (entries) => {
              const entry =
                entries[0];

              if (
                entry.isIntersecting
              ) {
                setActiveIndex(
                  index
                );
              }
            },
            {
              root: null,

              threshold:
                0.18,

              rootMargin:
                "-32% 0px -45% 0px",
            }
          );

        observer.observe(
          element
        );

        observers.push(
          observer
        );
      }
    );

    return () => {
      observers.forEach(
        (observer) => {
          observer.disconnect();
        }
      );
    };
  }, []);

  return (
    <section
      id="dna-identity"
      className={
        styles.section
      }
    >
      {/* =========================================
          CHAPTER INTRO
      ========================================== */}

      <div
        className={
          styles.intro
        }
      >
        <div
          className={
            styles.introInner
          }
        >
          <span
            className={
              styles.kicker
            }
          >
            XÁC ĐỊNH DANH TÍNH
          </span>

          <h2>
            Tìm lại danh tính
            từ những mẫu
            sinh phẩm
          </h2>

          <p>
            Một nhiệm vụ quan
            trọng của “Chiến
            dịch 500 ngày đêm”
            là lấy mẫu hài cốt
            liệt sĩ phục vụ
            giám định, xác định
            danh tính.
          </p>
        </div>
      </div>

      {/* =========================================
          SCROLL STORY
      ========================================== */}

      <div
        className={
          styles.scrolly
        }
      >
        {/* =======================================
            STICKY IMAGE STAGE
        ======================================== */}

        <div
          className={
            styles.stickyStage
          }
        >
          {STORIES.map(
            (
              story,
              index
            ) => (
              <div
                key={
                  story.image
                }
                className={`${styles.imageLayer} ${
                  activeIndex ===
                  index
                    ? styles.imageLayerActive
                    : ""
                } ${
                  index <
                  activeIndex
                    ? styles.imageLayerPast
                    : ""
                }`}
              >
                <Image
                  src={
                    story.image
                  }
                  alt={
                    story.alt
                  }
                  fill
                  priority={
                    index === 0
                  }
                  sizes="100vw"
                  className={
                    styles.image
                  }
                />

                <div
                  className={
                    styles.imageShade
                  }
                />
              </div>
            )
          )}

          {/* =====================================
              FRAME / DECOR
          ====================================== */}

          <div
            className={
              styles.topRule
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.imageCounter
            }
          >
            <span>
              {String(
                activeIndex +
                  1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <i />

            <span>
              {String(
                STORIES.length
              ).padStart(
                2,
                "0"
              )}
            </span>
          </div>
        </div>

        {/* =======================================
            TEXT STEPS
        ======================================== */}

        <div
          className={
            styles.steps
          }
        >
          {STORIES.map(
            (
              story,
              index
            ) => {
              const active =
                activeIndex ===
                index;

              return (
                <div
                  key={`${story.image}-text`}
                  ref={(
                    element
                  ) => {
                    stepRefs.current[
                      index
                    ] =
                      element;
                  }}
                  className={`${styles.step} ${
                    story.side ===
                    "left"
                      ? styles.stepLeft
                      : styles.stepRight
                  }`}
                >
                  <article
                    className={`${styles.copy} ${
                      active
                        ? styles.copyActive
                        : ""
                    } ${
                      story.side ===
                      "left"
                        ? styles.copyLeft
                        : styles.copyRight
                    }`}
                  >
                    {story.eyebrow ? (
                      <span
                        className={
                          styles.eyebrow
                        }
                      >
                        {
                          story.eyebrow
                        }
                      </span>
                    ) : null}

                    <p>
                      {
                        story.text
                      }
                    </p>

                    <span
                      className={
                        styles.stepNumber
                      }
                    >
                      0
                      {index +
                        1}
                    </span>
                  </article>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* =========================================
          CLOSING
      ========================================== */}

      <div
        className={
          styles.closing
        }
      >
        <p>
          Mỗi mẫu vật không chỉ
          là dữ liệu phục vụ xét
          nghiệm, mà còn có thể
          trở thành cầu nối giữa
          người đã khuất với
          những người thân đang
          chờ đợi. Phía sau mỗi
          kết quả xác định danh
          tính là một cái tên
          được trả lại, một gia
          đình có thêm lời hồi
          đáp và một hành trình
          trở về được tiến gần
          hơn đến ngày hoàn tất.
        </p>
      </div>
    </section>
  );
}