"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  FeatureCollection,
  Geometry,
} from "geojson";

import styles from "./MagazineExperience.module.css";

/* =========================================================
   TYPES
========================================================= */

type Point = {
  x: number;
  y: number;
};

type LonLat = [
  number,
  number,
];

type Ring =
  LonLat[];

type CanvasData = {
  mapSegments: Point[][];
  traces: Point[];
  textTargets: Point[];
  field: Point[];
};

/* =========================================================
   CONSTANTS
========================================================= */

const TRACE_COUNT =
  500;

const FINAL_PARTICLE_COUNT =
  1863;

const MAINLAND_BOUNDS = {
  minLng: 102,
  maxLng: 110.8,

  minLat: 8,
  maxLat: 23.6,
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
  progress: number,
  start: number,
  end: number
) {
  if (
    end === start
  ) {
    return 0;
  }

  return clamp(
    (progress -
      start) /
      (end -
        start)
  );
}

function lerp(
  from: number,
  to: number,
  progress: number
) {
  return (
    from +
    (
      to -
      from
    ) *
      progress
  );
}

/* =========================================================
   DETERMINISTIC SEEDED RANDOM
========================================================= */

function seededRandom(
  seed: number
) {
  let value =
    (seed +
      0x6d2b79f5) |
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

function collectRings(
  geometry: Geometry
): Ring[] {
  if (
    geometry.type ===
    "Polygon"
  ) {
    return geometry.coordinates.map(
      (ring) =>
        ring as Ring
    );
  }

  if (
    geometry.type ===
    "MultiPolygon"
  ) {
    return geometry.coordinates.flatMap(
      (polygon) =>
        polygon.map(
          (ring) =>
            ring as Ring
        )
    );
  }

  if (
    geometry.type ===
    "GeometryCollection"
  ) {
    return geometry.geometries.flatMap(
      collectRings
    );
  }

  return [];
}

function projectPoint(
  lng: number,
  lat: number,
  width: number,
  height: number
): Point {
  const boundsWidth =
    MAINLAND_BOUNDS.maxLng -
    MAINLAND_BOUNDS.minLng;

  const boundsHeight =
    MAINLAND_BOUNDS.maxLat -
    MAINLAND_BOUNDS.minLat;

  const normalizedX =
    (
      lng -
      MAINLAND_BOUNDS.minLng
    ) /
    boundsWidth;

  const normalizedY =
    (
      MAINLAND_BOUNDS.maxLat -
      lat
    ) /
    boundsHeight;

  const availableHeight =
    height *
    0.76;

  const availableWidth =
    width *
    0.44;

  const mapAspect =
    boundsWidth /
    boundsHeight;

  let renderWidth =
    availableWidth;

  let renderHeight =
    renderWidth /
    mapAspect;

  if (
    renderHeight >
    availableHeight
  ) {
    renderHeight =
      availableHeight;

    renderWidth =
      renderHeight *
      mapAspect;
  }

  const left =
    width /
      2 -
    renderWidth /
      2;

  const top =
    height /
      2 -
    renderHeight /
      2;

  return {
    x:
      left +
      normalizedX *
        renderWidth,

    y:
      top +
      normalizedY *
        renderHeight,
  };
}

function buildMapSegments(
  geoJson:
    FeatureCollection<
      Geometry
    >,
  width: number,
  height: number
) {
  const segments:
    Point[][] = [];

  for (
    const feature of
    geoJson.features
  ) {
    if (
      !feature.geometry
    ) {
      continue;
    }

    const rings =
      collectRings(
        feature.geometry
      );

    for (
      const ring of
      rings
    ) {
      const mainlandPoints =
        ring.filter(
          ([
            lng,
            lat,
          ]) =>
            lng >=
              MAINLAND_BOUNDS.minLng &&
            lng <=
              MAINLAND_BOUNDS.maxLng &&
            lat >=
              MAINLAND_BOUNDS.minLat &&
            lat <=
              MAINLAND_BOUNDS.maxLat
        );

      if (
        mainlandPoints.length <
        3
      ) {
        continue;
      }

      const step =
        Math.max(
          1,
          Math.floor(
            mainlandPoints.length /
              100
          )
        );

      const projected:
        Point[] = [];

      for (
        let index = 0;
        index <
        mainlandPoints.length;
        index += step
      ) {
        const [
          lng,
          lat,
        ] =
          mainlandPoints[
            index
          ];

        projected.push(
          projectPoint(
            lng,
            lat,
            width,
            height
          )
        );
      }

      if (
        projected.length >=
        3
      ) {
        segments.push(
          projected
        );
      }
    }
  }

  return segments;
}

function buildTracePoints(
  segments: Point[][],
  width: number,
  height: number
) {
  const pool =
    segments.flat();

  if (
    pool.length === 0
  ) {
    return Array.from(
      {
        length:
          TRACE_COUNT,
      },
      (_, index) => ({
        x:
          width *
          (
            0.4 +
            seededRandom(
              index +
                20
            ) *
              0.2
          ),

        y:
          height *
          (
            0.18 +
            seededRandom(
              index +
                80
            ) *
              0.64
          ),
      })
    );
  }

  return Array.from(
    {
      length:
        TRACE_COUNT,
    },
    (_, index) => {
      const sourceIndex =
        Math.floor(
          seededRandom(
            index +
              17
          ) *
            pool.length
        );

      const source =
        pool[
          Math.min(
            sourceIndex,
            pool.length -
              1
          )
        ];

      const angle =
        seededRandom(
          index +
            1000
        ) *
        Math.PI *
        2;

      const radius =
        seededRandom(
          index +
            2000
        ) *
        9;

      return {
        x:
          source.x +
          Math.cos(
            angle
          ) *
            radius,

        y:
          source.y +
          Math.sin(
            angle
          ) *
            radius,
      };
    }
  );
}

function buildTextTargets(
  width: number,
  height: number,
  count: number
) {
  const canvas =
    document.createElement(
      "canvas"
    );

  const sampleWidth =
    Math.max(
      500,
      Math.floor(
        width *
          0.58
      )
    );

  const sampleHeight =
    Math.max(
      320,
      Math.floor(
        height *
          0.58
      )
    );

  canvas.width =
    sampleWidth;

  canvas.height =
    sampleHeight;

  const context =
    canvas.getContext(
      "2d",
      {
        willReadFrequently:
          true,
      }
    );

  if (!context) {
    return [];
  }

  context.clearRect(
    0,
    0,
    sampleWidth,
    sampleHeight
  );

  context.fillStyle =
    "#ffffff";

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  const fontSize =
    Math.min(
      sampleWidth *
        0.47,
      sampleHeight *
        0.68
    );

  context.font =
    `800 ${fontSize}px Montserrat, Arial, sans-serif`;

  context.fillText(
    "500",
    sampleWidth /
      2,
    sampleHeight /
      2.03
  );

  const image =
    context.getImageData(
      0,
      0,
      sampleWidth,
      sampleHeight
    );

  const candidates:
    Point[] = [];

  const step =
    5;

  for (
    let y = 0;
    y <
    sampleHeight;
    y += step
  ) {
    for (
      let x = 0;
      x <
      sampleWidth;
      x += step
    ) {
      const pixelIndex =
        (
          y *
            sampleWidth +
          x
        ) *
        4;

      if (
        image.data[
          pixelIndex +
            3
        ] >
        120
      ) {
        candidates.push({
          x:
            x *
            (
              width /
              sampleWidth
            ),

          y:
            y *
            (
              height /
              sampleHeight
            ),
        });
      }
    }
  }

  if (
    candidates.length ===
    0
  ) {
    return [];
  }

  return Array.from(
    {
      length:
        count,
    },
    (_, index) => {
      const candidateIndex =
        Math.floor(
          (
            index /
            count
          ) *
            candidates.length
        );

      return candidates[
        Math.min(
          candidateIndex,
          candidates.length -
            1
        )
      ];
    }
  );
}

function buildFieldPoints(
  width: number,
  height: number
) {
  return Array.from(
    {
      length:
        FINAL_PARTICLE_COUNT,
    },
    (_, index) => {
      const randomX =
        seededRandom(
          index +
            4000
        );

      const randomY =
        seededRandom(
          index +
            8000
        );

      return {
        x:
          width *
          (
            0.08 +
            randomX *
              0.84
          ),

        y:
          height *
          (
            0.13 +
            randomY *
              0.74
          ),
      };
    }
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

  const spotlightRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const coordinateRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const dayRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const stageWordRef =
    useRef<HTMLSpanElement | null>(
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

  const progressRef =
    useRef(0);

  const geoJsonRef =
    useRef<
      FeatureCollection<
        Geometry
      > | null
    >(null);

  const canvasDataRef =
    useRef<CanvasData>({
      mapSegments: [],
      traces: [],
      textTargets: [],
      field: [],
    });

  /* =======================================================
     CANVAS DATA
  ======================================================= */

  useEffect(() => {
    let disposed =
      false;

    function rebuildCanvasData() {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      const dpr =
        Math.min(
          window.devicePixelRatio ||
            1,
          1.5
        );

      canvas.width =
        Math.floor(
          width *
            dpr
        );

      canvas.height =
        Math.floor(
          height *
            dpr
        );

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      const context =
        canvas.getContext(
          "2d"
        );

      if (context) {
        context.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );
      }

      const mapSegments =
        geoJsonRef.current
          ? buildMapSegments(
              geoJsonRef.current,
              width,
              height
            )
          : [];

      canvasDataRef.current =
        {
          mapSegments,

          traces:
            buildTracePoints(
              mapSegments,
              width,
              height
            ),

          textTargets:
            buildTextTargets(
              width,
              height,
              TRACE_COUNT
            ),

          field:
            buildFieldPoints(
              width,
              height
            ),
        };
    }

    async function loadGeoJson() {
      try {
        const response =
          await fetch(
            "/data/map/vietnam-provinces.geojson"
          );

        if (
          !response.ok
        ) {
          return;
        }

        const geoJson =
          (await response.json()) as FeatureCollection<Geometry>;

        if (
          disposed
        ) {
          return;
        }

        geoJsonRef.current =
          geoJson;

        rebuildCanvasData();
      } catch (
        error
      ) {
        console.warn(
          "Opening map silhouette fallback:",
          error
        );
      }
    }

    rebuildCanvasData();
    loadGeoJson();

    if (
      document.fonts
    ) {
      document.fonts.ready.then(
        () => {
          if (
            !disposed
          ) {
            rebuildCanvasData();
          }
        }
      );
    }

    window.addEventListener(
      "resize",
      rebuildCanvasData
    );

    return () => {
      disposed =
        true;

      window.removeEventListener(
        "resize",
        rebuildCanvasData
      );
    };
  }, []);

  /* =======================================================
     POINTER
  ======================================================= */

  useEffect(() => {
    function movePointer(
      event: PointerEvent
    ) {
      const x =
        clamp(
          event.clientX /
            window.innerWidth
        );

      const y =
        clamp(
          event.clientY /
            window.innerHeight
        );

      if (
        spotlightRef.current
      ) {
        spotlightRef.current.style.setProperty(
          "--beam-x",
          `${event.clientX}px`
        );

        spotlightRef.current.style.setProperty(
          "--beam-y",
          `${event.clientY}px`
        );
      }

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

      if (
        coordinateRef.current
      ) {
        coordinateRef.current.textContent =
          `${lat.toFixed(
            3
          )}°N / ${lng.toFixed(
            3
          )}°E`;
      }
    }

    window.addEventListener(
      "pointermove",
      movePointer,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        movePointer
      );
    };
  }, []);

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    let frame =
      0;

    function update() {
      cancelAnimationFrame(
        frame
      );

      frame =
        requestAnimationFrame(
          () => {
            const section =
              sectionRef.current;

            if (!section) {
              return;
            }

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

            const searchProgress =
              phase(
                progress,
                0.07,
                0.49
              );

            const day =
              Math.max(
                1,
                Math.round(
                  searchProgress *
                    500
                )
              );

            if (
              dayRef.current
            ) {
              dayRef.current.textContent =
                String(
                  day
                ).padStart(
                  3,
                  "0"
                );
            }

            if (
              stageWordRef.current
            ) {
              if (
                day <
                280
              ) {
                stageWordRef.current.textContent =
                  "TÌM KIẾM";
              } else if (
                day <
                430
              ) {
                stageWordRef.current.textContent =
                  "QUY TẬP";
              } else {
                stageWordRef.current.textContent =
                  "DANH TÍNH";
              }

              stageWordRef.current.style.opacity =
                String(
                  phase(
                    progress,
                    0.05,
                    0.14
                  ) *
                    (
                      1 -
                      phase(
                        progress,
                        0.58,
                        0.67
                      )
                    )
                );
            }

            if (
              spotlightRef.current
            ) {
              spotlightRef.current.style.opacity =
                String(
                  1 -
                    phase(
                      progress,
                      0.43,
                      0.57
                    )
                );
            }

            if (
              coordinateRef.current
            ) {
              coordinateRef.current.style.opacity =
                String(
                  phase(
                    progress,
                    0,
                    0.06
                  ) *
                    (
                      1 -
                      phase(
                        progress,
                        0.4,
                        0.52
                      )
                    )
                );
            }

            if (
              title500Ref.current
            ) {
              const appear =
                phase(
                  progress,
                  0.58,
                  0.68
                );

              const disappear =
                phase(
                  progress,
                  0.76,
                  0.83
                );

              title500Ref.current.style.opacity =
                String(
                  appear *
                    (
                      1 -
                      disappear
                    )
                );

              title500Ref.current.style.transform =
                `translate3d(-50%, ${
                  (
                    1 -
                    appear
                  ) *
                  30
                }px, 0)`;
            }

            const finalProgress =
              phase(
                progress,
                0.79,
                0.96
              );

            if (
              finalNumberRef.current
            ) {
              const count =
                Math.round(
                  500 +
                    (
                      1863 -
                      500
                    ) *
                      finalProgress
                );

              finalNumberRef.current.textContent =
                count.toLocaleString(
                  "vi-VN"
                );
            }

            if (
              finalStatRef.current
            ) {
              finalStatRef.current.style.opacity =
                String(
                  phase(
                    progress,
                    0.8,
                    0.9
                  )
                );

              finalStatRef.current.style.transform =
                `translate3d(-50%, ${
                  (
                    1 -
                    finalProgress
                  ) *
                  36
                }px, 0)`;
            }

            if (
              scrollCueRef.current
            ) {
              scrollCueRef.current.style.opacity =
                String(
                  1 -
                    phase(
                      progress,
                      0,
                      0.09
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
     CANVAS RENDER
  ======================================================= */

  useEffect(() => {
    let animationFrame =
      0;

    function render(
      time: number
    ) {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        animationFrame =
          requestAnimationFrame(
            render
          );

        return;
      }

      const context =
        canvas.getContext(
          "2d"
        );

      if (!context) {
        return;
      }

      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      const progress =
        progressRef.current;

      const {
        mapSegments,
        traces,
        textTargets,
        field,
      } =
        canvasDataRef.current;

      context.clearRect(
        0,
        0,
        width,
        height
      );

      context.fillStyle =
        "#050806";

      context.fillRect(
        0,
        0,
        width,
        height
      );

      /* DAY / NIGHT */

      const dayProgress =
        phase(
          progress,
          0.07,
          0.49
        );

      const cycle =
        (
          Math.sin(
            dayProgress *
              500 *
              0.13
          ) +
          1
        ) /
        2;

      context.fillStyle =
        `rgba(71,96,76,${
          cycle *
          0.08
        })`;

      context.fillRect(
        0,
        0,
        width,
        height
      );

      /* GRID */

      const gridOpacity =
        (
          1 -
          phase(
            progress,
            0.66,
            0.78
          )
        ) *
        0.09;

      context.strokeStyle =
        `rgba(185,205,189,${gridOpacity})`;

      context.lineWidth =
        1;

      const gridSize =
        74;

      for (
        let x = 0;
        x <= width;
        x += gridSize
      ) {
        context.beginPath();

        context.moveTo(
          x,
          0
        );

        context.lineTo(
          x,
          height
        );

        context.stroke();
      }

      for (
        let y = 0;
        y <= height;
        y += gridSize
      ) {
        context.beginPath();

        context.moveTo(
          0,
          y
        );

        context.lineTo(
          width,
          y
        );

        context.stroke();
      }

      /* MAP OUTLINE */

      const mapReveal =
        phase(
          progress,
          0.13,
          0.48
        );

      const mapFade =
        1 -
        phase(
          progress,
          0.57,
          0.72
        );

      context.strokeStyle =
        `rgba(140,178,151,${
          mapReveal *
          mapFade *
          0.42
        })`;

      context.lineWidth =
        0.8;

      for (
        const segment of
        mapSegments
      ) {
        if (
          segment.length <
          2
        ) {
          continue;
        }

        context.beginPath();

        context.moveTo(
          segment[0].x,
          segment[0].y
        );

        for (
          let index =
            1;
          index <
          segment.length;
          index++
        ) {
          context.lineTo(
            segment[index].x,
            segment[index].y
          );
        }

        context.stroke();
      }

      /* SEARCH TRACES */

      const searchProgress =
        phase(
          progress,
          0.07,
          0.5
        );

      const visibleCount =
        Math.floor(
          searchProgress *
            TRACE_COUNT
        );

      const morphProgress =
        phase(
          progress,
          0.5,
          0.67
        );

      const dissolveProgress =
        phase(
          progress,
          0.75,
          0.9
        );

      const baseCount =
        morphProgress >
        0
          ? TRACE_COUNT
          : visibleCount;

      for (
        let index = 0;
        index <
        baseCount;
        index++
      ) {
        const trace =
          traces[
            index %
              Math.max(
                traces.length,
                1
              )
          ];

        if (!trace) {
          continue;
        }

        const target =
          textTargets[
            index %
              Math.max(
                textTargets.length,
                1
              )
          ] ??
          trace;

        const fieldPoint =
          field[index] ??
          target;

        let x =
          lerp(
            trace.x,
            target.x,
            morphProgress
          );

        let y =
          lerp(
            trace.y,
            target.y,
            morphProgress
          );

        if (
          dissolveProgress >
          0
        ) {
          x =
            lerp(
              target.x,
              fieldPoint.x,
              dissolveProgress
            );

          y =
            lerp(
              target.y,
              fieldPoint.y,
              dissolveProgress
            );
        }

        const pulse =
          (
            Math.sin(
              time *
                0.002 +
                index *
                  0.7
            ) +
            1
          ) /
          2;

        const radius =
          morphProgress >
          0
            ? 1.65
            : 1.1 +
              pulse *
                0.55;

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
          `rgba(154,190,164,${
            0.32 +
            pulse *
              0.5
          })`;

        context.fill();

        if (
          morphProgress <
            0.15 &&
          index %
            17 ===
            0
        ) {
          context.strokeStyle =
            "rgba(160,191,169,0.24)";

          context.lineWidth =
            0.6;

          context.beginPath();

          context.moveTo(
            x - 6,
            y
          );

          context.lineTo(
            x + 6,
            y
          );

          context.moveTo(
            x,
            y - 6
          );

          context.lineTo(
            x,
            y + 6
          );

          context.stroke();
        }
      }

      /* EXTRA PARTICLES */

      if (
        dissolveProgress >
        0
      ) {
        const extraCount =
          Math.floor(
            (
              FINAL_PARTICLE_COUNT -
              TRACE_COUNT
            ) *
              dissolveProgress
          );

        for (
          let offset =
            0;
          offset <
          extraCount;
          offset++
        ) {
          const index =
            TRACE_COUNT +
            offset;

          const point =
            field[index];

          if (!point) {
            continue;
          }

          const pulse =
            (
              Math.sin(
                time *
                  0.0015 +
                  index *
                    0.31
              ) +
              1
            ) /
            2;

          context.beginPath();

          context.arc(
            point.x,
            point.y,
            0.65 +
              pulse *
                0.45,
            0,
            Math.PI *
              2
          );

          context.fillStyle =
            `rgba(138,174,148,${
              dissolveProgress *
              (
                0.18 +
                pulse *
                  0.32
              )
            })`;

          context.fill();
        }
      }

      /* GLOW */

      const glow =
        context.createRadialGradient(
          width / 2,
          height / 2,
          0,

          width / 2,
          height / 2,

          Math.min(
            width,
            height
          ) *
            0.48
        );

      glow.addColorStop(
        0,
        `rgba(72,111,84,${
          0.05 +
          morphProgress *
            0.07
        })`
      );

      glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      context.fillStyle =
        glow;

      context.fillRect(
        0,
        0,
        width,
        height
      );

      animationFrame =
        requestAnimationFrame(
          render
        );
    }

    animationFrame =
      requestAnimationFrame(
        render
      );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <section
      id="opening"
      data-chapter="opening"
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
        <canvas
          ref={canvasRef}
          className={
            styles.heroCanvas
          }
        />

        <div
          ref={spotlightRef}
          className={
            styles.heroSearchBeam
          }
        />

        <div
          className={
            styles.heroNoise
          }
        />

        <div
          className={
            styles.heroVignette
          }
        />

        <div
          className={
            styles.heroChrome
          }
        >
          <span>
            HỒ SƠ ĐẶC BIỆT
          </span>

          <span>
            TÌM KIẾM · QUY TẬP
            · DANH TÍNH
          </span>

          <span>
            2026
          </span>
        </div>

        <div
          className={
            styles.heroOpeningStatement
          }
        >
          <span>
            CUỘC TÌM KIẾM
            BẮT ĐẦU TỪ
          </span>

          <strong>
            một tọa độ.
          </strong>
        </div>

        <div
          ref={coordinateRef}
          className={
            styles.heroCoordinate
          }
        >
          21.782°N / 105.221°E
        </div>

        <div
          className={
            styles.heroDayCounter
          }
        >
          <span>
            DAY
          </span>

          <strong
            ref={dayRef}
          >
            001
          </strong>
        </div>

        <span
          ref={stageWordRef}
          className={
            styles.heroStageWord
          }
        >
          TÌM KIẾM
        </span>

        <div
          ref={title500Ref}
          className={
            styles.hero500Title
          }
        >
          <span>
            500
          </span>

          <strong>
            NGÀY ĐÊM
          </strong>

          <p>
            500 ngày của những
            dấu vết, tọa độ và
            những cuộc tìm kiếm
            chưa dừng lại.
          </p>
        </div>

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
            CUỘN TIẾP ĐỂ THẤY
            CÂU CHUYỆN PHÍA SAU
            CON SỐ
          </i>
        </div>

        <div
          ref={scrollCueRef}
          className={
            styles.scrollCue
          }
        >
          <span>
            DI CHUYỂN CHUỘT ĐỂ
            TÌM KIẾM
          </span>

          <i />

          <small>
            CUỘN ĐỂ ĐI QUA 500
            NGÀY
          </small>
        </div>
      </div>
    </section>
  );
}