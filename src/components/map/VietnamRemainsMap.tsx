"use client";

import { useEffect, useRef, useState } from "react";

import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";

import type { Map as MapLibreMap } from "maplibre-gl";

import { remainsData } from "../../data/remains";
import { normalizeProvinceName } from "../../lib/map/normalizeProvinceName";
import { MAP_CONFIG } from "../../lib/map/mapConfig";

import type {
  ProvinceInteractiveData,
  SelectedProvince,
} from "../../types/map";

import MapLegend from "./MapLegend";
import ProvinceTooltip from "./ProvinceTooltip";

import styles from "./VietnamRemainsMap.module.css";

/* =========================================================
   PROPS
========================================================= */

interface VietnamRemainsMapProps {
  embedded?: boolean;
}

/* =========================================================
   TYPES
========================================================= */

type ExtendedProperties = GeoJsonProperties & {
  __provinceName?: string;
  __tracked?: boolean;
  __siteName?: string;
  __remainsFound?: number;
  __gravesFound?: number;
  __summary?: string;
  __details?: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const SOURCE_ID = "vietnam-provinces";
const FILL_LAYER_ID = "province-fill";
const BORDER_LAYER_ID = "province-border";

const VIETNAM_PROVINCES = [
  "Hà Nội",
  "Huế",
  "Lai Châu",
  "Điện Biên",
  "Sơn La",
  "Lạng Sơn",
  "Cao Bằng",
  "Tuyên Quang",
  "Lào Cai",
  "Thái Nguyên",
  "Phú Thọ",
  "Bắc Ninh",
  "Quảng Ninh",
  "Hưng Yên",
  "Hải Phòng",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Đà Nẵng",
  "Quảng Ngãi",
  "Gia Lai",
  "Đắk Lắk",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đồng Nai",
  "Tây Ninh",
  "Hồ Chí Minh",
  "Đồng Tháp",
  "Vĩnh Long",
  "An Giang",
  "Cần Thơ",
  "Cà Mau",
];

const NORMALIZED_PROVINCES = new Map(
  VIETNAM_PROVINCES.map((province) => [
    normalizeProvinceName(province),
    province,
  ])
);

const TRACKED_PROVINCE_LABELS = [
  {
    province: "Tuyên Quang",
    coordinates: [105.22, 22.13] as [number, number],
  },
  {
    province: "Quảng Trị",
    coordinates: [107.05, 16.75] as [number, number],
  },
  {
    province: "Quảng Ngãi",
    coordinates: [108.75, 15.12] as [number, number],
  },
  {
    province: "Đắk Lắk",
    coordinates: [108.05, 12.7] as [number, number],
  },
  {
    province: "Đồng Nai",
    coordinates: [107.15, 11.0] as [number, number],
  },
  {
    province: "Hồ Chí Minh",
    coordinates: [106.65, 10.78] as [number, number],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getProvinceName(
  properties: GeoJsonProperties
): string {
  if (!properties) {
    return "Không xác định";
  }

  const possibleKeys = [
    "province",
    "Province",
    "PROVINCE",

    "name",
    "Name",
    "NAME",

    "name_vi",
    "NAME_VI",

    "ten_tinh",
    "TEN_TINH",

    "NAME_1",
    "VARNAME_1",

    "full_name",
    "FULL_NAME",
    "fullname",

    "ADM1_VI",
    "ADM1_EN",
  ];

  for (const key of possibleKeys) {
    const value = properties[key];

    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      continue;
    }

    const normalized =
      normalizeProvinceName(value);

    const province =
      NORMALIZED_PROVINCES.get(
        normalized
      );

    if (province) {
      return province;
    }
  }

  for (const value of Object.values(
    properties
  )) {
    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      continue;
    }

    const normalized =
      normalizeProvinceName(value);

    const province =
      NORMALIZED_PROVINCES.get(
        normalized
      );

    if (province) {
      return province;
    }
  }

  return "Không xác định";
}

function calculateGeometryBounds(
  geometry: Geometry
):
  | [
      [number, number],
      [number, number],
    ]
  | null {
  let minLng = Infinity;
  let minLat = Infinity;

  let maxLng = -Infinity;
  let maxLat = -Infinity;

  function walk(value: unknown) {
    if (!Array.isArray(value)) {
      return;
    }

    if (
      value.length >= 2 &&
      typeof value[0] === "number" &&
      typeof value[1] === "number"
    ) {
      const lng = value[0];
      const lat = value[1];

      minLng = Math.min(
        minLng,
        lng
      );

      minLat = Math.min(
        minLat,
        lat
      );

      maxLng = Math.max(
        maxLng,
        lng
      );

      maxLat = Math.max(
        maxLat,
        lat
      );

      return;
    }

    for (const child of value) {
      walk(child);
    }
  }

  if ("coordinates" in geometry) {
    walk(geometry.coordinates);
  }

  if (
    !Number.isFinite(minLng) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLng) ||
    !Number.isFinite(maxLat)
  ) {
    return null;
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

function parseDetails(
  value: unknown
): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    if (
      Array.isArray(parsed)
    ) {
      return parsed.map(String);
    }
  } catch {
    return [];
  }

  return [];
}

