import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createDropServer, listFiles } from "../src/server.js";

test("listFiles returns files in the shared directory", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "lan-drop-zero-"));
  await writeFile(path.join(dir, "hello.txt"), "hello", "utf8");
  const files = await listFiles(dir);
  assert.deepEqual(files.map((file) => file.name), ["hello.txt"]);
});

test("server lists, uploads, and downloads files", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "lan-drop-zero-"));
  const server = createDropServer({ rootDir: dir });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.equal(typeof address, "object");
  const base = `http://127.0.0.1:${address.port}`;

  try {
    const form = new FormData();
    form.append("file", new Blob(["uploaded"]), "note.txt");
    const upload = await fetch(`${base}/upload`, { method: "POST", body: form });
    assert.equal(upload.status, 201);
    assert.equal(await readFile(path.join(dir, "note.txt"), "utf8"), "uploaded");

    const list = await fetch(`${base}/api/files`).then((response) => response.json());
    assert.equal(list.files[0].name, "note.txt");

    const download = await fetch(`${base}/download/note.txt`);
    assert.equal(download.status, 200);
    assert.equal(await download.text(), "uploaded");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
