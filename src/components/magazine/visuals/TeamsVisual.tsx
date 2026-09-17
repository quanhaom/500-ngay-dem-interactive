"use client";

import {
  CSSProperties,
} from "react";

import styles from "../PhaseTwo.module.css";

type NodeStyle =
  CSSProperties &
  Record<
    "--delay",
    string
  >;

type Group =
  | "domestic"
  | "laos"
  | "cambodia";

interface TeamNode {
  id: number;
  group: Group;
  x: number;
  y: number;
}

function buildNodes(): TeamNode[] {
  const nodes:
    TeamNode[] = [];

  for (
    let index = 0;
    index < 32;
    index++
  ) {
    let group:
      Group;

    let local:
      number;

    let count:
      number;

    let center:
      number;

    if (
      index < 13
    ) {
      group =
        "domestic";

      local =
        index;

      count =
        13;

      center =
        180;
    } else if (
      index < 21
    ) {
      group =
        "laos";

      local =
        index - 13;

      count =
        8;

      center =
        450;
    } else {
      group =
        "cambodia";

      local =
        index - 21;

      count =
        11;

      center =
        720;
    }

    const columns =
      Math.ceil(
        Math.sqrt(
          count
        )
      );

    const column =
      local %
      columns;

    const row =
      Math.floor(
        local /
          columns
      );

    nodes.push({
      id: index,

      group,

      x:
        center +
        (
          column -
          (
            columns -
            1
          ) /
            2
        ) *
          42,

      y:
        155 +
        row *
          48,
    });
  }

  return nodes;
}

const nodes =
  buildNodes();

export default function TeamsVisual({
  active,
}: {
  active: boolean;
}) {
  return (
    <div
      className={`${styles.teamsVisual} ${
        active
          ? styles.teamsVisualActive
          : ""
      }`}
    >
      <svg
        viewBox="0 0 900 420"
        role="img"
        aria-label="32 đội tìm kiếm, quy tập"
      >
        <defs>
          <linearGradient
            id="teamFade"
            x1="0"
            x2="1"
          >
            <stop
              offset="0%"
              stopColor="currentColor"
              stopOpacity="0"
            />

            <stop
              offset="50%"
              stopColor="currentColor"
              stopOpacity=".35"
            />

            <stop
              offset="100%"
              stopColor="currentColor"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          className={
            styles.contourPath
          }
          d="
            M20 105
            C130 20 220 170 335 92
            S550 24 650 110
            S800 185 885 82
          "
        />

        <path
          className={
            styles.contourPath
          }
          d="
            M0 235
            C120 145 210 300 350 205
            S565 140 675 225
            S820 305 900 205
          "
        />

        <path
          className={
            styles.contourPath
          }
          d="
            M10 350
            C150 275 235 405 360 330
            S580 255 700 340
            S825 390 900 320
          "
        />

        <line
          x1="310"
          y1="80"
          x2="310"
          y2="355"
          className={
            styles.teamDivider
          }
        />

        <line
          x1="590"
          y1="80"
          x2="590"
          y2="355"
          className={
            styles.teamDivider
          }
        />

        {nodes.map(
          (node) => (
            <g
              key={
                node.id
              }
              className={`${styles.teamNode} ${
                styles[
                  `teamNode_${node.group}`
                ]
              }`}
              style={
                {
                  "--delay":
                    `${
                      node.id *
                      28
                    }ms`,
                } as NodeStyle
              }
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle
                r="15"
                className={
                  styles.teamPulse
                }
              />

              <circle
                r="4.5"
                className={
                  styles.teamCore
                }
              />
            </g>
          )
        )}
      </svg>

      <div
        className={
          styles.teamGroupLabels
        }
      >
        <div>
          <strong>
            13
          </strong>

          <span>
            trong nước
          </span>
        </div>

        <div>
          <strong>
            8
          </strong>

          <span>
            tại Lào
          </span>
        </div>

        <div>
          <strong>
            11
          </strong>

          <span>
            tại Campuchia
          </span>
        </div>
      </div>
    </div>
  );
}