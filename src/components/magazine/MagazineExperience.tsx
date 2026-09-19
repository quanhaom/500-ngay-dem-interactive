import OpeningHero from "./OpeningHero";
import ReadingProgress from "./navigation/ReadingProgress";
import TeamsDotsSection from "./teams/TeamsDotsSection";
import DnaJourneySection from "./DnaJourneySection";
import MemoryScrollSection from "./MemoryScrollSection";
import DnaIdentitySection from "./DnaIdentitySection";
import {
  MineClearanceSection,
  ReadymagCover,
  ReadymagIntro,
  ReadymagNarrative,
} from "./ReadymagSections";
import SearchTeamsGallery from "./SearchTeamsGallery";
import styles from "./MagazineExperience.module.css";
import SearchTeamsStoryFlow from "./SearchTeamsStoryFlow";
import PromiseSection from "./PromiseSection";
import MineClearanceStorySection from "./MineClearanceStorySection";
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

      <SearchTeamsGallery />

      <SearchTeamsStoryFlow>
        <TeamsDotsSection />
      </SearchTeamsStoryFlow>

      <DnaIdentitySection />  
      <DnaJourneySection />
      <MineClearanceStorySection />
      <PromiseSection />

    </main>
  );
}