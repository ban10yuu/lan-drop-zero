import { createReadStream } from "node:fs";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

export function createDropServer({ rootDir }) {
  const root = path.resolve(rootDir);

  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      if (request.method === "GET" && url.pathname === "/") {
        return send(response, 200, renderHome(await listFiles(root)), "text/html; charset=utf-8");
      }
      if (request.method === "GET" && url.pathname === "/api/files") {
        return sendJson(response, 200, { files: await listFiles(root) });
      }
      if (request.method === "GET" && url.pathname.startsWith("/download/")) {
        return downloadFile(root, decodeURIComponent(url.pathname.slice("/download/".length)), response);
      }
      if (request.method === "POST" && url.pathname === "/upload") {
        const saved = await handleUpload(root, request);
        return sendJson(response, 201, { saved });
      }
      return send(response, 404, "Not found\n", "text/plain; charset=utf-8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return sendJson(response, 500, { error: message });
    }
  });
}

export async function listFiles(root) {
  await mkdir(root, { recursive: true });
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(root, entry.name);
    const info = await stat(filePath);
    files.push({
      name: entry.name,
      bytes: info.size,
      modifiedAt: info.mtime.toISOString(),
    });
  }
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

export async function handleUpload(root, request) {
  const contentType = request.headers["content-type"] ?? "";
  const boundary = /boundary=([^;]+)/i.exec(contentType)?.[1];
  if (!boundary) throw new Error("Expected multipart/form-data upload.");

  const body = await readRequest(request);
  const parts = splitMultipart(body, boundary);
  const saved = [];
  await mkdir(root, { recursive: true });

  for (const part of parts) {
    const { headers, payload } = parsePart(part);
    const disposition = headers["content-disposition"] ?? "";
    const filename = /filename="([^"]+)"/i.exec(disposition)?.[1];
    if (!filename) continue;
    const safeName = sanitizeName(filename);
    if (!safeName) continue;
    await writeFile(path.join(root, safeName), payload);
    saved.push(safeName);
  }
  return saved;
}

async function downloadFile(root, requestedName, response) {
  const safeName = sanitizeName(requestedName);
  if (!safeName) return send(response, 400, "Invalid file name\n", "text/plain; charset=utf-8");
  const filePath = path.resolve(root, safeName);
  if (!filePath.startsWith(path.resolve(root) + path.sep)) {
    return send(response, 403, "Forbidden\n", "text/plain; charset=utf-8");
  }
  const info = await stat(filePath);
  response.writeHead(200, {
    "content-type": "application/octet-stream",
    "content-length": info.size,
    "content-disposition": `attachment; filename="${encodeURIComponent(safeName)}"`,
  });
  createReadStream(filePath).pipe(response);
}

function renderHome(files) {
  const rows = files.map((file) => `<li><a href="/download/${encodeURIComponent(file.name)}">${escapeHtml(file.name)}</a> <span>${file.bytes} bytes</span></li>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>lan-drop-zero</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 20px; color: #101820; }
    form, ul { border: 1px solid #d7dde5; padding: 16px; border-radius: 8px; }
    button { padding: 8px 12px; font-weight: 700; }
    li { margin: 8px 0; }
    span { color: #667085; }
  </style>
</head>
<body>
  <h1>lan-drop-zero</h1>
  <p>Upload or download files on this local network. Files never leave this machine except through this server.</p>
  <form method="post" action="/upload" enctype="multipart/form-data">
    <input name="file" type="file" multiple>
    <button type="submit">Upload</button>
  </form>
  <h2>Files</h2>
  <ul>${rows || "<li>No files yet.</li>"}</ul>
</body>
</html>`;
}

function splitMultipart(body, boundary) {
  const marker = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = body.indexOf(marker);
  while (start !== -1) {
    start += marker.length;
    if (body[start] === 45 && body[start + 1] === 45) break;
    if (body[start] === 13 && body[start + 1] === 10) start += 2;
    const next = body.indexOf(marker, start);
    if (next === -1) break;
    let end = next;
    if (body[end - 2] === 13 && body[end - 1] === 10) end -= 2;
    parts.push(body.subarray(start, end));
    start = next;
  }
  return parts;
}

function parsePart(part) {
  const split = part.indexOf(Buffer.from("\r\n\r\n"));
  if (split === -1) return { headers: {}, payload: Buffer.alloc(0) };
  const headerText = part.subarray(0, split).toString("utf8");
  const payload = part.subarray(split + 4);
  const headers = {};
  for (const line of headerText.split("\r\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    headers[line.slice(0, index).toLowerCase()] = line.slice(index + 1).trim();
  }
  return { headers, payload };
}

function sanitizeName(name) {
  return path.basename(name).replace(/[^\w.\-() ]+/g, "_").trim();
}

function readRequest(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function sendJson(response, status, value) {
  return send(response, status, JSON.stringify(value, null, 2) + "\n", "application/json; charset=utf-8");
}

function send(response, status, body, contentType) {
  response.writeHead(status, { "content-type": contentType });
  response.end(body);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}
