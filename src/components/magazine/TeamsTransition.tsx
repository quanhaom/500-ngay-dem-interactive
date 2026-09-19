import Image from "next/image";

import styles from "./TeamsTransition.module.css";

export default function TeamsTransition() {
  return (
    <div className={styles.transition}>
      <div className={styles.background} />

      <div className={styles.flowerArea}>
        {

          <Image
            src="/images/readymag/decor/flower.png"
            alt=""
            width={180}
            height={180}
            className={styles.flower}
          />
        }

        <div
          className={styles.flowerPlaceholder}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}