/* =========================================================
   COMPONENT
========================================================= */

export default function VietnamRemainsMap({
  embedded = false,
}: VietnamRemainsMapProps) {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const mapRef =
    useRef<MapLibreMap | null>(
      null
    );

  const markerRefs =
    useRef<
      Array<{
        remove: () => void;
      }>
    >([]);

  const [
    selectedProvince,
    setSelectedProvince,
  ] =
    useState<SelectedProvince | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  /* =======================================================
     MAP INITIALIZATION
  ======================================================= */

  useEffect(() => {
    const container =
      mapContainerRef.current;

    if (!container) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    let disposed = false;

    async function initializeMap() {
      try {
        const maplibre =
          await import(
            "maplibre-gl"
          );

        if (
          disposed ||
          !mapContainerRef.current
        ) {
          return;
        }

        const map =
          new maplibre.Map({
            container:
              mapContainerRef.current,

            style: {
              version: 8,

              sources: {},

              layers: [
                {
                  id: "background",
                  type: "background",

                  paint: {
                    "background-color":
                      MAP_CONFIG
                        .colors
                        .background,
                  },
                },
              ],
            },

            center:
              MAP_CONFIG.center,

            zoom:
              MAP_CONFIG.zoom,

            minZoom:
              MAP_CONFIG.minZoom,

            maxZoom:
              MAP_CONFIG.maxZoom,

            attributionControl:
              false,
          });

        mapRef.current = map;

        /* ===============================================
           CONTROLS
        =============================================== */

        map.addControl(
          new maplibre.NavigationControl({
            showCompass: false,
            visualizePitch: false,
          }),
          "top-right"
        );

        /* ===============================================
           MAP LOAD
        =============================================== */

        map.on(
          "load",
          async () => {
            try {
              const response =
                await fetch(
                  "/data/map/vietnam-provinces.geojson"
                );

              if (
                !response.ok
              ) {
                throw new Error(
                  `Không tải được GeoJSON: ${response.status}`
                );
              }

              const geoJson =
                (await response.json()) as FeatureCollection<
                  Geometry,
                  ExtendedProperties
                >;

              const remainsLookup =
                new Map<
                  string,
                  ProvinceInteractiveData
                >(
                  remainsData.map(
                    (item) => [
                      normalizeProvinceName(
                        item.province
                      ),
                      item,
                    ]
                  )
                );

              /* =========================================
                 ENHANCE GEOJSON
              ========================================= */

              const enhancedGeoJson: FeatureCollection<
                Geometry,
                ExtendedProperties
              > = {
                ...geoJson,

                features:
                  geoJson.features.map(
                    (
                      feature: Feature<
                        Geometry,
                        ExtendedProperties
                      >
                    ) => {
                      const properties =
                        feature.properties ??
                        {};

                      const province =
                        getProvinceName(
                          properties
                        );

                      const normalized =
                        normalizeProvinceName(
                          province
                        );

                      const data =
                        remainsLookup.get(
                          normalized
                        );

                      return {
                        ...feature,

                        properties: {
                          ...properties,

                          __provinceName:
                            province,

                          __tracked:
                            Boolean(
                              data
                            ),

                          __siteName:
                            data?.siteName ??
                            "",

                          __remainsFound:
                            data?.remainsFound ??
                            -1,

                          __gravesFound:
                            data?.gravesFound ??
                            -1,

                          __summary:
                            data?.summary ??
                            "",

                          __details:
                            JSON.stringify(
                              data?.details ??
                                []
                            ),
                        },
                      };
                    }
                  ),
              };

              console.log(
                "Matched provinces:",
                enhancedGeoJson.features
                  .filter(
                    (
                      feature
                    ) =>
                      feature
                        .properties
                        ?.__tracked ===
                      true
                  )
                  .map(
                    (
                      feature
                    ) =>
                      feature
                        .properties
                        ?.__provinceName
                  )
              );

              /* =========================================
                 SOURCE
              ========================================= */

              map.addSource(
                SOURCE_ID,
                {
                  type: "geojson",

                  data:
                    enhancedGeoJson,

                  generateId:
                    true,
                }
              );

              /* =========================================
                 FILL
              ========================================= */

              map.addLayer({
                id:
                  FILL_LAYER_ID,

                type: "fill",

                source:
                  SOURCE_ID,

                paint: {
                  "fill-color":
                    [
                      "case",

                      [
                        "boolean",
                        [
                          "feature-state",
                          "hover",
                        ],
                        false,
                      ],

                      MAP_CONFIG
                        .colors
                        .provinceHover,

                      [
                        "boolean",
                        [
                          "get",
                          "__tracked",
                        ],
                        false,
                      ],

                      MAP_CONFIG
                        .colors
                        .provinceTracked,

                      MAP_CONFIG
                        .colors
                        .provinceDefault,
                    ],

                  "fill-opacity":
                    [
                      "case",

                      [
                        "boolean",
                        [
                          "feature-state",
                          "hover",
                        ],
                        false,
                      ],

                      0.98,

                      0.9,
                    ],
                },
              });

              /* =========================================
                 BORDERS
              ========================================= */

              map.addLayer({
                id:
                  BORDER_LAYER_ID,

                type: "line",

                source:
                  SOURCE_ID,

                paint: {
                  "line-color":
                    [
                      "case",

                      [
                        "boolean",
                        [
                          "feature-state",
                          "hover",
                        ],
                        false,
                      ],

                      MAP_CONFIG
                        .colors
                        .borderHover,

                      MAP_CONFIG
                        .colors
                        .border,
                    ],

                  "line-width":
                    [
                      "case",

                      [
                        "boolean",
                        [
                          "feature-state",
                          "hover",
                        ],
                        false,
                      ],

                      2,

                      0.8,
                    ],

                  "line-opacity":
                    1,
                },
              });

              /* =========================================
                 ARCHIPELAGO LABELS
              ========================================= */

              for (
                const archipelago of
                MAP_CONFIG.archipelagos
              ) {
                const element =
                  document.createElement(
                    "div"
                  );

                element.className =
                  styles.archipelagoMarker;

                const dot =
                  document.createElement(
                    "span"
                  );

                dot.className =
                  styles.archipelagoDot;

                const label =
                  document.createElement(
                    "span"
                  );

                label.className =
                  styles.archipelagoLabel;

                label.textContent =
                  archipelago.shortName;

                element.appendChild(
                  dot
                );

                element.appendChild(
                  label
                );

                element.title =
                  archipelago.name;

                const marker =
                  new maplibre.Marker({
                    element,
                    anchor:
                      "center",
                  })
                    .setLngLat(
                      archipelago.coordinates
                    )
                    .addTo(map);

                markerRefs.current.push(
                  marker
                );
              }

              /* =========================================
                 TRACKED PROVINCE LABELS
              ========================================= */

              for (
                const item of
                TRACKED_PROVINCE_LABELS
              ) {
                const element =
                  document.createElement(
                    "div"
                  );

                element.className =
                  styles.provinceMapLabel;

                element.textContent =
                  item.province;

                const marker =
                  new maplibre.Marker({
                    element,
                    anchor:
                      "center",
                  })
                    .setLngLat(
                      item.coordinates
                    )
                    .addTo(map);

                markerRefs.current.push(
                  marker
                );
              }

              /* =========================================
                 POPUP
              ========================================= */

              let hoveredFeatureId:
                | string
                | number
                | null =
                null;

              const popup =
                new maplibre.Popup({
                  closeButton:
                    false,

                  closeOnClick:
                    false,

                  offset: 12,

                  maxWidth:
                    "300px",
                });

              /* =========================================
                 HOVER
              ========================================= */

              map.on(
                "mousemove",
                FILL_LAYER_ID,
                (
                  event
                ) => {
                  map.getCanvas().style.cursor =
                    "pointer";

                  const feature =
                    event
                      .features?.[0];

                  if (!feature) {
                    return;
                  }

                  if (
                    hoveredFeatureId !==
                    null
                  ) {
                    map.setFeatureState(
                      {
                        source:
                          SOURCE_ID,

                        id:
                          hoveredFeatureId,
                      },

                      {
                        hover:
                          false,
                      }
                    );
                  }

                  if (
                    feature.id !==
                    undefined
                  ) {
                    hoveredFeatureId =
                      feature.id;

                    map.setFeatureState(
                      {
                        source:
                          SOURCE_ID,

                        id:
                          feature.id,
                      },

                      {
                        hover:
                          true,
                      }
                    );
                  }

                  const properties =
                    feature.properties ??
                    {};

                  const province =
                    String(
                      properties.__provinceName ??
                        "Không xác định"
                    );

                  const tracked =
                    properties.__tracked ===
                      true ||
                    properties.__tracked ===
                      "true";

                  const siteName =
                    String(
                      properties.__siteName ??
                        ""
                    );

                  const remains =
                    Number(
                      properties.__remainsFound ??
                        -1
                    );

                  const graves =
                    Number(
                      properties.__gravesFound ??
                        -1
                    );

                  const popupElement =
                    document.createElement(
                      "div"
                    );

                  popupElement.className =
                    styles.mapPopup;

                  const title =
                    document.createElement(
                      "strong"
                    );

                  title.textContent =
                    province;

                  popupElement.appendChild(
                    title
                  );

                  if (
                    tracked
                  ) {
                    if (
                      siteName
                    ) {
                      const location =
                        document.createElement(
                          "div"
                        );

                      location.className =
                        styles.popupLocation;

                      location.textContent =
                        siteName;

                      popupElement.appendChild(
                        location
                      );
                    }

                    if (
                      remains >=
                      0
                    ) {
                      const remainsLine =
                        document.createElement(
                          "div"
                        );

                      remainsLine.className =
                        styles.popupNumber;

                      if (
                        province ===
                        "Tuyên Quang"
                      ) {
                        remainsLine.textContent =
                          `Khoảng ${remains.toLocaleString(
                            "vi-VN"
                          )} hài cốt`;
                      } else {
                        remainsLine.textContent =
                          `${remains.toLocaleString(
                            "vi-VN"
                          )} hài cốt`;
                      }

                      popupElement.appendChild(
                        remainsLine
                      );
                    }

                    if (
                      graves >=
                      0
                    ) {
                      const gravesLine =
                        document.createElement(
                          "div"
                        );

                      gravesLine.textContent =
                        `${graves} mộ tập thể`;

                      popupElement.appendChild(
                        gravesLine
                      );
                    }

                    const hint =
                      document.createElement(
                        "span"
                      );

                    hint.className =
                      styles.popupHint;

                    hint.textContent =
                      "Bấm để xem chi tiết";

                    popupElement.appendChild(
                      hint
                    );
                  } else {
                    const noData =
                      document.createElement(
                        "div"
                      );

                    noData.textContent =
                      "Chưa có thông tin trong dữ liệu hiện tại.";

                    popupElement.appendChild(
                      noData
                    );
                  }

                  popup
                    .setLngLat(
                      event.lngLat
                    )
                    .setDOMContent(
                      popupElement
                    )
                    .addTo(map);
                }
              );

              /* =========================================
                 MOUSE LEAVE
              ========================================= */

              map.on(
                "mouseleave",
                FILL_LAYER_ID,
                () => {
                  map.getCanvas().style.cursor =
                    "";

                  popup.remove();

                  if (
                    hoveredFeatureId !==
                    null
                  ) {
                    map.setFeatureState(
                      {
                        source:
                          SOURCE_ID,

                        id:
                          hoveredFeatureId,
                      },

                      {
                        hover:
                          false,
                      }
                    );
                  }

                  hoveredFeatureId =
                    null;
                }
              );

              /* =========================================
                 CLICK
              ========================================= */

              map.on(
                "click",
                FILL_LAYER_ID,
                (
                  event
                ) => {
                  const feature =
                    event
                      .features?.[0];

                  if (!feature) {
                    return;
                  }

                  popup.remove();

                  const properties =
                    feature.properties ??
                    {};

                  const province =
                    String(
                      properties.__provinceName ??
                        "Không xác định"
                    );

                  const tracked =
                    properties.__tracked ===
                      true ||
                    properties.__tracked ===
                      "true";

                  const siteName =
                    String(
                      properties.__siteName ??
                        ""
                    );

                  const remains =
                    Number(
                      properties.__remainsFound ??
                        -1
                    );

                  const graves =
                    Number(
                      properties.__gravesFound ??
                        -1
                    );

                  const summary =
                    String(
                      properties.__summary ??
                        ""
                    );

                  const details =
                    parseDetails(
                      properties.__details
                    );

                  setSelectedProvince({
                    province,

                    tracked,

                    siteName:
                      tracked &&
                      siteName
                        ? siteName
                        : undefined,

                    remainsFound:
                      tracked &&
                      remains >=
                        0
                        ? remains
                        : undefined,

                    gravesFound:
                      tracked &&
                      graves >=
                        0
                        ? graves
                        : undefined,

                    summary:
                      tracked &&
                      summary
                        ? summary
                        : undefined,

                    details:
                      tracked
                        ? details
                        : [],
                  });

                  if (
                    !feature.geometry
                  ) {
                    return;
                  }

                  const bounds =
                    calculateGeometryBounds(
                      feature.geometry
                    );

                  if (!bounds) {
                    return;
                  }

                  const isMobile =
                    window.innerWidth <=
                    768;

                  map.fitBounds(
                    bounds,
                    {
                      padding:
                        isMobile
                          ? {
                              top: 180,
                              right: 35,
                              bottom: 45,
                              left: 35,
                            }
                          : {
                              top: 70,
                              right: 90,
                              bottom: 70,
                              left: 390,
                            },

                      maxZoom:
                        7.4,

                      duration:
                        750,
                    }
                  );
                }
              );

              /* =========================================
                 READY
              ========================================= */

              setLoading(
                false
              );

              requestAnimationFrame(
                () => {
                  map.resize();
                }
              );
            } catch (
              mapError
            ) {
              console.error(
                mapError
              );

              setError(
                mapError instanceof
                  Error
                  ? mapError.message
                  : "Không thể tải bản đồ."
              );

              setLoading(
                false
              );
            }
          }
        );

        /* ===============================================
           RESPONSIVE RESIZE
        =============================================== */

        const resizeMap =
          () => {
            map.resize();
          };

        window.addEventListener(
          "resize",
          resizeMap
        );

        return () => {
          window.removeEventListener(
            "resize",
            resizeMap
          );
        };
      } catch (
        initializationError
      ) {
        console.error(
          initializationError
        );

        setError(
          initializationError instanceof
            Error
            ? initializationError.message
            : "Không thể khởi tạo bản đồ."
        );

        setLoading(false);
      }
    }

    initializeMap();

    return () => {
      disposed = true;

      markerRefs.current.forEach(
        (marker) =>
          marker.remove()
      );

      markerRefs.current = [];

      if (
        mapRef.current
      ) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /* =======================================================
     RESET MAP
  ======================================================= */

  function resetMap() {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    map.stop();

    map.easeTo({
      center:
        MAP_CONFIG.center,

      zoom:
        MAP_CONFIG.zoom,

      duration:
        700,
    });

    setSelectedProvince(
      null
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className={
        embedded
          ? styles.embedded
          : styles.fullscreen
      }
    >
      <div
        className={
          styles.mapShell
        }
      >
        <div
          ref={
            mapContainerRef
          }
          className={
            styles.map
          }
        />

        {loading && (
          <div
            className={
              styles.loading
            }
          >
            <div
              className={
                styles.loadingContent
              }
            >
              <span
                className={
                  styles.loadingDot
                }
              />

              <span>
                Đang tải bản đồ...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div
            className={
              styles.error
            }
          >
            <strong>
              Không thể hiển thị
              bản đồ
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {!loading &&
          !error && (
            <>
              <button
                type="button"
                className={
                  styles.resetButton
                }
                onClick={
                  resetMap
                }
              >
                Xem toàn quốc
              </button>

              <MapLegend />

              <ProvinceTooltip
                selectedProvince={
                  selectedProvince
                }
                onClose={() =>
                  setSelectedProvince(
                    null
                  )
                }
              />
            </>
          )}
      </div>
    </main>
  );
}