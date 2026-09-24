"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  trackedProvinceLocations,
} from "../../data/mapLocations";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";

import type {
  Map as MapLibreMap,
} from "maplibre-gl";

import { remainsData } from "../../data/remains";

import {
  normalizeProvinceName,
} from "../../lib/map/normalizeProvinceName";

import {
  MAP_CONFIG,
} from "../../lib/map/mapConfig";

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

  /*
   * Khi true:
   * map tự fit toàn bộ Việt Nam sau khi load.
   */
  autoFit?: boolean;

  /*
   * Dùng cho map nằm trong article:
   * - không NavigationControl
   * - không Reset button
   * - không Legend
   */
  minimal?: boolean;
}

/* =========================================================
   TYPES
========================================================= */

type ExtendedProperties =
  GeoJsonProperties & {
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

const SOURCE_ID =
  "vietnam-provinces";

const FILL_LAYER_ID =
  "province-fill";

const BORDER_LAYER_ID =
  "province-border";

/*
 * Bounds để map luôn hiển thị toàn bộ Việt Nam.
 */

const VIETNAM_BOUNDS: [
  [number, number],
  [number, number],
] = [
  [101.5, 7.0],
  [116.0, 23.9],
];

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

function getProvinceDisplayName(
  province: string
) {
  if (province === "Hồ Chí Minh") {
    return "TP.HỒ CHÍ MINH";
  }

  return province.toUpperCase();
}

const NORMALIZED_PROVINCES =
  new Map(
    VIETNAM_PROVINCES.map(
      (province) => [
        normalizeProvinceName(
          province
        ),

        province,
      ]
    )
  );


/* =========================================================
   GET PROVINCE NAME
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

  for (
    const key of possibleKeys
  ) {
    const value =
      properties[key];

    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      continue;
    }

    const normalized =
      normalizeProvinceName(
        value
      );

    const province =
      NORMALIZED_PROVINCES.get(
        normalized
      );

    if (province) {
      return province;
    }
  }

  for (
    const value of Object.values(
      properties
    )
  ) {
    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      continue;
    }

    const normalized =
      normalizeProvinceName(
        value
      );

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

/* =========================================================
   GEOMETRY BOUNDS
========================================================= */

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

  function walk(
    value: unknown
  ) {
    if (!Array.isArray(value)) {
      return;
    }

    if (
      value.length >= 2 &&
      typeof value[0] ===
        "number" &&
      typeof value[1] ===
        "number"
    ) {
      const lng =
        value[0];

      const lat =
        value[1];

      minLng =
        Math.min(
          minLng,
          lng
        );

      minLat =
        Math.min(
          minLat,
          lat
        );

      maxLng =
        Math.max(
          maxLng,
          lng
        );

      maxLat =
        Math.max(
          maxLat,
          lat
        );

      return;
    }

    for (
      const child of value
    ) {
      walk(child);
    }
  }

  if (
    "coordinates" in
    geometry
  ) {
    walk(
      geometry.coordinates
    );
  }

  if (
    !Number.isFinite(
      minLng
    ) ||
    !Number.isFinite(
      minLat
    ) ||
    !Number.isFinite(
      maxLng
    ) ||
    !Number.isFinite(
      maxLat
    )
  ) {
    return null;
  }

  return [
    [
      minLng,
      minLat,
    ],

    [
      maxLng,
      maxLat,
    ],
  ];
}

/* =========================================================
   PARSE DETAILS
========================================================= */

function parseDetails(
  value: unknown
): string[] {
  if (
    Array.isArray(value)
  ) {
    return value.map(
      String
    );
  }

  if (
    typeof value !==
      "string" ||
    value.length === 0
  ) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    if (
      Array.isArray(
        parsed
      )
    ) {
      return parsed.map(
        String
      );
    }
  } catch {
    return [];
  }

  return [];
}

/* =========================================================
   FIT VIETNAM
========================================================= */

