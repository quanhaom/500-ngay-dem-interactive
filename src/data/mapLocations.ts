export interface MapLocation {
  province: string;
  coordinates: [number, number];
}

export const trackedProvinceLocations: MapLocation[] = [
  {
    province: "Tuyên Quang",
    coordinates: [105.22, 22.13],
  },
  {
    province: "Quảng Trị",
    coordinates: [107.05, 16.75],
  },
  {
    province: "Quảng Ngãi",
    coordinates: [108.75, 15.12],
  },
  {
    province: "Đắk Lắk",
    coordinates: [108.05, 12.7],
  },
  {
    province: "Đồng Nai",
    coordinates: [107.15, 11.0],
  },
  {
    province: "Hồ Chí Minh",
    coordinates: [106.65, 10.78],
  },
];