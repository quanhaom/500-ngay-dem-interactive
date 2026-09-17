export const STORY_STATS = {
  sourceDate:
    "22/8/2026",

  totalRemains: 1863,

  countries: [
    {
      id: "vietnam",
      name: "Việt Nam",
      value: 839,
    },
    {
      id: "laos",
      name: "Lào",
      value: 174,
    },
    {
      id: "cambodia",
      name: "Campuchia",
      value: 850,
    },
  ],

  leThiRieng: {
    value: 418,

    label:
      "Công viên Lê Thị Riêng",

    location:
      "TP. Hồ Chí Minh",

    note:
      "Mốc dữ liệu theo bài tổng hợp ngày 22/8/2026.",
  },

  teams: {
    total: 32,

    people: 1559,

    domestic: 13,

    laos: 8,

    cambodia: 11,
  },

  dna: {
    gravesSampled:
      148601,

    gravesProgress:
      69.8,

    eligible:
      102689,

    notEligible:
      45912,

    completedProvinces:
      11,

    totalProvinces:
      34,

    familySamples:
      265761,

    analyzed:
      71102,

    synced:
      66909,

    transferred:
      7104,
  },
} as const;

export const CHAPTERS = [
  {
    id: "opening",
    number: "01",
    label: "500 ngày đêm",
  },

  {
    id: "scale",
    number: "02",
    label: "1.863",
  },

  {
    id: "map",
    number: "03",
    label: "Bản đồ",
  },

  {
    id: "memorial",
    number: "04",
    label: "418",
  },

  {
    id: "teams",
    number: "05",
    label: "32 đội",
  },

  {
    id: "dna",
    number: "06",
    label: "ADN",
  },

  {
    id: "identity",
    number: "07",
    label: "Một cái tên",
  },
] as const;