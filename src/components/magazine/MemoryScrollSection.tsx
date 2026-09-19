"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./MemoryScrollSection.module.css";

/* =========================================================
   TYPES
========================================================= */

type StoryStep = {
  image: string;
  alt: string;
  caption: string;

  eyebrow: string;

  body?: string;

  intro?: string;

  quote?: string;

  source?: string;

  /*
   * Điều chỉnh trọng tâm ảnh.
   *
   * text trái  -> focus ảnh sang phải
   * text phải  -> focus ảnh sang trái
   */
  imagePosition?: string;
};

/* =========================================================
   STORY DATA
========================================================= */

const STORIES: StoryStep[] = [
  /* =======================================================
     01
     TEXT LEFT
     IMAGE FOCUS RIGHT
  ======================================================= */

  {
    image:
      "/images/readymag/memory/le-thi-rieng-1.jpg",

    alt:
      "Các lực lượng chức năng khảo sát thực địa tại Công viên Lê Thị Riêng",

    caption:
      "Các lực lượng chức năng khảo sát thực địa để xác định vị trí các hố chôn tập thể tại Công viên Lê Thị Riêng.",

    eyebrow:
      "KHI KÝ ỨC TRỞ THÀNH MANH MỐI",

    body:
      "Trong nhiều cuộc tìm kiếm, ký ức của nhân chứng là một trong những nguồn thông tin quan trọng giúp thu hẹp phạm vi khảo sát. Đó có thể là lời kể của người từng chứng kiến trận đánh, người dân sống gần khu vực chiến trường hoặc những người từng tham gia chôn cất, di chuyển hài cốt trong chiến tranh.",

    imagePosition:
      "62% center",
  },

  /* =======================================================
     02
     TEXT RIGHT
     IMAGE FOCUS LEFT
  ======================================================= */

  {
    image:
      "/images/readymag/memory/nguyen-thanh-phuoc.jpg",

    alt:
      "Ông Nguyễn Thành Phước",

    caption:
      "Ông Nguyễn Thành Phước - một nhân chứng lịch sử từng sinh sống lâu năm tại khu vực Bắc Hải, gần Công viên Lê Thị Riêng đã chứng kiến việc đào những hố lớn để chôn tập thể nhiều thi hài chiến sĩ khi còn nhỏ.",

    eyebrow:
      "LỜI KỂ NHÂN CHỨNG",

    intro:
      "Ông kể:",

    quote:
      "Tôi đứng cạnh hầm chôn chỉ vài mét, khi đó có một hầm dài mấy chục mét, ngang khoảng 4m. Nhiều thi hài chiến sĩ được đưa xuống chôn tập thể. Ước mong lớn nhất của tôi là sớm đưa các anh về với đồng đội.",

    source:
      "Nguyễn Thành Phước",

    imagePosition:
      "5% center",
  },

  /* =======================================================
     03
     TEXT LEFT
     IMAGE FOCUS RIGHT
  ======================================================= */

  {
    image:
      "/images/readymag/memory/le-thi-rieng-2.jpg",

    alt:
      "Các lực lượng chức năng đối chiếu tư liệu và nhân chứng",

    caption:
      "Các lực lượng chức năng đối chiếu tư liệu và nhân chứng để xác định vị trí các hố chôn tập thể liệt sĩ.",

    eyebrow:
      "ĐỐI CHIẾU THÔNG TIN",

    body:
      "Lời kể ấy không phải là căn cứ duy nhất, nhưng trở thành một mảnh ghép quan trọng trong quá trình đối chiếu thông tin. Cùng với các bức ảnh tư liệu và dữ liệu kỹ thuật, những dấu vết tưởng như rời rạc dần được kết nối, mở ra khả năng xác định rõ hơn vị trí và quy mô của các khu vực cần khảo sát.",

    imagePosition:
      "90% center",
  },

  /* =======================================================
     04
     TEXT RIGHT
     KTS NGUYỄN XUÂN THẮNG
     IMAGE FOCUS LEFT
  ======================================================= */

  {
    image:
      "/images/readymag/memory/nguyen-xuan-thang.jpg",

    alt:
      "Kiến trúc sư Nguyễn Xuân Thắng",

    caption:
      "Kiến trúc sư Nguyễn Xuân Thắng nhận định về ba bức ảnh tư liệu có thể giúp xác định rõ hơn vị trí và quy mô các rãnh mộ tập thể từng tồn tại tại khu vực Công viên Lê Thị Riêng.",

    eyebrow:
      "PHÂN TÍCH TƯ LIỆU",

    intro:
      "Kiến trúc sư Nguyễn Xuân Thắng nhận định:",

    quote:
      "Ba bức ảnh, khi được đặt cạnh nhau, mở ra khả năng xác định rõ hơn vị trí và quy mô của các rãnh mộ tập thể từng tồn tại tại khu vực này. Đặc biệt, dữ liệu EXIF - những thông tin kỹ thuật được lưu kèm tệp ảnh trở thành một manh mối quan trọng. Phần dữ liệu còn được lưu trên nền tảng lưu trữ cho biết thời điểm chụp và nội dung liên quan đến việc chôn cất tập thể.",

    source:
      "KTS Nguyễn Xuân Thắng",

    /*
     * Quote ở bên phải
     * nên focus ảnh về trái.
     *
     * Nếu người vẫn bị text che:
     * thử 30% hoặc 27%.
     */
    imagePosition:
      "35% center",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function MemoryScrollSection() {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const stepRefs =
    useRef<
      Array<HTMLElement | null>
    >([]);

  /* =======================================================
     ACTIVE STEP OBSERVER
  ======================================================= */

  useEffect(() => {
    const observers: IntersectionObserver[] =
      [];

    stepRefs.current.forEach(
      (
        element,
        index
      ) => {
        if (!element) {
          return;
        }

        const observer =
          new IntersectionObserver(
            (
              entries
            ) => {
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
              root:
                null,

              threshold:
                0.22,

              rootMargin:
                "-34% 0px -42% 0px",
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
        (
          observer
        ) => {
          observer.disconnect();
        }
      );
    };
  }, []);

  return (
    <section
      id="memory-clues"
      className={
        styles.section
      }
    >
      {/* =================================================
          STICKY FULL-SCREEN VISUAL
      ================================================== */}

      <div
        className={
          styles.stickyStage
        }
      >
        {/* ===============================================
            IMAGE STACK
        ================================================ */}

        <div
          className={
            styles.imageStack
          }
        >
          {STORIES.map(
            (
              story,
              index
            ) => {
              const defaultPosition =
                index %
                  2 ===
                0
                  ? "62% center"
                  : "38% center";

              return (
                <div
                  key={
                    story.image
                  }
                  className={`${styles.imageLayer} ${
                    activeIndex ===
                    index
                      ? styles.imageLayerActive
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
                      index ===
                      0
                    }
                    sizes="100vw"
                    className={
                      styles.bgImage
                    }
                    style={{
                      objectPosition:
                        story.imagePosition ??
                        defaultPosition,
                    }}
                  />
                </div>
              );
            }
          )}
        </div>

        {/* ===============================================
            COLOR OVERLAY
        ================================================ */}

        <div
          className={`${styles.stageOverlay} ${
            activeIndex %
              2 ===
            0
              ? styles.overlayLeft
              : styles.overlayRight
          }`}
        />

        {/* ===============================================
            GLOBAL CINEMATIC SHADE
        ================================================ */}

        <div
          className={
            styles.globalShade
          }
        />

        {/* ===============================================
            CAPTION
        ================================================ */}

        <div
          className={
            styles.captionWrap
          }
        >
          {STORIES.map(
            (
              story,
              index
            ) => {
              const captionOnRight =
                index %
                  2 ===
                0;

              return (
                <div
                  key={`${story.image}-caption`}
                  className={`${styles.captionLayer} ${
                    activeIndex ===
                    index
                      ? styles.captionLayerActive
                      : ""
                  } ${
                    captionOnRight
                      ? styles.captionRight
                      : styles.captionLeft
                  }`}
                >
                  <p
                    className={
                      styles.caption
                    }
                  >
                    {
                      story.caption
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>

        {/* ===============================================
            COUNTER
        ================================================ */}

        <div
          className={
            styles.counter
          }
          aria-hidden="true"
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

      {/* =================================================
          SCROLLING STORY
      ================================================== */}

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
            const isLeft =
              index %
                2 ===
              0;

            const isQuote =
              Boolean(
                story.quote
              );

            return (
              <article
                key={`${story.image}-step`}
                ref={(
                  node
                ) => {
                  stepRefs.current[
                    index
                  ] =
                    node;
                }}
                className={`${styles.step} ${
                  isLeft
                    ? styles.stepLeft
                    : styles.stepRight
                }`}
              >
                <div
                  className={`${styles.copy} ${
                    isQuote
                      ? styles.quoteCopy
                      : ""
                  } ${
                    activeIndex ===
                    index
                      ? styles.copyActive
                      : ""
                  }`}
                >
                  {/* ===============================
                      EYEBROW
                  ================================ */}

                  <span
                    className={
                      styles.eyebrow
                    }
                  >
                    {
                      story.eyebrow
                    }
                  </span>

                  {/* ===============================
                      NORMAL BODY
                  ================================ */}

                  {story.body && (
                    <p
                      className={
                        styles.body
                      }
                    >
                      {
                        story.body
                      }
                    </p>
                  )}

                  {/* ===============================
                      INTERVIEW / QUOTE
                  ================================ */}

                  {story.quote && (
                    <>
                      {story.intro && (
                        <p
                          className={
                            styles.quoteIntro
                          }
                        >
                          {
                            story.intro
                          }
                        </p>
                      )}

                      <div
                        className={
                          styles.quoteBox
                        }
                      >
                        <span
                          className={
                            styles.quoteMark
                          }
                          aria-hidden="true"
                        >
                          “
                        </span>

                        <blockquote
                          className={
                            styles.quote
                          }
                        >
                          {
                            story.quote
                          }
                        </blockquote>

                        {story.source && (
                          <span
                            className={
                              styles.quoteSource
                            }
                          >
                            {
                              story.source
                            }
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}