function fitVietnam(
  map: MapLibreMap,
  instant = false
) {
  const container =
    map.getContainer();

  const width =
    container.clientWidth;

  const height =
    container.clientHeight;

  if (
    width <= 0 ||
    height <= 0
  ) {
    return;
  }

  const compact =
    width <= 760;

  map.stop();

  map.resize();

  map.fitBounds(
    VIETNAM_BOUNDS,
    {
      padding: compact
        ? {
            top: 28,
            right: 42,
            bottom: 32,
            left: 28,
          }
        : {
            top: 42,
            right: 65,
            bottom: 45,
            left: 45,
          },

      duration:
        instant
          ? 0
          : 650,
    }
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function VietnamRemainsMap({
  embedded = false,
  autoFit = false,
  minimal = false,
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

    let cleanupResize:
      | (() => void)
      | null = null;

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
                  id:
                    "background",

                  type:
                    "background",

                  paint: {
                    "background-color":
                      "rgba(0, 0, 0, 0)",
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

        mapRef.current =
          map;

        /* ===============================================
           CONTROLS

           Inline article map:
           không hiện +/- control.
        =============================================== */

        if (!minimal) {
          map.addControl(
            new maplibre.NavigationControl({
              showCompass:
                false,

              visualizePitch:
                false,
            }),

            "top-right"
          );
        }

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
                    (
                      item
                    ) => [
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

              /* =========================================
                 SOURCE
              ========================================= */

              map.addSource(
                SOURCE_ID,

                {
                  type:
                    "geojson",

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

                type:
                  "fill",

                source:
                  SOURCE_ID,

                paint: {
                  "fill-color": [
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

                  "fill-opacity": [
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

                type:
                  "line",

                source:
                  SOURCE_ID,

                paint: {
                  "line-color": [
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

                  "line-width": [
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
                 ARCHIPELAGOS
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
                    .addTo(
                      map
                    );

                markerRefs.current.push(
                  marker
                );
              }

              /* =========================================
                 TRACKED PROVINCE LABELS
              ========================================= */

              for (
                const item of
                trackedProvinceLocations
              ) {
                const element =
                  document.createElement(
                    "div"
                  );

                element.className =
                  styles.provinceMapLabel;

                element.textContent =
                  getProvinceDisplayName(
                    item.province
                  );

                const marker =
                  new maplibre.Marker({
                    element,

                    anchor:
                      "center",
                  })
                    .setLngLat(
                      item.coordinates
                    )
                    .addTo(
                      map
                    );

                markerRefs.current.push(
                  marker
                );
              }

              /* =========================================
                 HOVER STATE
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

                  offset:
                    12,

                  maxWidth:
                    "300px",
                });

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

                  if (
                    !feature
                  ) {
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
                      remains >= 0
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
                      graves >= 0
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
                    .addTo(
                      map
                    );
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

                  if (
                    !feature
                  ) {
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
                      remains >= 0
                        ? remains
                        : undefined,

                    gravesFound:
                      tracked &&
                      graves >= 0
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

                  if (
                    !bounds
                  ) {
                    return;
                  }

                  const isMobile =
                    window.innerWidth <=
                    768;

                  map.fitBounds(
                    bounds,

                    {
                      padding:
                        minimal
                          ? {
                              top:
                                35,

                              right:
                                30,

                              bottom:
                                35,

                              left:
                                30,
                            }
                          : isMobile
                            ? {
                                top:
                                  180,

                                right:
                                  35,

                                bottom:
                                  45,

                                left:
                                  35,
                              }
                            : {
                                top:
                                  70,

                                right:
                                  90,

                                bottom:
                                  70,

                                left:
                                  390,
                              },

                      maxZoom:
                        minimal
                          ? 6.8
                          : 7.4,

                      duration:
                        750,
                    }
                  );
                }
              );

              /* =========================================
                 READY + AUTO FIT
              ========================================= */

              setLoading(
                false
              );

              requestAnimationFrame(
                () => {
                  map.resize();

                  if (
                    autoFit
                  ) {
                    fitVietnam(
                      map
                    );
                  }
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
        let resizeTimer:
          ReturnType<typeof setTimeout>
          | null = null;

        const resizeAndFit =
          () => {
            if (disposed) {
              return;
            }

            map.resize();

            if (autoFit) {
              fitVietnam(
                map,
                true
              );
            }
          };

        const scheduleResizeAndFit =
          () => {
            if (resizeTimer) {
              clearTimeout(
                resizeTimer
              );
            }

            resizeTimer =
              setTimeout(
                () => {
                  resizeAndFit();
                },
                150
              );
          };

        window.addEventListener(
          "resize",
          scheduleResizeAndFit
        );

        const resizeObserver =
          new ResizeObserver(
            () => {
              scheduleResizeAndFit();
            }
          );

        if (
          mapContainerRef.current
        ) {
          resizeObserver.observe(
            mapContainerRef.current
          );
        }

        /*
        * Wix thường hoàn tất kích thước iframe
        * sau khi nội dung đã load.
        * Fit lại vài lần để camera bắt đúng kích thước cuối.
        */
        const delayedFit1 =
          window.setTimeout(
            resizeAndFit,
            300
          );

        const delayedFit2 =
          window.setTimeout(
            resizeAndFit,
            800
          );

        const delayedFit3 =
          window.setTimeout(
            resizeAndFit,
            1500
          );

        cleanupResize =
          () => {
            window.removeEventListener(
              "resize",
              scheduleResizeAndFit
            );

            resizeObserver.disconnect();

            if (resizeTimer) {
              clearTimeout(
                resizeTimer
              );
            }

            window.clearTimeout(
              delayedFit1
            );

            window.clearTimeout(
              delayedFit2
            );

            window.clearTimeout(
              delayedFit3
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

        setLoading(
          false
        );
      }
    }

    initializeMap();

    return () => {
      disposed =
        true;

      cleanupResize?.();

      markerRefs.current.forEach(
        (
          marker
        ) =>
          marker.remove()
      );

      markerRefs.current =
        [];

      if (
        mapRef.current
      ) {
        mapRef.current.remove();

        mapRef.current =
          null;
      }
    };
    }, []);

  /* =======================================================
     RESET MAP
  ======================================================= */

  function closeDetails() {
    setSelectedProvince(null);

    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    map.stop();

    if (autoFit) {
      fitVietnam(map);
      return;
    }

    map.easeTo({
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      duration: 700,
    });
  }


  function resetMap() {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    map.stop();

    if (
      autoFit
    ) {
      fitVietnam(
        map
      );
    } else {
      map.easeTo({
        center:
          MAP_CONFIG.center,

        zoom:
          MAP_CONFIG.zoom,

        duration:
          700,
      });
    }

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
              {!minimal && (
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
                </>
              )}

              <ProvinceTooltip
                selectedProvince={
                  selectedProvince
                }
                onClose={
                  closeDetails
                }
              />
            </>
          )}
      </div>
    </main>
  );
}