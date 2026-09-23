"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import SubtitleImage from "./SubtitleImage";

import styles from "./DnaIdentitySection.module.css";


const STORIES = [
  {
    image:
      "/images/readymag/dna/dna-1.jpg",

    text:
      "148.601 phần mộ đã được lấy mẫu, đạt 69,8%. Trong đó, 102.689 mẫu đủ điều kiện phục vụ giám định, tương đương 69,1%; 45.912 mẫu còn lại chưa đủ điều kiện.",

    side:
      "left" as const,
  },

  {
    image:
      "/images/readymag/dna/dna-2.jpg",

    text:
      "264 tổ lấy mẫu với khoảng 3.500 người được huy động. Đến nay, 11/34 tỉnh, thành phố đã hoàn thành công tác lấy mẫu.",

    side:
      "right" as const,
  },

  {
    image:
      "https://cdn-images.vtv.vn/thumb_w/1200/66349b6076cb4dee98746cf1/2026/07/09/anh-6-51626575313164794750339.jpg",

    text:
      "265.761 mẫu thân nhân liệt sĩ đã được thu thập; 71.102 mẫu được phân tích và 66.909 kết quả đã được đồng bộ vào hệ thống dữ liệu.",

    side:
      "left" as const,
  },

  {
    image:
      "https://cdn.nhandan.vn/images/-sKnr5TwgX2qCv6f7Q2Evm3vnhvdmT3KILbjs4rok1ejnwvj0Wj3orLSWLodesnQ/dscf3934.jpg.avif",

    text:
      "35.983 mẫu hài cốt đang được lưu giữ. Riêng Viện Pháp y Quân đội đã tiếp nhận 27.169 mẫu từ 16/17 tỉnh, thành phố và triển khai giám định 195 mẫu.",

    side:
      "right" as const,
  },
];


export default function DnaIdentitySection() {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const refs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >([]);

  useEffect(() => {
    const observers =
      refs.current.map(
        (
          element,
          index
        ) => {
          if (!element) {
            return null;
          }

          const observer =
            new IntersectionObserver(
              ([entry]) => {
                if (
                  entry.isIntersecting
                ) {
                  setActiveIndex(
                    index
                  );
                }
              },
              {
                threshold:
                  0.18,

                rootMargin:
                  "-32% 0px -45% 0px",
              }
            );

          observer.observe(
            element
          );

          return observer;
        }
      );

    return () => {
      observers.forEach(
        (
          observer
        ) => {
          observer?.disconnect();
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
      <SubtitleImage
        alt="Tìm lại danh tính từ những mẫu sinh phẩm"
        imagePath="/images/readymag/subtitles/dna-identity.png"
        maxWidth={1080}
      />

      <div
        className={
          styles.intro
        }
      >
        <p
          className={
            styles.introBody
          }
        >
          <span
            className={
              styles.dropCap
            }
          >
            V
          </span>

          iệc lấy mẫu hài cốt liệt sĩ phục vụ giám định,
          xác định danh tính là một nhiệm vụ quan trọng
          của “Chiến dịch 500 ngày đêm”.
        </p>
      </div>

      <div
        className={
          styles.scrolly
        }
      >
        <div
          className={
            styles.stickyVisual
          }
        >
          {STORIES.map(
            (
              story,
              index
            ) => (
              <img
                key={
                  story.image
                }
                src={
                  story.image
                }
                alt=""
                className={[
                  styles.image,

                  activeIndex ===
                  index
                    ? styles.imageActive
                    : "",
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " "
                  )}
              />
            )
          )}
        </div>

        <div
          className={
            styles.steps
          }
        >
          <div
            className={
              styles.imageLead
            }
          />

          {STORIES.map(
            (
              story,
              index
            ) => (
              <div
                key={
                  story.text
                }
                ref={(
                  node
                ) => {
                  refs.current[
                    index
                  ] =
                    node;
                }}
                className={[
                  styles.step,

                  story.side ===
                  "left"
                    ? styles.stepLeft
                    : styles.stepRight,
                ].join(
                  " "
                )}
              >
                <div
                  className={
                    styles.card
                  }
                >
                  <p>
                    {
                      story.text
                    }
                  </p>
                </div>
              </div>
            )
          )}

          <div
            className={
              styles.imageTail
            }
          />
        </div>
      </div>

      <div
        className={
          styles.closing
        }
      >
        <p>
          Mỗi mẫu vật không chỉ là dữ liệu phục vụ xét
          nghiệm, mà còn có thể trở thành cầu nối giữa
          người đã khuất với những người thân đang chờ
          đợi. Phía sau mỗi kết quả xác định danh tính là
          một cái tên được trả lại, một gia đình có thêm
          lời hồi đáp và một hành trình trở về được tiến
          gần hơn đến ngày hoàn tất.
        </p>
      </div>
    </section>
  );
}