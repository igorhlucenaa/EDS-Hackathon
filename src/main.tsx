import { createRoot } from "react-dom/client";
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
