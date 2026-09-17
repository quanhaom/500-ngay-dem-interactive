import ChapterNav from "./ChapterNav";

import OpeningHero from "./OpeningHero";

import ReadingProgress from "./navigation/ReadingProgress";

import ScaleSection from "./sections/ScaleSection";

import MapSection from "./sections/MapSection";

import MapToMemorialTransition from "./sections/MapToMemorialTransition";

import MemorialSection from "./sections/MemorialSection";

import TeamsSection from "./sections/TeamsSection";

import DNASection from "./sections/DNASection";

import IdentityTransition from "./sections/IdentityTransition";

import EndingSection from "./sections/EndingSection";

import styles from "./MagazineExperience.module.css";

export default function MagazineExperience() {
  return (
    <main
      className={
        styles.magazine
      }
    >
      <ReadingProgress />

      <ChapterNav />

      {/* ================================================
          01
          SEARCH IN THE DARK
          → DAY 001 → DAY 500
          → 500
          → 1.863
      ================================================= */}

      <OpeningHero />

      {/* ================================================
          02
          1.863 → VN / LÀO / CAMPUCHIA
      ================================================= */}

      <ScaleSection />

      {/* ================================================
          03
          INTERACTIVE MAP
      ================================================= */}

      <MapSection />

      {/* ================================================
          TRANSITION
          MAP → ONE POINT
      ================================================= */}

      <MapToMemorialTransition />

      {/* ================================================
          04
          418
      ================================================= */}

      <MemorialSection />

      {/* ================================================
          05
          32 TEAMS / 1.559 PEOPLE
      ================================================= */}

      <TeamsSection />

      {/* ================================================
          06
          DNA PIPELINE
      ================================================= */}

      <DNASection />

      {/* ================================================
          TRANSITION
          DNA → IDENTITY
      ================================================= */}

      <IdentityTransition />

      {/* ================================================
          07
          ONE NAME
      ================================================= */}

      <EndingSection />
    </main>
  );
}