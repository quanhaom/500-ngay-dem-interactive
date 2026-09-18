import OpeningHero from "./OpeningHero";

import ReadingProgress from "./navigation/ReadingProgress";

import TeamsDotsSection from "./teams/TeamsDotsSection";
import {
  FinalMapIntro,
  MemoryCluesSection,
  MineClearanceSection,
  ReadymagCover,
  ReadymagIntro,
  ReadymagNarrative,
} from "./ReadymagSections";
import MapSection from "./MapSection";


import styles from "./MagazineExperience.module.css";

export default function MagazineExperience() {
  return (
    <main className={styles.magazine}>
      <ReadingProgress />

      <ReadymagCover />

      <ReadymagIntro />

      <OpeningHero />
      <ReadymagNarrative />

      <MemoryCluesSection />

      <TeamsDotsSection />

      <MineClearanceSection />

      <ReadymagNarrative />

      <TeamsDotsSection />

      <MineClearanceSection />

      <FinalMapIntro />

      <MapSection />
    </main>
  );
}