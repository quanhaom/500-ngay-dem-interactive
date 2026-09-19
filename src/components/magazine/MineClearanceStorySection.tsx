import styles from "./MineClearanceStorySection.module.css";

export default function MineClearanceStorySection() {
  return (
    <section
      id="mine-clearance"
      className={styles.section}
    >
      <div className={styles.inner}>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className={styles.header}>
          <span className={styles.kicker}>
            RÀ PHÁ BOM MÌN
          </span>

          <h2>
            Dọn đường cho
            <br />
            những cuộc trở về
          </h2>
        </header>

        {/* =====================================================
            OPENING
        ====================================================== */}

        <div className={styles.opening}>
          <p className={styles.dropCapParagraph}>
            <span
              className={styles.dropCap}
              aria-hidden="true"
            >
              T
            </span>

            rước mỗi cuộc tìm kiếm dưới lòng đất là một
            nhiệm vụ thầm lặng nhưng không kém phần quan
            trọng: rà phá bom mìn, vật nổ còn sót lại sau
            chiến tranh. Đây là điều kiện trực tiếp bảo đảm
            an toàn cho lực lượng tìm kiếm, đồng thời mở
            đường để những khu vực từng bị chiến tranh chia
            cắt tiếp tục được khảo sát.
          </p>
        </div>

        {/* =====================================================
            PARAGRAPH 02
        ====================================================== */}

        <div className={styles.bodyText}>
          <p>
            Đến nay, các lực lượng đã rà phá được
            11.793,6/22.725 ha, đạt 51,9% kế hoạch. Riêng
            khu vực trọng điểm Vị Xuyên, thuộc địa bàn
            Tuyên Quang, đã rà phá được 4.075,8/4.460 ha,
            đạt 91,39%. Những con số này phản ánh khối
            lượng công việc lớn đang được triển khai tại
            các địa bàn từng diễn ra chiến sự ác liệt.
          </p>
        </div>

        {/* =====================================================
            PARAGRAPH 03
        ====================================================== */}

        <div className={styles.bodyText}>
          <p>
            Để thực hiện nhiệm vụ, 360 đội rà phá bom mìn
            đã được huy động, với 5.183 người tham gia. Các
            lực lượng sử dụng 1.311 máy dò cùng nhiều trang
            thiết bị, phương tiện chuyên dụng, phục vụ quá
            trình khảo sát, phát hiện và xử lý các nguy cơ
            còn tiềm ẩn.
          </p>
        </div>

        {/* =====================================================
            IN4 IMAGE
            Đặt ngay trước stats
        ====================================================== */}

        <figure className={styles.infographicFigure}>
          <img
            src="/images/readymag/in4.jpg"
            alt="Thông tin về công tác rà phá bom mìn phục vụ tìm kiếm, quy tập hài cốt liệt sĩ"
            className={styles.infographicImage}
            loading="lazy"
          />
        </figure>

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className={styles.stats}>
          {/* ===========================
              PROGRESS 01
          ============================ */}

          <div className={styles.progressBlock}>
            <span className={styles.statsLabel}>
              TOÀN CHIẾN DỊCH
            </span>

            <strong className={styles.percent}>
              51,9%
            </strong>

            <p className={styles.statsSub}>
              11.793,6 / 22.725 ha
            </p>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{
                  width: "51.9%",
                }}
              />
            </div>

            <div className={styles.progressNumbers}>
              <span>0</span>

              <span>22.725 ha</span>
            </div>
          </div>

          {/* ===========================
              PROGRESS 02
          ============================ */}

          <div className={styles.progressBlock}>
            <span className={styles.statsLabel}>
              VÙNG LÕI VỊ XUYÊN · TUYÊN QUANG
            </span>

            <strong className={styles.percent}>
              91,39%
            </strong>

            <p className={styles.statsSub}>
              4.075,8 / 4.460 ha
            </p>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{
                  width: "91.39%",
                }}
              />
            </div>

            <div className={styles.progressNumbers}>
              <span>0</span>

              <span>4.460 ha</span>
            </div>
          </div>

          {/* ===========================
              RESOURCES
          ============================ */}

          <div className={styles.resources}>
            <div className={styles.resourcesHeader}>
              NGUỒN LỰC TRIỂN KHAI
            </div>

            <div className={styles.resourceGrid}>
              {/* TEAMS */}

              <div className={styles.resourceItem}>
                <div className={styles.iconWrap}>
                  <svg
                    viewBox="0 0 64 64"
                    className={styles.icon}
                    aria-hidden="true"
                  >
                    <circle
                      cx="22"
                      cy="20"
                      r="7"
                    />

                    <circle
                      cx="42"
                      cy="20"
                      r="7"
                    />

                    <path d="M8 49c1-10 7-16 14-16s13 6 14 16" />

                    <path d="M28 49c1-10 7-16 14-16s13 6 14 16" />
                  </svg>
                </div>

                <strong>
                  360
                </strong>

                <p>
                  đội rà phá
                  <br />
                  bom mìn
                </p>
              </div>

              {/* DETECTORS */}

              <div className={styles.resourceItem}>
                <div className={styles.iconWrap}>
                  <svg
                    viewBox="0 0 64 64"
                    className={styles.icon}
                    aria-hidden="true"
                  >
                    <path d="M22 9l12 12" />

                    <path d="M34 21l-4 4" />

                    <path d="M30 25l14 14" />

                    <ellipse
                      cx="47"
                      cy="45"
                      rx="11"
                      ry="6"
                    />

                    <path d="M18 13l7-7" />

                    <path d="M15 16l6-6" />
                  </svg>
                </div>

                <strong>
                  1.311
                </strong>

                <p>
                  máy dò & thiết bị
                  <br />
                  chuyên dụng
                </p>
              </div>

              {/* PERSONNEL */}

              <div className={styles.resourceItem}>
                <div className={styles.iconWrap}>
                  <svg
                    viewBox="0 0 64 64"
                    className={styles.icon}
                    aria-hidden="true"
                  >
                    <circle
                      cx="32"
                      cy="18"
                      r="9"
                    />

                    <path d="M14 53c2-14 9-22 18-22s16 8 18 22" />

                    <path d="M8 47c1-9 5-15 11-18" />

                    <path d="M56 47c-1-9-5-15-11-18" />
                  </svg>
                </div>

                <strong>
                  5.183
                </strong>

                <p>
                  người
                  <br />
                  tham gia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CLOSING
        ====================================================== */}

        <div className={styles.closing}>
          <p>
            Ở nhiều khu vực từng là chiến trường, bom mìn,
            vật nổ có thể nằm lại dưới lớp đất, giữa những
            triền núi hoặc trong các khu rừng đã thay đổi
            theo thời gian. Vì vậy, trước khi tiếp cận khu
            vực nghi có hài cốt, lực lượng chức năng phải
            tiến hành khảo sát, rà phá và kiểm tra an toàn
            từng bước.
          </p>
        </div>
      </div>
    </section>
  );
}