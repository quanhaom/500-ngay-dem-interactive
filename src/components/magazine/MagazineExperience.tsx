import OpeningHero from "./OpeningHero";
import ReadingProgress from "./navigation/ReadingProgress";

import TeamsDotsSection from "./teams/TeamsDotsSection";

import MemoryScrollSection from "./MemoryScrollSection";

import {
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

      <ReadymagCover />

      <ReadymagIntro />

      <OpeningHero />

      <ReadymagNarrative />

      <MemoryScrollSection />

      <TeamsDotsSection />

      <MineClearanceSection />
    </main>
  );
}