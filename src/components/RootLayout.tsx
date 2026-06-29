import { MetaProvider, Title } from "@solidjs/meta";
import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import styles from "./RootLayout.module.css";

const dbEnv = import.meta.env.VITE_DB_ENV as string;
if (!dbEnv) throw new Error("VITE_DB_ENV is not set");

export function RootLayout(props: RouteSectionProps) {
  return (
    <MetaProvider>
      <Title>Todo</Title>
      <div class={styles.appShell}>
        <header class={styles.topNav}>
          <a href="/">Board</a>
          <a href="/agenda">Agenda</a>
          <span class={`${styles.dbBadge} ${styles[`dbBadge_${dbEnv}`]}`}>{dbEnv}</span>
        </header>
        <Suspense>{props.children}</Suspense>
      </div>
    </MetaProvider>
  );
}
