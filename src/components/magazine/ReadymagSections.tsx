import Image from "next/image";

import styles from "./ReadymagSections.module.css";

/* =========================================================
   COVER

   cover.jpg đã chứa toàn bộ typography.
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
   INTRO / SAPO

   Không còn:
   - CUỘN TIẾP
   - KHÁM PHÁ 500 NGÀY ĐÊM
   - card/panel
========================================================= */

export function ReadymagIntro() {
  return (
    <section
      className={styles.paperSection}
    >
      <div className={styles.intro}>
        <p>
          58 năm sau ngày chiến tranh kết thúc, hành
          trình tìm kiếm những người lính đã hy sinh
          vẫn tiếp diễn trên nhiều vùng đất từng ghi
          dấu chiến sự. Phía sau mỗi phần hài cốt
          được tìm thấy là một câu hỏi chưa có lời
          đáp: Người nằm lại là ai? Quê hương ở đâu?
          Gia đình nào vẫn đang chờ đợi?
        </p>

        <p>
          Bởi vậy, hành trình tìm kiếm liệt sĩ không
          chỉ là cuộc trở về với đất mẹ, mà còn là
          hành trình trả lại tên tuổi, quê hương và
          ký ức cho những người đã hy sinh.
        </p>

        <p>
          Trong “Chiến dịch 500 ngày đêm”, hành trình
          ấy đang được đẩy mạnh trên nhiều địa bàn
          trong và ngoài nước. Tính đến ngày
          22/8/2026, 1.863 hài cốt liệt sĩ đã được
          tìm kiếm, quy tập. Đằng sau con số ấy là
          những cuộc tìm kiếm âm thầm, những ký ức
          được đánh thức và hy vọng đoàn tụ chưa bao
          giờ tắt.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN NARRATIVE

   Hero đã thay cho heading:
   "1.863 cuộc trở về từ nhiều địa bàn"
========================================================= */

export function ReadymagNarrative() {
  return (
    <section
      id="story"
      className={styles.paperSection}
    >
      <article className={styles.article}>
        <p>
          Trong khuôn khổ “Chiến dịch 500 ngày đêm”,
          các lực lượng đã tổ chức tìm kiếm, quy tập
          hài cốt liệt sĩ tại nhiều địa bàn trong
          nước và ở Lào, Campuchia. Mỗi khu vực tìm
          kiếm đều gắn với những trận đánh, những dấu
          tích chiến tranh và những câu chuyện chưa
          được kể hết.
        </p>

        <p>
          Tại Việt Nam, lực lượng chức năng đã triển
          khai tìm kiếm ở nhiều địa bàn từng diễn ra
          các trận đánh ác liệt. Ở Tuyên Quang, các
          đội tìm kiếm phát hiện 5 mộ tập thể, với
          khoảng 23 hài cốt liệt sĩ tại những khu vực
          như điểm cao 211A, 685 và 823. Tại Công viên
          Lê Thị Riêng, Thành phố Hồ Chí Minh, 418 hài
          cốt liệt sĩ đã được tìm kiếm, quy tập.
        </p>

        <p>
          Những địa điểm khác cũng ghi nhận kết quả
          tìm kiếm đáng chú ý: khu vực Câu Nhi,
          Quảng Trị phát hiện 13 hài cốt; xã Minh Đức,
          thành phố Đồng Nai phát hiện 26 hài cốt;
          xã Đắk Pé, Đắk Lắk phát hiện 10 hài cốt;
          khu vực đường Trường Chinh, Quảng Ngãi phát
          hiện 4 hài cốt liệt sĩ.
        </p>

        <p>
          Ở ngoài nước, các đội tìm kiếm tiếp tục thực
          hiện nhiệm vụ tại Lào và Campuchia - những
          địa bàn từng ghi dấu sự hy sinh của nhiều
          cán bộ, chiến sĩ Việt Nam trong chiến tranh
          bảo vệ Tổ quốc và làm nhiệm vụ quốc tế.
        </p>
      </article>
    </section>
  );
}

/* =========================================================
   INFOGRAPHIC IN4

   in4.jpg đã chứa toàn bộ:
   - heading
   - tỷ lệ
   - số liệu
   - icon
   - text
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
              sizes="(max-width: 700px) 100vw, 1000px"
              className={styles.infographicImage}
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

/* =========================================================
   MAP DIVIDER

   Không còn section giới thiệu dài.
   Chỉ giữ một divider rất nhẹ trước map.
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