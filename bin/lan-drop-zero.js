#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createDropServer } from "../src/server.js";

const help = `lan-drop-zero

Move files between devices on the same Wi-Fi with one local command.

Usage:
  lan-drop-zero [serve] [--dir ./dropbox] [--host 0.0.0.0] [--port 8741]
  lan-drop-zero --help
  lan-drop-zero --version
`;

async function main(args = process.argv.slice(2)) {
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(help);
    return 0;
  }
  if (args.includes("--version") || args.includes("-v")) {
    process.stdout.write("0.1.0\n");
    return 0;
  }

  const shareDir = path.resolve(valueOf(args, "--dir") ?? "./lan-drop");
  const host = valueOf(args, "--host") ?? "0.0.0.0";
  const port = Number(valueOf(args, "--port") ?? "8741");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    process.stderr.write("Invalid --port. Use a number between 1 and 65535.\n");
    return 1;
  }

  await mkdir(shareDir, { recursive: true });
  const server = createDropServer({ rootDir: shareDir });
  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address ? address.port : port;
    process.stdout.write(`Sharing: ${shareDir}\n`);
    process.stdout.write(`Local:   http://127.0.0.1:${actualPort}\n`);
    for (const url of lanUrls(actualPort)) {
      process.stdout.write(`LAN:     ${url}\n`);
    }
    process.stdout.write("Press Ctrl+C to stop.\n");
  });

  return new Promise((resolve) => {
    server.on("close", () => resolve(0));
  });
}

function valueOf(args, flag) {
  const equal = args.find((arg) => arg.startsWith(`${flag}=`));
  if (equal) return equal.slice(flag.length + 1);
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  const value = args[index + 1];
  return value && !value.startsWith("-") ? value : undefined;
}

function lanUrls(port) {
  const urls = [];
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        urls.push(`http://${net.address}:${port}`);
      }
    }
  }
  return urls;
}

main().then((code) => {
  process.exitCode = code;
}).catch((error) => {
  process.stderr.write(`lan-drop-zero failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
