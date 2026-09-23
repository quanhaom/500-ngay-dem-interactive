"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  FeatureCollection,
  Geometry,
} from "geojson";

import styles from "./MagazineExperience.module.css";

/* =========================================================
   CONSTANTS
========================================================= */

const TRACE_COUNT = 500;

const FINAL_PARTICLE_COUNT =
  1863;

/*
  Bounds mainland Việt Nam dùng cho visual.

  Không dùng như dữ liệu địa lý chính xác
  cho marker/tọa độ thực tế.
*/

const MAINLAND_BOUNDS = {
  minLng: 102,
  maxLng: 110.8,

  minLat: 8,
  maxLat: 23.6,
};

/* =========================================================
   TYPES
========================================================= */

type Point = {
  x: number;
  y: number;
};

type HeroData = {
  traces: Point[];
  number500: Point[];
  finalField: Point[];
};

/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value: number,
  min = 0,
  max = 1
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}

function phase(
  value: number,
  start: number,
  end: number
) {
  return clamp(
    (value - start) /
      (end - start)
  );
}

/*
  Deterministic PRNG.

  Không dùng Math.random() khi tạo
  layout để tránh hydration mismatch.
*/

function seededRandom(
  seed: number
) {
  let value =
    (
      seed +
      0x6d2b79f5
    ) |
    0;

  value =
    Math.imul(
      value ^
        (value >>> 15),
      value | 1
    );

  value ^=
    value +
    Math.imul(
      value ^
        (value >>> 7),
      value | 61
    );

  return (
    (
      value ^
      (value >>> 14)
    ) >>>
    0
  ) /
    4294967296;
}

/* =========================================================
   EASING
========================================================= */

function easeInOutCubic(
  value: number
) {
  const t =
    clamp(value);

  return t < 0.5
    ? 4 *
        t *
        t *
        t
    : 1 -
        Math.pow(
          -2 * t + 2,
          3
        ) /
          2;
}

/* =========================================================
   GEOJSON RING EXTRACTION
========================================================= */

function collectCoordinates(
  geometry: Geometry,
  output: number[][][]
) {
  if (
    geometry.type ===
    "Polygon"
  ) {
    for (
      const ring of geometry.coordinates
    ) {
      output.push(
        ring as number[][]
      );
    }

    return;
  }

  if (
    geometry.type ===
    "MultiPolygon"
  ) {
    for (
      const polygon of geometry.coordinates
    ) {
      for (
        const ring of polygon
      ) {
        output.push(
          ring as number[][]
        );
      }
    }

    return;
  }

  if (
    geometry.type ===
    "GeometryCollection"
  ) {
    for (
      const child of geometry.geometries
    ) {
      collectCoordinates(
        child,
        output
      );
    }
  }
}

/* =========================================================
   PROJECT GEO COORDINATE
========================================================= */

function projectLngLat(
  lng: number,
  lat: number
): Point {
  const x =
    (
      lng -
      MAINLAND_BOUNDS.minLng
    ) /
    (
      MAINLAND_BOUNDS.maxLng -
      MAINLAND_BOUNDS.minLng
    );

  const y =
    1 -
    (
      lat -
      MAINLAND_BOUNDS.minLat
    ) /
    (
      MAINLAND_BOUNDS.maxLat -
      MAINLAND_BOUNDS.minLat
    );

  return {
    x,
    y,
  };
}

/* =========================================================
   BUILD TRACE POINTS
========================================================= */

