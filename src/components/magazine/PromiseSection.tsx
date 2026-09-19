import styles from "./PromiseSection.module.css";

export default function PromiseSection() {
  return (
    <section
      id="promise"
      className={styles.section}
    >
      {/* =====================================================
          OPENING ARTICLE
      ====================================================== */}

      <div className={styles.article}>
        <header className={styles.header}>
          <span className={styles.kicker}>
            MỘT CUỘC TRỞ VỀ CÒN CHỜ ĐỢI
          </span>

          <h2>
            Một lời hẹn
            <br />
            còn dang dở…
          </h2>
        </header>

        <div className={styles.body}>
          <p>
            Với gia đình liệt sĩ Nguyễn Văn Xiêm, sự trở về
            có lẽ đã bắt đầu từ lời hẹn năm nào. Trước lúc
            ra đi, người lính trẻ từng nói với mẹ:
          </p>

          <p className={styles.promiseQuote}>
            “Mẹ ơi! Con đi, con sẽ trở về với mẹ và gia đình!”
          </p>

          <p>
            Nhiều năm trôi qua, lời hẹn ấy vẫn ở lại trong
            ký ức của những người thân, cùng nỗi mong ngóng
            chưa có hồi đáp.
          </p>
        </div>
      </div>

      {/* =====================================================
          IMAGE STORY

          Ảnh là BACKGROUND THẬT của toàn bộ phần này.

          Background đứng yên.
          Quote + article scroll phía trên.
      ====================================================== */}

      <div className={styles.story}>
        {/* ===================================================
            GIAI ĐOẠN 1
            CHỈ NHÌN ẢNH
        ==================================================== */}

        <div
          className={styles.imageOnly}
          aria-hidden="true"
        />

        {/* ===================================================
            GIAI ĐOẠN 2
            QUOTE TRƯỢT QUA ẢNH
        ==================================================== */}

        <div className={styles.quoteScene}>
          <div className={styles.quoteInner}>
            <p className={styles.waitingQuote}>
              “Gia đình tôi đang ngóng
              <br />
              trông từng giờ, từng ngày”
            </p>

            <p className={styles.waitingDescription}>
              lời chia sẻ ấy không chỉ là nỗi niềm của một
              gia đình, mà còn gợi lên sự chờ đợi kéo dài
              qua nhiều thế hệ.
            </p>
          </div>
        </div>

        {/* ===================================================
            GIAI ĐOẠN 3
            QUOTE ĐÃ ĐI QUA
            ẢNH VẪN CÒN ĐỨNG YÊN
        ==================================================== */}

        <div
          className={styles.afterQuote}
          aria-hidden="true"
        />

        {/* ===================================================
            GIAI ĐOẠN 4
            NỘI DUNG VÀNG TRƯỢT LÊN CHE ẢNH
        ==================================================== */}

        <div className={styles.articleOverlay}>
          <div className={styles.overlayInner}>
            <div className={styles.overlayBody}>
              <p>
                Trên những vùng đất từng ghi dấu chiến tranh,
                hành trình ấy vẫn được tiếp nối bằng những công
                việc âm thầm: một mũi dò đi qua lớp đất, một
                dấu hiệu được ghi nhận, một mẫu sinh phẩm được
                nâng niu chuyển đến nơi giám định. Những gì còn
                sót lại của quá khứ, dù chỉ là một dấu vết nhỏ,
                đều có thể trở thành chỉ dẫn cho một cuộc trở về.
              </p>
            </div>

            <div className={styles.endingText}>
              <p>
                Chiều buông xuống trên địa bàn tìm kiếm, ánh
                sáng cuối ngày phủ lên những vạt rừng, những
                bước chân rời khỏi hiện trường, những thiết bị
                được xếp lại, nhưng dưới lớp đất kia, câu
                chuyện về những người đã nằm xuống vẫn chưa
                khép lại. Ở một nơi khác, ánh đèn vẫn còn sáng
                bên những mẫu sinh phẩm chưa có kết quả; trong
                những mái nhà, những gia đình vẫn chờ một tin
                báo, một cái tên, một ngày người thân được gọi
                về đúng với quê hương mình.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}