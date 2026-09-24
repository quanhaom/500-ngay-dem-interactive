export const MAP_CONFIG = {
  center: [108.6, 15.8] as [
    number,
    number,
  ],

  zoom: 4.85,

  minZoom: 3.8,

  maxZoom: 11,

  archipelagos: [
    {
      name: "Quần đảo Hoàng Sa",

      shortName: "HOÀNG SA",

      coordinates: [
        112.0,
        16.5,
      ] as [
        number,
        number,
      ],
    },

    {
      name: "Quần đảo Trường Sa",

      shortName: "TRƯỜNG SA",

      coordinates: [
        114.2,
        10.2,
      ] as [
        number,
        number,
      ],
    },
  ],

  colors: {
    background:
      "rgba(0, 0, 0, 0)",

    // Tỉnh không có thông tin → đỏ nhạt
    provinceDefault:
      "rgba(218, 164, 156, 0.68)",

    // Tỉnh có thông tin → đỏ rõ và đậm hơn
    provinceTracked:
      "rgba(148, 38, 31, 0.96)",

    // Hover → đỏ rất đậm
    provinceHover:
      "rgba(105, 21, 18, 0.99)",

    // Ranh giới tỉnh rõ hơn
    border:
      "rgba(92, 38, 34, 0.88)",

    borderHover:
      "#4d1513",
  },
};