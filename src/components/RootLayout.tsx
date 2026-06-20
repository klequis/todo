import { MetaProvider, Title } from "@solidjs/meta";
import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

export function RootLayout(props: RouteSectionProps) {
  return (
    <MetaProvider>
      <Title>Todo</Title>
      <div class="app-shell">
        <header class="top-nav">
          <a href="/">Board</a>
          <a href="/about">About</a>
        </header>
        <Suspense>{props.children}</Suspense>
      </div>
    </MetaProvider>
  );
}
