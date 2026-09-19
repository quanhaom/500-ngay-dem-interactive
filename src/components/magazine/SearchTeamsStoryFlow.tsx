import Image from "next/image";
import type { ReactNode } from "react";

import styles from "./SearchTeamsStoryFlow.module.css";

type SearchTeamsStoryFlowProps = {
  children?: ReactNode;
};

export default function SearchTeamsStoryFlow({
  children,
}: SearchTeamsStoryFlowProps) {
  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        <div className={styles.backgroundWrap}>
          <Image
            src="/images/readymag/teams/teams-background.jpg"
            alt="Bối cảnh các lực lượng thực hiện nhiệm vụ tìm kiếm, quy tập"
            fill
            sizes="100vw"
            className={styles.backgroundImage}
          />

          <div className={styles.backgroundShade} />
        </div>
      </div>

      <div className={styles.flow}>
        <div className={styles.panel}>
          <p>
            Với những người trực tiếp làm nhiệm vụ, mỗi ngày trên thực địa
            thường bắt đầu từ rất sớm và kết thúc khi điều kiện ánh sáng, thời
            tiết hoặc địa hình không còn cho phép tiếp tục. Phía trước họ có
            thể là một khu rừng rộng, một sườn đồi bị xói lở hoặc một khu vực đã
            có nhiều thay đổi sau chiến tranh.
          </p>

          <p>
            Để thực hiện nhiệm vụ, các lực lượng đã thành lập 32 đội tìm kiếm,
            quy tập với 1.559 cán bộ, chiến sĩ, nhân viên chuyên môn. Trong đó
            có 13 đội thực hiện nhiệm vụ tại các địa bàn trong nước và 19 đội
            làm nhiệm vụ ở nước ngoài, gồm 8 đội tại Lào và 11 đội tại Campuchia.
          </p>

          <p>
            Các đội tìm kiếm phải hoạt động trong điều kiện địa hình phức tạp,
            thời tiết khắc nghiệt, nhiều khu vực còn tiềm ẩn nguy cơ bom mìn,
            vật nổ. Công việc đòi hỏi sự phối hợp giữa lực lượng quân đội, chính
            quyền địa phương, cơ quan chuyên môn, nhân chứng và người dân.
          </p>
        </div>

        {children ? <div className={styles.childrenWrap}>{children}</div> : null}

        <div className={styles.closingText}>
          <p>
            Từ khi chiến dịch được triển khai, 16 lễ truy điệu và an táng hài
            cốt liệt sĩ đã được tổ chức. Trong đó, 850 hài cốt liệt sĩ được tìm
            kiếm, quy tập tại Campuchia đã được đưa về nước.
          </p>

          <p>
            Mỗi cuộc tìm kiếm vì thế không chỉ là hành trình vượt qua địa hình
            và thời gian, mà còn là hành trình đưa những người đã hy sinh đến
            gần hơn với ngày trở về. Đằng sau mỗi phần hài cốt được tìm thấy là
            sự tiếp nối của ký ức, trách nhiệm và niềm mong mỏi đoàn tụ.
          </p>
        </div>
      </div>
    </section>
  );
}