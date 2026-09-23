/* eslint-disable @next/next/no-img-element */

import SubtitleImage from "./SubtitleImage";

import styles from "./PromiseSection.module.css";


export default function PromiseSection() {
  return (
    <section
      id="promise"
      className={
        styles.section
      }
    >
      {/* ===================================================
          SUBTITLE
      ==================================================== */}

      <SubtitleImage
        alt="Một lời hẹn còn dang dở"
        imagePath="/images/readymag/subtitles/promise.png"
        maxWidth={1050}
      />

      {/* ===================================================
          ARTICLE
      ==================================================== */}

      <div
        className={
          styles.article
        }
      >
        <div
          className={
            styles.body
          }
        >
          <p>
            Với gia đình liệt sĩ Nguyễn Văn Xiêm, sự trở về
            có lẽ đã bắt đầu từ lời hẹn năm nào. Trước lúc
            ra đi, người lính trẻ từng nói với mẹ:
          </p>

          <blockquote
            className={
              styles.promiseQuote
            }
          >
            “Mẹ ơi! Con đi, con sẽ trở về với mẹ và gia đình!”
          </blockquote>

          <p>
            Nhiều năm trôi qua, lời hẹn ấy vẫn ở lại trong
            ký ức của những người thân, cùng nỗi mong ngóng
            chưa có hồi đáp.
          </p>
        </div>
      </div>

      {/* ===================================================
          STICKY STORY
      ==================================================== */}

      <div
        className={
          styles.story
        }
      >
        <div
          className={
            styles.stickyVisual
          }
        >
          <img
            src="/images/readymag/ending/promise-waiting.jpg"
            alt="Gia đình liệt sĩ chờ đợi thông tin về người thân"
            className={
              styles.stickyImage
            }
            draggable={
              false
            }
          />

          <div
            className={
              styles.imageShade
            }
            aria-hidden="true"
          />
        </div>

        <div
          className={
            styles.foreground
          }
        >
          <div
            className={
              styles.imageLead
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.quoteStep
            }
          >
            <div
              className={
                styles.quoteInner
              }
            >
              <blockquote
                className={
                  styles.waitingQuote
                }
              >
                “Gia đình tôi đang ngóng
                <br />
                trông từng giờ, từng ngày”
              </blockquote>

              <p
                className={
                  styles.waitingDescription
                }
              >
                Lời chia sẻ ấy không chỉ là nỗi niềm của
                một gia đình, mà còn gợi lên sự chờ đợi
                kéo dài qua nhiều thế hệ.
              </p>
            </div>
          </div>

          <div
            className={
              styles.afterQuoteSpace
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.yellowPanel
            }
          >
            <div
              className={
                styles.yellowInner
              }
            >
              <div
                className={
                  styles.panelBody
                }
              >
                <p>
                  Trên những vùng đất từng ghi dấu chiến tranh,
                  hành trình ấy vẫn được tiếp nối bằng những
                  công việc âm thầm: một mũi dò đi qua lớp đất,
                  một dấu hiệu được ghi nhận, một mẫu sinh phẩm
                  được nâng niu chuyển đến nơi giám định.
                </p>
              </div>

              <div
                className={
                  styles.endingText
                }
              >
                <p>
                  Chiều buông xuống trên địa bàn tìm kiếm, ánh
                  sáng cuối ngày phủ lên những vạt rừng, những
                  bước chân rời khỏi hiện trường, những thiết
                  bị được xếp lại, nhưng dưới lớp đất kia, câu
                  chuyện về những người đã nằm xuống vẫn chưa
                  khép lại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}