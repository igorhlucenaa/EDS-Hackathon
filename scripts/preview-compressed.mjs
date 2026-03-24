/**
 * Serve `dist/` com gzip (compressão HTTP), como a maioria dos hosts em produção.
 * O `vite preview` não envia Content-Encoding — o Lighthouse acusa "sem compressão"
 * mesmo com build de produção.
 */
import compression from "compression";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "..", "dist");

const app = express();
app.disable("x-powered-by");
app.use(
  compression({
    threshold: 512,
    level: 6,
  })
);
app.use(
  express.static(dist, {
    index: "index.html",
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);
/** Fallback SPA (Express 5 não aceita path `*` em `app.get`) */
app.use((_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

const port = Number(process.env.PREVIEW_PORT) || 4173;
const host = process.env.PREVIEW_HOST || "127.0.0.1";

app.listen(port, host, () => {
  console.log("");
  console.log(`  Preview com gzip:  http://${host}:${port}/`);
  console.log(`  → Use esta URL no Lighthouse (não use :8080 = dev).`);
  console.log("");
});