function buildTracePoints(
  rings: number[][][]
) {
  const candidates:
    Point[] = [];

  for (
    const ring of rings
  ) {
    for (
      let i = 0;
      i < ring.length;
      i += 3
    ) {
      const coordinate =
        ring[i];

      if (
        !coordinate ||
        coordinate.length < 2
      ) {
        continue;
      }

      const lng =
        coordinate[0];

      const lat =
        coordinate[1];

      if (
        lng <
          MAINLAND_BOUNDS.minLng ||
        lng >
          MAINLAND_BOUNDS.maxLng ||
        lat <
          MAINLAND_BOUNDS.minLat ||
        lat >
          MAINLAND_BOUNDS.maxLat
      ) {
        continue;
      }

      candidates.push(
        projectLngLat(
          lng,
          lat
        )
      );
    }
  }

  if (
    candidates.length === 0
  ) {
    return Array.from(
      {
        length:
          TRACE_COUNT,
      },
      (_, index) => ({
        x:
          0.35 +
          seededRandom(
            index * 7 + 5
          ) *
            0.3,

        y:
          0.08 +
          seededRandom(
            index * 11 + 9
          ) *
            0.84,
      })
    );
  }

  return Array.from(
    {
      length:
        TRACE_COUNT,
    },
    (_, index) => {
      const source =
        candidates[
          Math.floor(
            (
              index /
              TRACE_COUNT
            ) *
              candidates.length
          ) %
            candidates.length
        ];

      const jitterX =
        (
          seededRandom(
            index * 17 + 3
          ) -
          0.5
        ) *
        0.012;

      const jitterY =
        (
          seededRandom(
            index * 23 + 8
          ) -
          0.5
        ) *
        0.012;

      return {
        x:
          source.x +
          jitterX,

        y:
          source.y +
          jitterY,
      };
    }
  );
}

/* =========================================================
   BUILD 500 TARGET FROM OFFSCREEN CANVAS
========================================================= */

function build500Target() {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1200;
  canvas.height = 600;

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    return [];
  }

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillStyle =
    "#ffffff";

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  context.font =
    "800 430px Arial";

  context.fillText(
    "500",
    canvas.width / 2,
    canvas.height / 2
  );

  const image =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

  const candidates:
    Point[] = [];

  const step = 7;

  for (
    let y = 0;
    y < canvas.height;
    y += step
  ) {
    for (
      let x = 0;
      x < canvas.width;
      x += step
    ) {
      const alpha =
        image.data[
          (
            y *
              canvas.width +
            x
          ) *
            4 +
          3
        ];

      if (
        alpha > 120
      ) {
        candidates.push({
          x:
            x /
            canvas.width,

          y:
            y /
            canvas.height,
        });
      }
    }
  }

  if (
    candidates.length === 0
  ) {
    return [];
  }

  return Array.from(
    {
      length:
        TRACE_COUNT,
    },
    (_, index) => {
      const source =
        candidates[
          Math.floor(
            seededRandom(
              index * 31 + 5
            ) *
              candidates.length
          )
        ];

      return {
        x:
          0.08 +
          source.x *
            0.84,

        y:
          0.16 +
          source.y *
            0.68,
      };
    }
  );
}

/* =========================================================
   FINAL 1.863 FIELD
========================================================= */

function buildFinalField() {
  return Array.from(
    {
      length:
        FINAL_PARTICLE_COUNT,
    },
    (_, index) => {
      const angle =
        seededRandom(
          index * 47 + 3
        ) *
        Math.PI *
        2;

      const radius =
        Math.sqrt(
          seededRandom(
            index * 61 + 9
          )
        );

      /*
        Elliptical field:
        particles disperse across viewport.
      */

      const x =
        0.5 +
        Math.cos(
          angle
        ) *
          radius *
          0.58;

      const y =
        0.5 +
        Math.sin(
          angle
        ) *
          radius *
          0.44;

      return {
        x,
        y,
      };
    }
  );
}

/* =========================================================
   LERP
========================================================= */

