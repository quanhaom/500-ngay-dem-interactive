import styles from "./TeamsDotsSection.module.css";

type GroupKey =
  | "vietnam"
  | "laos"
  | "cambodia";

type Group = {
  key: GroupKey;
  label: string;
  count: number;
  description: string;
};

const GROUPS: Group[] = [
  {
    key: "vietnam",
    label: "VIỆT NAM",
    count: 13,
    description: "13 đội trong nước",
  },
  {
    key: "laos",
    label: "LÀO",
    count: 8,
    description: "8 đội tại Lào",
  },
  {
    key: "cambodia",
    label: "CAMPUCHIA",
    count: 11,
    description: "11 đội tại Campuchia",
  },
];

export default function TeamsDotsSection() {
  return (
    <section
      id="teams"
      className={styles.section}
    >
      <div className={styles.inner}>
        {/* =========================================
            TOTAL
        ========================================== */}

        <header className={styles.header}>
          <div className={styles.total}>
            <strong>32</strong>

            <div className={styles.totalCopy}>
              <span>
                ĐỘI TÌM KIẾM,
                QUY TẬP
              </span>

              <p>
                1.559 người
              </p>
            </div>
          </div>
        </header>

        {/* =========================================
            3 KHU VỰC
        ========================================== */}

        <div className={styles.groups}>
          {GROUPS.map((group) => (
            <article
              key={group.key}
              className={styles.group}
            >
              <div className={styles.groupTitle}>
                <span>
                  {group.label}
                </span>

                <div className={styles.number}>
                  <strong>
                    {group.count}
                  </strong>

                  <em>
                    đội
                  </em>
                </div>
              </div>

              <div
                className={styles.dots}
                aria-hidden="true"
              >
                {Array.from(
                  {
                    length:
                      group.count,
                  },
                  (_, index) => (
                    <span
                      key={index}
                      className={`${styles.dot} ${
                        styles[group.key]
                      }`}
                    />
                  )
                )}
              </div>

              <p
                className={
                  styles.description
                }
              >
                {
                  group.description
                }
              </p>
            </article>
          ))}
        </div>

        {/* =========================================
            SUMMARY
        ========================================== */}

        <div className={styles.summary}>
          <span>
            13 đội trong nước
          </span>

          <i />

          <span>
            19 đội ở nước ngoài
          </span>
        </div>
      </div>
    </section>
  );
}