import Image from "next/image";

import styles from "./DnaJourneySection.module.css";

export default function DnaJourneySection() {
  return (
    <section
      id="dna-journey"
      className={styles.section}
    >
      <div className={styles.inner}>
        {/* =========================================
            TITLE
        ========================================== */}

        <header className={styles.header}>
          <span className={styles.kicker}>
            GIÁM ĐỊNH ADN
          </span>

          <h2>
            Những mẫu sinh phẩm
            <br />
            trên hành trình
            <br />
            tìm lại tên tuổi
          </h2>
        </header>

        {/* =========================================
            OPENING
        ========================================== */}

        <div className={styles.opening}>
          <p className={styles.dropCapParagraph}>
            <span
              className={styles.dropCap}
              aria-hidden="true"
            >
              N
            </span>

            <span className={styles.dropCapRest}>
              ếu việc tìm kiếm, quy tập là bước đưa
              các liệt sĩ trở về, thì xác định danh
              tính là hành trình tiếp nối để mỗi
              người được gọi đúng tên, đúng quê
              hương. Trên hành trình ấy, những tiến
              bộ của khoa học và công nghệ đang trở
              thành cầu nối quan trọng giữa các mẫu
              sinh phẩm, dữ liệu giám định và những
              gia đình vẫn ngày đêm mong ngóng.
            </span>
          </p>

          <p>
            Công tác xác định danh tính liệt sĩ đang
            được triển khai đồng thời ở nhiều khâu,
            từ thu thập mẫu hài cốt, lấy mẫu thân
            nhân đến phân tích ADN, lưu trữ và đồng
            bộ dữ liệu. Mỗi công đoạn đều đòi hỏi sự
            phối hợp chặt chẽ giữa các cơ quan, đơn
            vị, bởi phía sau một mẫu sinh phẩm là khả
            năng tìm lại danh tính của một người đã
            hy sinh và lời hồi đáp dành cho gia đình.
          </p>
        </div>

        {/* =========================================
            7.104 MẪU
        ========================================== */}

        <div className={styles.storyBlock}>
          <p>
            Đáng chú ý, ngày 21/8/2026, một khối
            lượng lớn mẫu sinh phẩm hài cốt liệt sĩ
            đã được chuyển từ Thành phố Hồ Chí Minh
            ra Hà Nội để phục vụ giám định ADN. Ban
            Chỉ đạo Thành phố Hồ Chí Minh về tìm
            kiếm, quy tập và xác định danh tính hài
            cốt liệt sĩ phối hợp với các đơn vị thuộc
            Quân chủng Phòng không - Không quân vận
            chuyển{" "}
            <strong>7.104 mẫu sinh phẩm</strong>{" "}
            bằng máy bay vận tải quân sự CASA-295.
          </p>
        </div>

        {/* =========================================
            BIG NUMBER BREAK
        ========================================== */}

        <div
          className={styles.numberBreak}
          aria-label="7.104 mẫu sinh phẩm"
        >
          <strong>
            7.104
          </strong>

          <span>
            mẫu sinh phẩm
          </span>
        </div>

        {/* =========================================
            PACKING / TRANSPORT
        ========================================== */}

        <div className={styles.storyBlock}>
          <p>
            Toàn bộ số mẫu được niêm phong, đóng gói
            trong <strong>100 thùng chuyên dụng</strong>,
            với tổng trọng lượng khoảng{" "}
            <strong>1.300 kg</strong>. Sau khi được
            vận chuyển đến sân bay quân sự Gia Lâm,
            các mẫu được đưa về Trung tâm Giám định
            ADN thuộc Viện Sinh học, Viện Hàn lâm
            Khoa học và Công nghệ Việt Nam để tiếp
            nhận, kiểm tra hồ sơ và triển khai các
            bước chuyên môn.
          </p>

          <p>
            Việc vận chuyển, bàn giao được thực hiện
            chặt chẽ, bảo đảm yêu cầu về quản lý, bảo
            quản và tính toàn vẹn của mẫu trước khi
            đưa vào quy trình giám định. Theo phân
            công tại Quyết định số 51/QĐ-BCĐQG ngày
            31/5/2026 của Ban Chỉ đạo quốc gia về
            tìm kiếm, quy tập và xác định danh tính
            hài cốt liệt sĩ, Viện Hàn lâm Khoa học
            và Công nghệ Việt Nam được giao tiếp
            nhận, giám định ADN mẫu hài cốt liệt sĩ
            của 8 tỉnh, thành phố, trong đó có Thành
            phố Hồ Chí Minh.
          </p>
        </div>

        {/* =========================================
            LAB IMAGE
        ========================================== */}

        <figure className={styles.figure}>
          <div className={styles.imageWrap}>
            <Image
              src="/images/readymag/dna/dna-lab.jpg"
              alt="Kỹ thuật viên Trung tâm Giám định ADN thực hiện giám định mẫu hài cốt liệt sĩ"
              fill
              sizes="(max-width: 800px) 100vw, 1200px"
              className={styles.image}
            />
          </div>

          <figcaption>
            Kỹ thuật viên Trung tâm Giám định ADN
            (Viện Sinh học, Viện Hàn lâm Khoa học và
            Công nghệ Việt Nam) thực hiện giám định
            mẫu hài cốt liệt sĩ. (Ảnh: Trần Hải)
          </figcaption>
        </figure>

        {/* =========================================
            CLOSING
        ========================================== */}

        <div className={styles.closing}>
          <p>
            Việc tiếp nhận hơn 7.000 mẫu sinh phẩm
            cho thấy quy mô ngày càng lớn của công
            tác giám định ADN trong hành trình xác
            định danh tính liệt sĩ. Với năng lực
            chuyên môn và hệ thống kỹ thuật phân tích
            ADN, Viện Sinh học và Trung tâm Giám
            định ADN sẽ triển khai các công đoạn
            chuyên môn đối với số mẫu được bàn giao,
            phục vụ quá trình xác định danh tính.
          </p>
        </div>
      </div>

      {/* ===========================================
          VIDEO PLACEHOLDER

          Sau này chỉ cần thay nội dung bên trong
          bằng <video>, iframe YouTube, Vimeo...
      ============================================ */}

      <div className={styles.videoSection}>
        <div className={styles.videoInner}>
          <div
            id="dna-video-slot"
            className={styles.videoPlaceholder}
          >
            <div className={styles.playIcon}>
              <span />
            </div>

            <div className={styles.videoLabel}>
              <span>
                VIDEO
              </span>

              <p>
                Khu vực chèn video về hành trình
                vận chuyển và giám định mẫu sinh phẩm
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}