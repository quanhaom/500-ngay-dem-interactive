import styles from "./MineClearanceStorySection.module.css";

export default function MineClearanceStorySection() {
  return (
    <section
      id="mine-clearance"
      className={styles.section}
    >
      <div className={styles.inner}>
        {/* HEADER */}
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

        {/* OPENING */}
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

        {/* TEXT */}
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

        {/* PHOTO */}
        <figure className={styles.photoFigure}>
          <img
            src="/images/readymag/mine-clearance/mine-clearance-1.jpg"
            alt=""
            className={styles.photo}
            loading="lazy"
          />

          <figcaption className={styles.photoCaption}>
            Lực lượng chức năng thực hiện rà phá bom mìn,
            vật nổ nhằm bảo đảm an toàn cho công tác tìm
            kiếm, quy tập hài cốt liệt sĩ.
          </figcaption>
        </figure>

        {/* STATIC STATS - KHÔNG IMPORT COMPONENT KHÁC */}
        <div className={styles.stats}>
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
                style={{ width: "51.9%" }}
              />
            </div>
          </div>

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
                style={{ width: "91.39%" }}
              />
            </div>
          </div>

          <div className={styles.resources}>
            <div className={styles.resourceItem}>
              <strong>360</strong>
              <span>
                đội rà phá
                <br />
                bom mìn
              </span>
            </div>

            <div className={styles.resourceItem}>
              <strong>1.311</strong>
              <span>
                máy dò & thiết bị
                <br />
                chuyên dụng
              </span>
            </div>

            <div className={styles.resourceItem}>
              <strong>5.183</strong>
              <span>
                người
                <br />
                tham gia
              </span>
            </div>
          </div>
        </div>

        {/* CLOSING */}
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