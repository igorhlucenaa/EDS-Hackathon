import { createRoot } from "react-dom/client";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-900.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import App from "./App.tsx";
import "./index.css";
import faviconUrl from "@/assets/esportes-da-sorte-logo.svg?url";

const faviconLink =
  document.querySelector<HTMLLinkElement>("link[rel='icon']") ?? document.createElement("link");
faviconLink.rel = "icon";
faviconLink.type = "image/svg+xml";
faviconLink.href = faviconUrl;
if (!faviconLink.parentNode) document.head.appendChild(faviconLink);

createRoot(document.getElementById("root")!).render(<App />);
