import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./styles/app.css";
import "./styles/variables.css";
import { RootLayout } from "~/components/RootLayout";

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  );
}
