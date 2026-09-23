/* eslint-disable @next/next/no-img-element */

import styles from "./SubtitleImage.module.css";

type SubtitleImageProps = {
  /**
   * Đường dẫn ảnh subtitle trong thư mục public.
   *
   * Ví dụ:
   * /images/readymag/subtitles/memory.png
   */
  imagePath: string;

  /**
   * Alt text của ảnh.
   */
  alt: string;

  /**
   * Chiều rộng tối đa của ảnh.
   */
  maxWidth?: number;

  /**
   * Class custom nếu cần.
   */
  className?: string;
};

export default function SubtitleImage({
  imagePath,
  alt,
  maxWidth = 1100,
  className = "",
}: SubtitleImageProps) {
  return (
    <div
      className={[
        styles.wrapper,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={styles.inner}
        style={{
          maxWidth: `${maxWidth}px`,
        }}
      >
        <img
          src={imagePath}
          alt={alt}
          draggable={false}
          className={styles.image}
        />
      </div>
    </div>
  );
}