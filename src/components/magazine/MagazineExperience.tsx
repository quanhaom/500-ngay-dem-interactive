import OpeningHero from "./OpeningHero";

import ReadingProgress from "./navigation/ReadingProgress";

import MapSection from "./sections/MapSection";

import {
  FinalMapIntro,
  MineClearanceSection,
  ReadymagCover,
  ReadymagIntro,
  ReadymagNarrative,
} from "./ReadymagSections";

import styles from "./MagazineExperience.module.css";

export default function MagazineExperience() {
  return (
    <main
      className={
        styles.magazine
      }
    >
      <ReadingProgress />

      {/* =================================================
          READYMAG COVER

          Giữ tinh thần của bản dựng gốc:
          ảnh lớn + title 500 ngày đêm.
      ================================================== */}

      <ReadymagCover />

      {/* =================================================
          READYMAG SAPO
      ================================================== */}

      <ReadymagIntro />

      {/* =================================================
          INTERACTIVE FEATURE

          THAY CHÍNH XÁC vị trí subtitle:

          "1.863 cuộc trở về từ nhiều địa bàn"

          Sequence:
          tọa độ
          → DAY 001
          → DAY 500
          → 500
          → 1.863
      ================================================== */}

      <OpeningHero />

      {/* =================================================
          QUAY TRỞ LẠI BẢN READYMAG

          Không lặp lại heading "1.863 cuộc trở về..."
          vì interactive đã thay nó.
      ================================================== */}

      <ReadymagNarrative />

      {/* =================================================
          READYMAG:
          RÀ PHÁ BOM MÌN
          51,9 / 91,39
          NGUỒN LỰC
      ================================================== */}

      <MineClearanceSection />

      {/*
        ==================================================

        CÁC SECTION READYMAG CÒN LẠI

        sẽ tiếp tục được đặt tại đây,
        giữ nguyên thứ tự bản dựng.

        KHÔNG đưa map vào giữa nữa.

        ==================================================
      */}

      {/* =================================================
          CUỐI BÀI → MAP
      ================================================== */}

      <FinalMapIntro />

      <MapSection />
    </main>
  );
}