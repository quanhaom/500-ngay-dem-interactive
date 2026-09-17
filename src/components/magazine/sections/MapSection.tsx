import VietnamRemainsMap from "../../map/VietnamRemainsMap";

import styles from "../MagazineExperience.module.css";

export default function MapSection() {
  return (
    <section
      id="map"
      data-chapter="map"
      className={
        styles.mapSection
      }
    >
      <div
        className={
          styles.mapIntroduction
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            02 · NHỮNG ĐIỂM
            TÌM THẤY
          </p>

          <h2>
            Mỗi vùng sáng là
            một hành trình
            tìm kiếm.
          </h2>
        </div>

        <p
          className={
            styles.mapDescription
          }
        >
          Từ Tuyên Quang đến
          Quảng Trị, Quảng
          Ngãi, Đắk Lắk,
          Đồng Nai và Thành
          phố Hồ Chí Minh.
          Di chuyển trên bản
          đồ và chọn từng
          tỉnh để khám phá
          thông tin hiện có.
        </p>
      </div>

      <div
        className={
          styles.mapMagazineFrame
        }
      >
        <VietnamRemainsMap
          embedded
        />
      </div>
    </section>
  );
}