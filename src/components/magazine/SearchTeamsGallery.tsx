"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useRef,
} from "react";

import SubtitleImage from "./SubtitleImage";

import styles from "./SearchTeamsGallery.module.css";


type GalleryItem = {
  src: string;
  alt: string;
};


const IMAGES: GalleryItem[] = [
  {
    src:
      "/images/readymag/teams/team-1.jpg",

    alt:
      "Hình ảnh đội tìm kiếm 1",
  },

  {
    src:
      "/images/readymag/teams/team-2.jpg",

    alt:
      "Hình ảnh đội tìm kiếm 2",
  },

  {
    src:
      "/images/readymag/teams/team-3.jpg",

    alt:
      "Hình ảnh đội tìm kiếm 3",
  },

  {
    src:
      "/images/readymag/teams/team-4.jpg",

    alt:
      "Hình ảnh đội tìm kiếm 4",
  },

  {
    src:
      "/images/readymag/teams/team-5.jpg",

    alt:
      "Hình ảnh đội tìm kiếm 5",
  },
];


export default function SearchTeamsGallery() {
  const sectionRef =
    useRef<
      HTMLElement | null
    >(
      null
    );

  const galleryWindowRef =
    useRef<
      HTMLDivElement | null
    >(
      null
    );

  const trackRef =
    useRef<
      HTMLDivElement | null
    >(
      null
    );

  const frameRef =
    useRef<
      number | null
    >(
      null
    );

  useEffect(() => {
    function updateGallery() {
      frameRef.current =
        null;

      const section =
        sectionRef.current;

      const galleryWindow =
        galleryWindowRef.current;

      const track =
        trackRef.current;

      if (
        !section ||
        !galleryWindow ||
        !track
      ) {
        return;
      }

      const rect =
        section.getBoundingClientRect();

      const scrollDistance =
        section.offsetHeight -
        window.innerHeight;

      if (
        scrollDistance <=
        0
      ) {
        track.style.transform =
          "translate3d(0px,0px,0px)";

        return;
      }

      const progress =
        Math.min(
          1,
          Math.max(
            0,
            -rect.top /
              scrollDistance
          )
        );

      const maxTranslate =
        Math.max(
          0,
          track.scrollWidth -
            galleryWindow.clientWidth
        );

      track.style.transform =
        `translate3d(-${
          progress *
          maxTranslate
        }px,0,0)`;
    }

    function requestUpdate() {
      if (
        frameRef.current !==
        null
      ) {
        return;
      }

      frameRef.current =
        requestAnimationFrame(
          updateGallery
        );
    }

    updateGallery();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      requestUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate
      );

      window.removeEventListener(
        "resize",
        requestUpdate
      );

      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, []);

  return (
    <>
      {/* ===================================================
          SUBTITLE
      ==================================================== */}

      <SubtitleImage
        alt="Những đội tìm kiếm giữa thời bình"
        imagePath="/images/readymag/subtitles/search-teams.png"
        maxWidth={1050}
      />

      {/* ===================================================
          GALLERY
      ==================================================== */}

      <section
        ref={
          sectionRef
        }
        id="search-teams"
        className={
          styles.section
        }
      >
        <div
          className={
            styles.stickyViewport
          }
        >
          <div
            ref={
              galleryWindowRef
            }
            className={
              styles.galleryWindow
            }
          >
            <div
              ref={
                trackRef
              }
              className={
                styles.track
              }
            >
              {IMAGES.map(
                (
                  item,
                  index
                ) => (
                  <figure
                    key={
                      item.src
                    }
                    className={
                      styles.slide
                    }
                  >
                    <div
                      className={
                        styles.imageContainer
                      }
                    >
                      <img
                        src={
                          item.src
                        }
                        alt={
                          item.alt
                        }
                        loading="lazy"
                        draggable={
                          false
                        }
                        className={
                          styles.image
                        }
                      />

                      <span
                        className={
                          styles.index
                        }
                      >
                        {String(
                          index +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>
                  </figure>
                )
              )}
            </div>
          </div>

          <p
            className={
              styles.galleryCaption
            }
          >
            Các cán bộ, chiến sĩ và nhân viên chuyên môn
            thực hiện nhiệm vụ tìm kiếm, quy tập các hài
            cốt liệt sĩ.
          </p>
        </div>
      </section>

      {/* FLOWER */}

      <div
        className={
          styles.flowerSpacer
        }
        aria-hidden="true"
      >
        <img
          src="/images/readymag/decor/chrysanthemum.png"
          alt=""
          draggable={
            false
          }
          className={
            styles.flower
          }
        />
      </div>
    </>
  );
}