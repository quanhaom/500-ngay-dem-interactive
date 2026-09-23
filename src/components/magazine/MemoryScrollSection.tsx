"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import SubtitleImage from "./SubtitleImage";

import styles from "./MemoryScrollSection.module.css";


type MemoryStory = {
  image: string;

  alt: string;

  side:
    | "left"
    | "right";

  type:
    | "text"
    | "quote";

  content: string;

  source?: string;

  caption?: string;

  objectPosition?: string;
};


const STORIES: MemoryStory[] = [
  {
    image:
      "/images/readymag/memory/le-thi-rieng-1.jpg",

    alt:
      "Khảo sát thực địa tại Công viên Lê Thị Riêng",

    side:
      "left",

    type:
      "text",

    content:
      "Tại Công viên Lê Thị Riêng (Thành phố Hồ Chí Minh), hành trình tìm kiếm dấu tích các hố chôn tập thể được bắt đầu từ sự kết nối giữa dữ liệu lịch sử, hình ảnh tư liệu và lời kể của những người từng chứng kiến sự việc.",

    caption:
      "Các lực lượng chức năng khảo sát thực địa để xác định vị trí các hố chôn tập thể tại Công viên Lê Thị Riêng.",

    objectPosition:
      "62% center",
  },

  {
    image:
      "/images/readymag/memory/nguyen-thanh-phuoc.jpg",

    alt:
      "Ông Nguyễn Thành Phước",

    side:
      "right",

    type:
      "quote",

    content:
      "Tôi đứng cạnh hầm chôn chỉ vài mét, khi đó có một hầm dài mấy chục mét, ngang khoảng 4m. Nhiều thi hài chiến sĩ được đưa xuống chôn tập thể. Ước mong lớn nhất của tôi là sớm đưa các anh về với đồng đội.",

    source:
      "Nguyễn Thành Phước",

    objectPosition:
      "34% center",
  },

  {
    image:
      "/images/readymag/memory/le-thi-rieng-2.jpg",

    alt:
      "Đối chiếu thông tin trong quá trình tìm kiếm",

    side:
      "left",

    type:
      "text",

    content:
      "Lời kể ấy không phải là căn cứ duy nhất, nhưng trở thành một mảnh ghép quan trọng trong quá trình đối chiếu thông tin. Cùng với các bức ảnh tư liệu và dữ liệu kỹ thuật, những dấu vết tưởng như rời rạc dần được kết nối, mở ra khả năng xác định rõ hơn vị trí và quy mô của các khu vực cần khảo sát.",

    objectPosition:
      "62% center",
  },

  {
    image:
      "/images/readymag/memory/nguyen-xuan-thang.jpg",

    alt:
      "Nguyễn Xuân Thắng phân tích tư liệu",

    side:
      "right",

    type:
      "quote",

    content:
      "Từ ba bức ảnh tư liệu, chúng tôi phân tích các chi tiết hiện trường, đối chiếu dữ liệu EXIF và những dấu hiệu còn lại để thu hẹp phạm vi khảo sát.",

    source:
      "Nguyễn Xuân Thắng",

    objectPosition:
      "36% center",
  },
];


export default function MemoryScrollSection() {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const stepRefs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >([]);

  useEffect(() => {
    const observers =
      stepRefs.current.map(
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
                  "-28% 0px -44% 0px",
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

  const currentStory =
    STORIES[activeIndex] ??
    STORIES[0];

  return (
    <section
      id="memory"
      className={
        styles.section
      }
    >
      {/* ===================================================
          SUBTITLE PLACEHOLDER
      ==================================================== */}

      <SubtitleImage
        alt="Lần theo dấu vết ký ức"
        imagePath="/images/readymag/subtitles/memory.png"
        maxWidth={1050}
      />

      {/* ===================================================
          INTRO
      ==================================================== */}

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
            T
          </span>

          rong nhiều cuộc tìm kiếm, ký ức của nhân chứng là
          một trong những nguồn thông tin quan trọng giúp thu
          hẹp phạm vi khảo sát. Đó có thể là lời kể của người
          từng chứng kiến trận đánh, người dân sống gần khu vực
          chiến trường hoặc những người từng tham gia chôn cất,
          di chuyển hài cốt trong chiến tranh.
        </p>
      </div>

      {/* ===================================================
          SCROLL
      ==================================================== */}

      <div
        className={
          styles.scrolly
        }
      >
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
                className={[
                  styles.imageLayer,

                  story.side ===
                  "left"
                    ? styles.imageRight
                    : styles.imageLeft,

                  activeIndex ===
                  index
                    ? styles.imageLayerActive
                    : "",
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " "
                  )}
              >
                <img
                  src={
                    story.image
                  }
                  alt={
                    story.alt
                  }
                  draggable={
                    false
                  }
                  className={
                    styles.image
                  }
                  style={{
                    objectPosition:
                      story.objectPosition ??
                      "center",
                  }}
                />
              </div>
            )
          )}

          <div
            className={[
              styles.greenPanel,

              currentStory.side ===
              "left"
                ? styles.greenPanelLeft
                : styles.greenPanelRight,
            ].join(
              " "
            )}
            aria-hidden="true"
          />

          {currentStory.caption && (
            <p
              className={[
                styles.caption,

                currentStory.side ===
                "left"
                  ? styles.captionRight
                  : styles.captionLeft,
              ].join(
                " "
              )}
            >
              {
                currentStory.caption
              }
            </p>
          )}
        </div>

        <div
          className={
            styles.steps
          }
        >
          <div
            className={
              styles.leadSpace
            }
            aria-hidden="true"
          />

          {STORIES.map(
            (
              story,
              index
            ) => (
              <div
                key={
                  `${story.image}-${index}`
                }
                ref={(
                  node
                ) => {
                  stepRefs.current[
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
                  className={[
                    styles.copy,

                    story.type ===
                    "quote"
                      ? styles.quoteCopy
                      : styles.textCopy,
                  ].join(
                    " "
                  )}
                >
                  {story.type ===
                  "text" ? (
                    <p>
                      {
                        story.content
                      }
                    </p>
                  ) : (
                    <>
                      <blockquote>
                        “
                        {
                          story.content
                        }
                        ”
                      </blockquote>

                      {story.source && (
                        <span
                          className={
                            styles.source
                          }
                        >
                          —{" "}
                          {
                            story.source
                          }
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          )}

          <div
            className={
              styles.tailSpace
            }
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}