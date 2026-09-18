import VietnamRemainsMap from "../../map/VietnamRemainsMap";

import styles from "../MagazineExperience.module.css";

export default function MapSection() {
  return (
    <section
      id="map"
      className={
        styles.mapSection
      }
    >
      <div
        className={
          styles.mapMagazineFrame
        }
      >
        <VietnamRemainsMap
          embedded
        />
      </div>

      <div
        className={
          styles.mapEndCaption
        }
      >
        <span>
          BẢN ĐỒ TƯƠNG TÁC
        </span>

        <p>
          Chọn từng tỉnh,
          thành phố để xem
          thông tin tìm kiếm
          được ghi nhận.
        </p>
      </div>
    </section>
  );
}