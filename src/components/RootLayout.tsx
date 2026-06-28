import { MetaProvider, Title } from "@solidjs/meta";
import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import styles from "./RootLayout.module.css";

export function RootLayout(props: RouteSectionProps) {
  return (
    <MetaProvider>
      <Title>Todo</Title>
      <div class={styles.appShell}>
        <header class={styles.topNav}>
          <a href="/">Board</a>
          <a href="/agenda">Agenda</a>
        </header>
        <Suspense>{props.children}</Suspense>
      </div>
    </MetaProvider>
  );
}
