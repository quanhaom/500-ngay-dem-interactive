/* eslint-disable @next/next/no-img-element */

import SubtitleImage from "./SubtitleImage";

import styles from "./DnaJourneySection.module.css";


export default function DnaJourneySection() {
  return (
    <section
      id="dna-journey"
      className={
        styles.section
      }
    >
      <SubtitleImage
        alt="Những mẫu sinh phẩm trên hành trình tìm lại tên tuổi"
        imagePath="/images/readymag/subtitles/dna-journey.png"
        maxWidth={1120}
      />

      <div
        className={
          styles.inner
        }
      >
        <div
          className={
            styles.body
          }
        >
          <p
            className={
              styles.dropParagraph
            }
          >
            <span
              className={
                styles.dropCap
              }
            >
              N
            </span>

            ếu việc tìm kiếm, quy tập là bước đưa các liệt
            sĩ trở về, thì xác định danh tính là hành trình
            tiếp nối để mỗi người được gọi đúng tên, đúng quê
            hương. Trên hành trình ấy, những tiến bộ của khoa
            học và công nghệ đang trở thành cầu nối quan trọng.
          </p>

          <p>
            Công tác xác định danh tính liệt sĩ đang được
            triển khai đồng thời ở nhiều khâu, từ thu thập mẫu
            hài cốt, lấy mẫu thân nhân đến phân tích ADN, lưu
            trữ và đồng bộ dữ liệu.
          </p>

          <p>
            Ngày 21/8/2026, 7.104 mẫu sinh phẩm hài cốt liệt
            sĩ được vận chuyển từ Thành phố Hồ Chí Minh ra Hà
            Nội bằng máy bay vận tải quân sự CASA-295 để phục
            vụ công tác giám định ADN.
          </p>
        </div>

        <div
          className={
            styles.videoSection
          }
        >
          <div
            className={
              styles.videoPlaceholder
            }
          >
            <div
              className={
                styles.videoIcon
              }
            >
              <span />
            </div>

            <div
              className={
                styles.videoLabel
              }
            >
              VIDEO GRAPHIC
            </div>

            <p
              className={
                styles.videoHint
              }
            >
              7.104 mẫu sinh phẩm trên hành trình từ
              Thành phố Hồ Chí Minh ra Hà Nội
            </p>
          </div>
        </div>

        <div
          className={
            styles.body
          }
        >
          <p>
            Toàn bộ số mẫu được niêm phong, đóng gói trong
            100 thùng chuyên dụng, với tổng trọng lượng khoảng
            1.300 kg. Sau khi máy bay hạ cánh tại sân bay quân
            sự Gia Lâm, các mẫu được đưa về Trung tâm Giám định
            ADN thuộc Viện Sinh học.
          </p>

          <p>
            Việc vận chuyển, bàn giao được thực hiện chặt chẽ,
            bảo đảm yêu cầu về quản lý, bảo quản và tính toàn
            vẹn của mẫu trước khi đưa vào quy trình giám định.
          </p>
        </div>

        <figure
          className={
            styles.figure
          }
        >
          <img
            src="https://cdn.nhandan.vn/images/-sKnr5TwgX2qCv6f7Q2Evm3vnhvdmT3KILbjs4rok1ejnwvj0Wj3orLSWLodesnQ/dscf3934.jpg.avif"
            alt="Công tác giám định ADN"
            className={
              styles.image
            }
          />
        </figure>

        <div
          className={
            styles.closing
          }
        >
          <p>
            Mỗi mẫu sinh phẩm đi qua nhiều công đoạn trước khi
            có thể tạo ra một kết quả có giá trị đối chiếu.
            Đằng sau quá trình kỹ thuật ấy là mong muốn trả lại
            một cái tên cho người đã khuất.
          </p>
        </div>
      </div>
    </section>
  );
}