/* eslint-disable @next/next/no-img-element */

import SubtitleImage from "./SubtitleImage";

import styles from "./MineClearanceStorySection.module.css";


export default function MineClearanceStorySection() {
  return (
    <section
      id="mine-clearance"
      className={
        styles.section
      }
    >
      <SubtitleImage
        alt="Dọn đường cho những cuộc trở về"
        imagePath="/images/readymag/subtitles/mine-clearance.png"
        maxWidth={1050}
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
              T
            </span>

            rước mỗi cuộc tìm kiếm dưới lòng đất là một nhiệm
            vụ thầm lặng nhưng không kém phần quan trọng: rà
            phá bom mìn, vật nổ còn sót lại sau chiến tranh.
            Đây là điều kiện trực tiếp bảo đảm an toàn cho lực
            lượng tìm kiếm.
          </p>

          <p>
            Đến nay, các lực lượng đã rà phá được
            11.793,6/22.725 ha, đạt 51,9% kế hoạch. Riêng khu
            vực trọng điểm Vị Xuyên đã rà phá được
            4.075,8/4.460 ha, đạt 91,39%.
          </p>

          <p>
            Để thực hiện nhiệm vụ, 360 đội rà phá bom mìn đã
            được huy động, với 5.183 người tham gia. Các lực
            lượng sử dụng 1.311 máy dò cùng nhiều trang thiết
            bị, phương tiện chuyên dụng.
          </p>
        </div>

        <figure
          className={
            styles.infographic
          }
        >
          <img
            src="/images/readymag/in4.jpg"
            alt="Thông tin công tác rà phá bom mìn"
          />
        </figure>

        <div
          className={
            styles.stats
          }
        >
          <div
            className={
              styles.progressItem
            }
          >
            <span>
              TOÀN CHIẾN DỊCH
            </span>

            <strong>
              51,9%
            </strong>

            <p>
              11.793,6 / 22.725 ha
            </p>

            <div
              className={
                styles.track
              }
            >
              <div
                className={
                  styles.fill
                }
                style={{
                  width:
                    "51.9%",
                }}
              />
            </div>
          </div>

          <div
            className={
              styles.progressItem
            }
          >
            <span>
              VỊ XUYÊN
            </span>

            <strong>
              91,39%
            </strong>

            <p>
              4.075,8 / 4.460 ha
            </p>

            <div
              className={
                styles.track
              }
            >
              <div
                className={
                  styles.fill
                }
                style={{
                  width:
                    "91.39%",
                }}
              />
            </div>
          </div>

          <div
            className={
              styles.resources
            }
          >
            <div>
              <strong>
                360
              </strong>

              <span>
                đội rà phá
              </span>
            </div>

            <div>
              <strong>
                1.311
              </strong>

              <span>
                máy dò
              </span>
            </div>

            <div>
              <strong>
                5.183
              </strong>

              <span>
                người tham gia
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            styles.body
          }
        >
          <p>
            Ở nhiều khu vực từng là chiến trường, bom mìn,
            vật nổ có thể nằm lại dưới lớp đất, giữa những
            triền núi hoặc trong các khu rừng đã thay đổi theo
            thời gian. Vì vậy, trước khi tiếp cận khu vực nghi
            có hài cốt, lực lượng chức năng phải tiến hành
            khảo sát, rà phá và kiểm tra an toàn từng bước.
          </p>
        </div>
      </div>
    </section>
  );
}