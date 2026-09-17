"use client";

import styles from "../PhaseTwo.module.css";

export default function DNAVisual({
  step,
}: {
  step: number;
}) {
  return (
    <div
      className={
        styles.dnaVisual
      }
      data-step={
        step
      }
    >
      <svg
        viewBox="0 0 900 420"
        aria-hidden="true"
      >
        <path
          id="dnaPathA"
          className={
            styles.dnaStrand
          }
          d="
            M20 210
            C100 45 190 375 280 210
            S460 45 550 210
            S730 375 880 210
          "
        />

        <path
          id="dnaPathB"
          className={`${styles.dnaStrand} ${styles.dnaStrandSecondary}`}
          d="
            M20 210
            C100 375 190 45 280 210
            S460 375 550 210
            S730 45 880 210
          "
        />

        {[
          75,
          150,
          225,
          300,
          375,
          450,
          525,
          600,
          675,
          750,
          825,
        ].map(
          (
            x,
            index
          ) => (
            <line
              key={x}
              x1={x}
              y1={
                index %
                    2 ===
                  0
                  ? 135
                  : 180
              }
              x2={x}
              y2={
                index %
                    2 ===
                  0
                  ? 285
                  : 240
              }
              className={
                styles.dnaBridge
              }
            />
          )
        )}

        <circle
          r="5"
          className={
            styles.dnaParticle
          }
        >
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="
              M20 210
              C100 45 190 375 280 210
              S460 45 550 210
              S730 375 880 210
            "
          />
        </circle>

        <circle
          r="3.5"
          className={
            styles.dnaParticleSecondary
          }
        >
          <animateMotion
            dur="7s"
            begin="-2s"
            repeatCount="indefinite"
            path="
              M20 210
              C100 375 190 45 280 210
              S460 375 550 210
              S730 45 880 210
            "
          />
        </circle>
      </svg>

      <div
        className={
          styles.dnaScanLine
        }
      />
    </div>
  );
}