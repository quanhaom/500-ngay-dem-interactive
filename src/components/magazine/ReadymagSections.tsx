import Image from "next/image";

import VietnamRemainsMap from "../map/VietnamRemainsMap";

import styles from "./ReadymagSections.module.css";

/* =========================================================
   COVER
========================================================= */

export function ReadymagCover() {
  return (
    <section
      id="cover"
      className={styles.cover}
    >
      <div className={styles.coverMedia}>
        <Image
          src="/images/readymag/cover.jpg"
          alt="Chiến dịch 500 ngày đêm"
          fill
          priority
          sizes="100vw"
          className={styles.coverImage}
        />
      </div>
    </section>
  );
}

/* =========================================================
   INTRO
========================================================= */

export function ReadymagIntro() {
  return (
    <section className={styles.paperSection}>
      <div className={styles.intro}>
        <div className={styles.introInner}>
          <p className={styles.introLead}>
            <span className={styles.intro58}>
              58
            </span>{" "}
            năm sau ngày chiến tranh kết thúc, hành trình
            tìm kiếm những người lính đã hy sinh vẫn tiếp
            diễn trên nhiều vùng đất từng ghi dấu chiến sự.
            Phía sau mỗi phần hài cốt được tìm thấy là một
            câu hỏi chưa có lời đáp: Người nằm lại là ai?
            Quê hương ở đâu? Gia đình nào vẫn đang chờ đợi?
          </p>

          <blockquote className={styles.introQuote}>
            Bởi vậy, hành trình tìm kiếm liệt sĩ không chỉ
            là cuộc trở về với đất mẹ, mà còn là hành trình
            trả lại tên tuổi, quê hương và ký ức cho những
            người đã hy sinh.
          </blockquote>

          <p className={styles.introTail}>
            Trong “Chiến dịch 500 ngày đêm”, hành trình ấy
            đang được đẩy mạnh trên nhiều địa bàn trong và
            ngoài nước. Tính đến ngày 22/8/2026, 1.863 hài
            cốt liệt sĩ đã được tìm kiếm, quy tập. Đằng sau
            con số ấy là những cuộc tìm kiếm âm thầm, những
            ký ức được đánh thức và hy vọng đoàn tụ chưa bao
            giờ tắt.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN NARRATIVE
========================================================= */

export function ReadymagNarrative() {
  return (
    <section
      id="story"
      className={styles.paperSection}
    >
      {/* ===================================================
          SUBTITLE
      ==================================================== */}

      <div className={styles.storySubtitleSection}>
        <div className={styles.storySubtitle}>
          <p>
            <strong>1.863</strong>{" "}
            cuộc trở về từ nhiều địa bàn
          </p>
        </div>
      </div>

      {/* ===================================================
          OPENING
      ==================================================== */}

      <div className={styles.storyOpening}>
        <p>
          Trong khuôn khổ “Chiến dịch 500 ngày đêm”, các lực
          lượng đã tổ chức tìm kiếm, quy tập hài cốt liệt sĩ
          tại nhiều địa bàn trong nước và ở Lào, Campuchia.
          Mỗi khu vực tìm kiếm đều gắn với những trận đánh,
          những dấu tích chiến tranh và những câu chuyện chưa
          được kể hết.
        </p>
      </div>

      {/* ===================================================
          VIỆT NAM
          TEXT LEFT / INTERACTIVE MAP RIGHT
      ==================================================== */}

      <div className={styles.storyMapSection}>
        {/* LEFT */}

        <div className={styles.storyMapCopy}>
          <div className={styles.storyMapBlock}>
            <p>
              Tại Việt Nam, lực lượng chức năng đã triển khai
              tìm kiếm ở nhiều địa bàn từng diễn ra các trận
              đánh ác liệt. Ở Tuyên Quang, các đội tìm kiếm
              phát hiện 5 mộ tập thể, với khoảng 23 hài cốt
              liệt sĩ tại những khu vực như điểm cao 211A,
              685 và 823. Tại Công viên Lê Thị Riêng, Thành
              phố Hồ Chí Minh, 418 hài cốt liệt sĩ đã được
              tìm kiếm, quy tập.
            </p>
          </div>

          <div className={styles.storyMapBlock}>
            <p>
              Những địa điểm khác cũng ghi nhận kết quả tìm
              kiếm đáng chú ý: khu vực Câu Nhi, Quảng Trị
              phát hiện 13 hài cốt; xã Minh Đức, thành phố
              Đồng Nai phát hiện 26 hài cốt; xã Đắk Pé,
              Đắk Lắk phát hiện 10 hài cốt; khu vực đường
              Trường Chinh, Quảng Ngãi phát hiện 4 hài cốt
              liệt sĩ.
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className={styles.storyMapColumn}>
          <div className={styles.storyMapSticky}>
            <div className={styles.storyMapVisual}>
              <VietnamRemainsMap
                embedded
                autoFit
                minimal
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          LÀO + CAMPUCHIA
      ==================================================== */}

      <div className={styles.storyClosing}>
        <div className={styles.foreignStory}>
          <p className={styles.foreignIntro}>
            Ở ngoài nước, các đội tìm kiếm tiếp tục thực hiện
            nhiệm vụ tại Lào và Campuchia - những địa bàn từng
            ghi dấu sự hy sinh của nhiều cán bộ, chiến sĩ Việt
            Nam trong chiến tranh bảo vệ Tổ quốc và làm nhiệm
            vụ quốc tế.
          </p>

          {/* =====================
              LÀO
          ====================== */}

          <figure className={styles.foreignFigure}>
            <div className={styles.foreignImages}>
              <div className={styles.foreignImage}>
                <Image
                  src="/images/readymag/lao-1.jpg"
                  alt="Lực lượng tìm kiếm, quy tập tại Lào"
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>

              <div className={styles.foreignImage}>
                <Image
                  src="/images/readymag/lao-2.jpg"
                  alt="Đưa hài cốt liệt sĩ từ Lào trở về quê hương"
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
            </div>

            <figcaption>
              Lực lượng chức năng vượt qua địa hình rừng núi
              tại Lào để tìm kiếm, đưa hài cốt những người đã
              hy sinh trở về quê hương.
            </figcaption>
          </figure>

          {/* =====================
              CAMPUCHIA
          ====================== */}

          <figure className={styles.foreignFigure}>
            <div className={styles.foreignImages}>
              <div className={styles.foreignImage}>
                <Image
                  src="/images/readymag/cambodia-1.jpg"
                  alt="Đội tìm kiếm, quy tập hài cốt liệt sĩ tại Campuchia"
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>

              <div className={styles.foreignImage}>
                <Image
                  src="/images/readymag/cambodia-2.jpg"
                  alt="Quy tập hài cốt liệt sĩ Việt Nam tại Campuchia"
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
            </div>

            <figcaption>
              Các đội tìm kiếm, quy tập hài cốt liệt sĩ Việt
              Nam thực hiện nhiệm vụ tại những địa bàn từng là
              chiến trường ở Campuchia.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   INFOGRAPHIC
========================================================= */

export function MineClearanceSection() {
  return (
    <section
      id="clearance"
      className={styles.clearanceSection}
    >
      <div className={styles.clearanceInner}>
        <figure className={styles.clearanceImage}>
          <div className={styles.infographicMedia}>
            <Image
              src="/images/readymag/in4.jpg"
              alt="Infographic rà phá bom mìn mở đường cho công tác tìm kiếm"
              fill
              sizes="(max-width: 700px) 100vw, 1100px"
              className={styles.infographicImage}
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

/* =========================================================
   FINAL MAP DIVIDER
========================================================= */

export function FinalMapIntro() {
  return (
    <section
      className={styles.mapDivider}
      aria-hidden="true"
    >
      <div />
    </section>
  );
}

export function MemoryCluesSection() {
  return (
    <section
      id="memory-clues"
      className={styles.memorySection}
    >
      <div className={styles.memoryInner}>
        <h2 className={styles.memoryTitle}>
          Khi ký ức trở thành manh mối
        </h2>

        <p className={styles.memoryIntro}>
          Trong nhiều cuộc tìm kiếm, ký ức của nhân chứng là
          một trong những nguồn thông tin quan trọng giúp thu
          hẹp phạm vi khảo sát. Đó có thể là lời kể của người
          từng chứng kiến trận đánh, người dân sống gần khu vực
          chiến trường hoặc những người từng tham gia chôn cất,
          di chuyển hài cốt trong chiến tranh.
        </p>

        {/* ===================================================
            BLOCK 1
            TEXT LEFT / IMAGE RIGHT
        ==================================================== */}

        <div className={styles.memoryRow}>
          <div className={styles.memoryTextPanel}>
            <div className={styles.memoryOverlay} />

            <div className={styles.memoryTextContent}>
              <span className={styles.memoryAccent} />

              <p>
                Tại Công viên Lê Thị Riêng, Thành phố Hồ Chí
                Minh, hành trình tìm kiếm dấu tích các hố chôn
                tập thể được bắt đầu từ sự kết nối giữa dữ liệu
                lịch sử, hình ảnh tư liệu và lời kể của những
                người từng chứng kiến sự việc.
              </p>
            </div>
          </div>

          <figure className={styles.memoryFigure}>
            <div className={styles.memoryImage}>
              <Image
                src="/images/readymag/le-thi-rieng-search.jpg"
                alt="Khảo sát thực địa tại Công viên Lê Thị Riêng"
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />

              <figcaption
                className={`${styles.imageCaption} ${styles.captionRight}`}
              >
                Các lực lượng chức năng khảo sát thực địa để
                xác định vị trí các hố chôn tập thể tại Công viên
                Lê Thị Riêng.
              </figcaption>
            </div>
          </figure>
        </div>

        {/* ===================================================
            BLOCK 2
            IMAGE LEFT / QUOTE RIGHT
        ==================================================== */}

        <div
          className={`${styles.memoryRow} ${styles.memoryRowReverse}`}
        >
          <figure className={styles.memoryFigure}>
            <div className={styles.memoryPortrait}>
              <Image
                src="/images/readymag/nguyen-thanh-phuoc.jpg"
                alt="Ông Nguyễn Thành Phước"
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />

              <figcaption
                className={`${styles.imageCaption} ${styles.captionLeft}`}
              >
                Ông Nguyễn Thành Phước - một nhân chứng từng
                sinh sống lâu năm tại khu vực.
              </figcaption>
            </div>
          </figure>

          <div className={styles.memoryQuotePanel}>
            <div className={styles.memoryOverlay} />

            <div className={styles.memoryQuoteContent}>
              <span className={styles.quoteMark}>
                “
              </span>

              <blockquote>
                Thay phần này bằng trích đoạn phỏng vấn trực
                tiếp của ông Nguyễn Thành Phước.
              </blockquote>

              <span className={styles.quoteSource}>
                — Nguyễn Thành Phước
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}