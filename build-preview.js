#!/usr/bin/env node
/* Gera a pasta preview/ (sandbox visual "PRÉVIA") a partir dos arquivos reais.
   Copia index.html injetando a fita + seed logo após <body>, e replica
   tema/, atlas.js e manifest.json. Uso: node build-preview.js */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const OUT = path.join(ROOT, "preview");
const BLOCK = fs.readFileSync(path.join(ROOT, ".build", "preview_block.html"), "utf8").trimEnd() + "\n";

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "tema"), { recursive: true });

// index.html: injeta o bloco logo após a primeira tag <body...>
let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
// remove qualquer fita/seed já injetada (idempotente)
html = html.replace(/<div id="preview-ribbon"[\s\S]*?<\/script>\n?/g, "");
html = html.replace(/(<body[^>]*>)/i, (m) => m + "\n" + BLOCK);
fs.writeFileSync(path.join(OUT, "index.html"), html);

// assets estáticos
for (const f of ["atlas.js", "manifest.json"]) {
  if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
}
for (const f of fs.readdirSync(path.join(ROOT, "tema"))) {
  fs.copyFileSync(path.join(ROOT, "tema", f), path.join(OUT, "tema", f));
}

const kb = Math.round(fs.statSync(path.join(OUT, "index.html")).size / 1024);
console.log("preview/ gerado. index.html:", kb + "KB");