function lerp(
  a: number,
  b: number,
  amount: number
) {
  return (
    a +
    (b - a) *
      amount
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OpeningHero() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const beamRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const coordinateRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const openingRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const dayRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const dayNumberRef =
    useRef<HTMLElement | null>(
      null
    );

  const stageWordRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const title500Ref =
    useRef<HTMLDivElement | null>(
      null
    );

  const finalStatRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const finalNumberRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const scrollCueRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const heroDataRef =
    useRef<HeroData>({
      traces: [],
      number500: [],
      finalField: [],
    });

  const progressRef =
    useRef(0);

  const pointerRef =
    useRef({
      x: 0.5,
      y: 0.5,
    });

  const [
    ready,
    setReady,
  ] = useState(false);

  /* =======================================================
     BUILD HERO DATA
  ======================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function build() {
      try {
        const response =
          await fetch(
            "/data/map/vietnam-provinces.geojson"
          );

        const geojson =
          (
            await response.json()
          ) as FeatureCollection<
            Geometry
          >;

        const rings:
          number[][][] = [];

        for (
          const feature of geojson.features
        ) {
          if (
            feature.geometry
          ) {
            collectCoordinates(
              feature.geometry,
              rings
            );
          }
        }

        if (cancelled) {
          return;
        }

        heroDataRef.current =
          {
            traces:
              buildTracePoints(
                rings
              ),

            number500:
              build500Target(),

            finalField:
              buildFinalField(),
          };

        setReady(true);
      } catch (
        error
      ) {
        console.error(
          "Opening hero data error:",
          error
        );

        heroDataRef.current =
          {
            traces:
              buildTracePoints(
                []
              ),

            number500:
              build500Target(),

            finalField:
              buildFinalField(),
          };

        setReady(true);
      }
    }

    build();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     POINTER SEARCHLIGHT
  ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    function updatePointer(
      clientX: number,
      clientY: number
    ) {
      const x =
        clamp(
          clientX /
            window.innerWidth
        );

      const y =
        clamp(
          clientY /
            window.innerHeight
        );

      pointerRef.current =
        {
          x,
          y,
        };

      if (
        beamRef.current
      ) {
        beamRef.current.style.setProperty(
          "--beam-x",
          `${clientX}px`
        );

        beamRef.current.style.setProperty(
          "--beam-y",
          `${clientY}px`
        );
      }

      if (
        coordinateRef.current
      ) {
        /*
          Visual mapping only.
          Không phải tọa độ marker thực.
        */

        const lng =
          lerp(
            MAINLAND_BOUNDS.minLng,
            MAINLAND_BOUNDS.maxLng,
            x
          );

        const lat =
          lerp(
            MAINLAND_BOUNDS.maxLat,
            MAINLAND_BOUNDS.minLat,
            y
          );

        coordinateRef.current.textContent =
          `${lat.toFixed(
            3
          )}° N / ${lng.toFixed(
            3
          )}° E`;
      }
    }

    function handlePointerMove(
      event: PointerEvent
    ) {
      updatePointer(
        event.clientX,
        event.clientY
      );
    }

    section.addEventListener(
      "pointermove",
      handlePointerMove
    );

    return () => {
      section.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  /* =======================================================
     SCROLL UI
  ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    let frame = 0;

    function update() {
      cancelAnimationFrame(
        frame
      );

      frame =
        requestAnimationFrame(
          () => {
            const rect =
              section.getBoundingClientRect();

            const travel =
              Math.max(
                section.offsetHeight -
                  window.innerHeight,
                1
              );

            const progress =
              clamp(
                -rect.top /
                  travel
              );

            progressRef.current =
              progress;

            /* ===========================================
               OPENING STATEMENT

               Hiện ở đầu.
               Fade sớm.
               Biến mất HOÀN TOÀN trước DAY 500 / visual 500.
            ============================================ */

            const openingFade =
              phase(
                progress,
                0.20,
                0.36
              );

            if (
              openingRef.current
            ) {
              const opacity =
                1 -
                openingFade;

              openingRef.current.style.opacity =
                String(
                  opacity
                );

              openingRef.current.style.transform =
                `
                  translate(
                    -50%,
                    calc(
                      -50% -
                      ${
                        openingFade *
                        22
                      }px
                    )
                  )
                `;

              openingRef.current.style.visibility =
                opacity <
                0.01
                  ? "hidden"
                  : "visible";
            }

            /* ===========================================
               DAY 001 → DAY 500
            ============================================ */

            const dayProgress =
              phase(
                progress,
                0.07,
                0.49
              );

            const day =
              Math.max(
                1,
                Math.min(
                  500,
                  Math.round(
                    1 +
                    dayProgress *
                      499
                  )
                )
              );

            if (
              dayNumberRef.current
            ) {
              dayNumberRef.current.textContent =
                String(
                  day
                ).padStart(
                  3,
                  "0"
                );
            }

            if (
              dayRef.current
            ) {
              const fadeIn =
                phase(
                  progress,
                  0.045,
                  0.1
                );

              const fadeOut =
                phase(
                  progress,
                  0.46,
                  0.53
                );

              dayRef.current.style.opacity =
                String(
                  fadeIn *
                    (
                      1 -
                      fadeOut
                    )
                );
            }

            /* ===========================================
               SEARCH PHASE WORD
            ============================================ */

            if (
              stageWordRef.current
            ) {
              let word =
                "TÌM KIẾM";

              if (
                dayProgress >
                0.38
              ) {
                word =
                  "QUY TẬP";
              }

              if (
                dayProgress >
                0.74
              ) {
                word =
                  "DANH TÍNH";
              }

              stageWordRef.current.textContent =
                word;

              stageWordRef.current.style.opacity =
                String(
                  phase(
                    progress,
                    0.06,
                    0.13
                  ) *
                    (
                      1 -
                      phase(
                        progress,
                        0.47,
                        0.54
                      )
                    )
                );
            }

            /* ===========================================
               500 TITLE
            ============================================ */

            const title500In =
              phase(
                progress,
                0.50,
                0.60
              );

            const title500Out =
              phase(
                progress,
                0.68,
                0.76
              );

            if (
              title500Ref.current
            ) {
              const opacity =
                title500In *
                (
                  1 -
                  title500Out
                );

              title500Ref.current.style.opacity =
                String(
                  opacity
                );

              title500Ref.current.style.transform =
                `
                  translate(
                    -50%,
                    ${
                      30 -
                      title500In *
                        30
                    }px
                  )
                `;
            }

            /* ===========================================
               FINAL 1.863
            ============================================ */

            const finalIn =
              phase(
                progress,
                0.76,
                0.89
              );

            if (
              finalStatRef.current
            ) {
              finalStatRef.current.style.opacity =
                String(
                  finalIn
                );

              finalStatRef.current.style.transform =
                `
                  translate(
                    -50%,
                    ${
                      30 -
                      finalIn *
                        30
                    }px
                  )
                `;
            }

            if (
              finalNumberRef.current
            ) {
              const displayed =
                Math.round(
                  lerp(
                    500,
                    1863,
                    finalIn
                  )
                );

              const formattedFinalNumber =
                displayed >= 1000
                  ? `${Math.floor(
                      displayed / 1000
                    )}\u2009.\u2009${String(
                      displayed % 1000
                    ).padStart(
                      3,
                      "0"
                    )}`
                  : String(
                      displayed
                    );

              finalNumberRef.current.textContent =
                formattedFinalNumber;
            }

            /* ===========================================
               SEARCHLIGHT VISIBILITY
            ============================================ */

            if (
              beamRef.current
            ) {
              beamRef.current.style.opacity =
                String(
                  1 -
                  phase(
                    progress,
                    0.36,
                    0.52
                  )
                );
            }

            if (
              coordinateRef.current
            ) {
              coordinateRef.current.style.opacity =
                String(
                  1 -
                  phase(
                    progress,
                    0.34,
                    0.48
                  )
                );
            }

            /* ===========================================
               SCROLL CUE
            ============================================ */

            if (
              scrollCueRef.current
            ) {
              scrollCueRef.current.style.opacity =
                String(
                  1 -
                  phase(
                    progress,
                    0.05,
                    0.14
                  )
                );
            }
          }
        );
    }

    update();

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        "scroll",
        update
      );

      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  /* =======================================================
     CANVAS RENDER LOOP
  ======================================================= */

  useEffect(() => {
    if (!ready) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext(
        "2d"
      );

    if (!context) {
      return;
    }

    let animationFrame =
      0;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      width =
        window.innerWidth;

      height =
        window.innerHeight;

      dpr =
        Math.min(
          window.devicePixelRatio ||
            1,
          2
        );

      canvas.width =
        Math.round(
          width *
            dpr
        );

      canvas.height =
        Math.round(
          height *
            dpr
        );

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    }

    resize();

    function render(
      time: number
    ) {
      const {
        traces,
        number500,
        finalField,
      } =
        heroDataRef.current;

      const progress =
        progressRef.current;

      context.clearRect(
        0,
        0,
        width,
        height
      );

      const mapPhase =
        phase(
          progress,
          0.055,
          0.48
        );

      const morph500 =
        easeInOutCubic(
          phase(
            progress,
            0.49,
            0.67
          )
        );

      const dissolve =
        easeInOutCubic(
          phase(
            progress,
            0.70,
            0.90
          )
        );

      const mapWidth =
        Math.min(
          width *
            0.43,
          470
        );

      const mapHeight =
        Math.min(
          height *
            0.74,
          720
        );

      const mapLeft =
        width *
          0.5 -
        mapWidth /
          2;

      const mapTop =
        height *
          0.5 -
        mapHeight /
          2;

      const pointer =
        pointerRef.current;

      /* ===============================================
         TRACE PARTICLES
      ================================================ */

      for (
        let i = 0;
        i < TRACE_COUNT;
        i++
      ) {
        const source =
          traces[i];

        if (!source) {
          continue;
        }

        const target500 =
          number500[i] ||
          source;

        const targetFinal =
          finalField[i] ||
          target500;

        /*
          Initial search trace.
        */

        const initialX =
          mapLeft +
          source.x *
            mapWidth;

        const initialY =
          mapTop +
          source.y *
            mapHeight;

        /*
          500 position.
        */

        const numberX =
          target500.x *
          width;

        const numberY =
          target500.y *
          height;

        /*
          Final dispersed field.
        */

        const finalX =
          targetFinal.x *
          width;

        const finalY =
          targetFinal.y *
          height;

        let x =
          lerp(
            initialX,
            numberX,
            morph500
          );

        let y =
          lerp(
            initialY,
            numberY,
            morph500
          );

        x =
          lerp(
            x,
            finalX,
            dissolve
          );

        y =
          lerp(
            y,
            finalY,
            dissolve
          );

        const revealIndex =
          i /
          TRACE_COUNT;

        const reveal =
          clamp(
            (
              mapPhase -
              revealIndex *
                0.78
            ) *
              5
          );

        const pulse =
          0.82 +
          Math.sin(
            time *
              0.0013 +
              i *
                0.71
          ) *
            0.18;

        let alpha =
          reveal *
          pulse;

        alpha =
          lerp(
            alpha,
            0.75,
            morph500
          );

        alpha =
          lerp(
            alpha,
            0.25,
            dissolve
          );

        /*
          Searchlight emphasis.
        */

        const dx =
          x -
          pointer.x *
            width;

        const dy =
          y -
          pointer.y *
            height;

        const distance =
          Math.sqrt(
            dx * dx +
              dy * dy
          );

        const searchBoost =
          1 -
          clamp(
            distance /
              180
          );

        alpha +=
          searchBoost *
          (
            1 -
            morph500
          ) *
          0.8;

        const radius =
          lerp(
            1.1,
            1.8,
            morph500
          );

        context.beginPath();

        context.arc(
          x,
          y,
          radius,
          0,
          Math.PI *
            2
        );

        context.fillStyle =
          `rgba(
            169,
            199,
            178,
            ${clamp(
              alpha
            )}
          )`;

        context.fill();
      }

      /* ===============================================
         EXTRA PARTICLES AFTER 500 → 1863
      ================================================ */

      const extraReveal =
        dissolve;

      if (
        extraReveal >
        0
      ) {
        for (
          let i =
            TRACE_COUNT;
          i <
          FINAL_PARTICLE_COUNT;
          i++
        ) {
          const point =
            finalField[i];

          if (!point) {
            continue;
          }

          const threshold =
            (
              i -
              TRACE_COUNT
            ) /
            (
              FINAL_PARTICLE_COUNT -
              TRACE_COUNT
            );

          const reveal =
            clamp(
              (
                extraReveal -
                threshold *
                  0.55
              ) *
                4
            );

          if (
            reveal <=
            0
          ) {
            continue;
          }

          const x =
            point.x *
            width;

          const y =
            point.y *
            height;

          const pulse =
            0.65 +
            Math.sin(
              time *
                0.001 +
                i *
                  0.42
            ) *
              0.2;

          context.beginPath();

          context.arc(
            x,
            y,
            1.1,
            0,
            Math.PI *
              2
          );

          context.fillStyle =
            `rgba(
              158,
              190,
              168,
              ${
                reveal *
                pulse *
                0.55
              }
            )`;

          context.fill();
        }
      }

      animationFrame =
        requestAnimationFrame(
          render
        );
    }

    animationFrame =
      requestAnimationFrame(
        render
      );

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [
    ready,
  ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="opening"
      ref={sectionRef}
      className={
        styles.heroScene
      }
    >
      <div
        className={
          styles.heroSticky
        }
      >
        {/* ===============================================
            PARTICLE CANVAS
        ================================================ */}

        <canvas
          ref={canvasRef}
          className={
            styles.heroCanvas
          }
          aria-hidden="true"
        />

        {/* ===============================================
            SEARCHLIGHT
        ================================================ */}

        <div
          ref={beamRef}
          className={
            styles.heroSearchBeam
          }
          aria-hidden="true"
        />

        {/* ===============================================
            FILM / ATMOSPHERE
        ================================================ */}

        <div
          className={
            styles.heroNoise
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroVignette
          }
          aria-hidden="true"
        />

        {/* ===============================================
            TOP CHROME
        ================================================ */}

        <div
          className={
            styles.heroChrome
          }
        >
          <span>
            HỒ SƠ ĐẶC BIỆT
          </span>

          <span>
            TÌM KIẾM · QUY TẬP · DANH TÍNH
          </span>

          <span>
            2026
          </span>
        </div>

        {/* ===============================================
            OPENING STATEMENT

            Fade hoàn toàn trước visual 500.
        ================================================ */}

        <div
          ref={openingRef}
          className={
            styles.heroOpeningStatement
          }
        >
          <span>
            CUỘC TÌM KIẾM BẮT ĐẦU TỪ
          </span>

          <strong>
            một tọa độ.
          </strong>
        </div>

        {/* ===============================================
            COORDINATE
        ================================================ */}

        <div
          ref={coordinateRef}
          className={
            styles.heroCoordinate
          }
        >
          21.028° N / 105.834° E
        </div>

        {/* ===============================================
            DAY
        ================================================ */}

        <div
          ref={dayRef}
          className={
            styles.heroDayCounter
          }
        >
          <span>
            DAY
          </span>

          <strong
            ref={
              dayNumberRef
            }
          >
            001
          </strong>
        </div>

        {/* ===============================================
            STAGE WORD
        ================================================ */}

        <div
          ref={stageWordRef}
          className={
            styles.heroStageWord
          }
          aria-hidden="true"
        >
          TÌM KIẾM
        </div>

        {/* ===============================================
            500
        ================================================ */}

        <div
          ref={title500Ref}
          className={
            styles.hero500Title
          }
        >
          <span
            aria-hidden="true"
          >
            500
          </span>

          <strong>
            500 NGÀY ĐÊM
          </strong>

          <p>
            Một hành trình tìm kiếm,
            quy tập và từng bước
            đưa những người đã nằm
            lại trở về.
          </p>
        </div>

        {/* ===============================================
            1.863
        ================================================ */}

        <div
          ref={finalStatRef}
          className={
            styles.heroFinalStat
          }
        >
          <p>
            SAU 500 NGÀY ĐÊM
          </p>

          <span
            ref={
              finalNumberRef
            }
          >
            500
          </span>

          <strong>
            HÀI CỐT LIỆT SĨ
          </strong>

          <small>
            đã được tìm kiếm,
            quy tập
          </small>

          <i>
            DỮ LIỆU THEO MỐC 22.08.2026
          </i>
        </div>

        {/* ===============================================
            SCROLL
        ================================================ */}

        <div
          ref={scrollCueRef}
          className={
            styles.scrollCue
          }
        >
          <span>
            CUỘN ĐỂ ĐI QUA
            500 NGÀY ĐÊM
          </span>

          <i />

          <small>
            SCROLL
          </small>
        </div>
      </div>
    </section>
  );
}