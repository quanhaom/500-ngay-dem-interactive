import VietnamRemainsMap from "../../../components/map/VietnamRemainsMap";

import styles from "./page.module.css";

export default function EmbeddedMapPage() {
  return (
    <main className={styles.page}>
      <VietnamRemainsMap
        embedded
        autoFit
        minimal
      />
    </main>
  );
}