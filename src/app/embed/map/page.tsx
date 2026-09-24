"use client";

import { useEffect } from "react";

import VietnamRemainsMap from "../../../components/map/VietnamRemainsMap";
import styles from "./page.module.css";

export default function EmbeddedMapPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const oldHtmlBackground =
      html.style.background;

    const oldBodyBackground =
      body.style.background;

    const oldHtmlColorScheme =
      html.style.colorScheme;

    html.style.setProperty(
      "background",
      "transparent",
      "important"
    );

    body.style.setProperty(
      "background",
      "transparent",
      "important"
    );

    html.style.colorScheme = "normal";

    return () => {
      html.style.background =
        oldHtmlBackground;

      body.style.background =
        oldBodyBackground;

      html.style.colorScheme =
        oldHtmlColorScheme;
    };
  }, []);

  return (
    <main className={styles.page}>
      <VietnamRemainsMap
        embedded
        autoFit
        minimal
      />
    </main>
  );
}