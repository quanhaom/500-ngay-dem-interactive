import OpeningHero from "../../../components/magazine/OpeningHero";

import magazineStyles from "../../../components/magazine/MagazineExperience.module.css";

import styles from "./page.module.css";

export default function CoordinatesEmbedPage() {
  return (
    <main
      className={[
        magazineStyles.magazine,
        styles.page,
        styles.redTheme,
      ].join(" ")}
    >
      <OpeningHero />
    </main>
  );
}