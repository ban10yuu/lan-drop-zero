# lan-drop-zero

AirDrop-style local file drop for any device on your LAN.

```bash
npm exec --yes --package github:ban10yuu/lan-drop-zero#main -- lan-drop-zero --dir ~/Downloads/lan-drop
```

Open the printed URL on another phone, tablet, or computer. Upload files into the shared folder or download files already there.

No cloud. No account. No tracking. No dependencies.

## Why this exists

File transfer should not require a SaaS login, a USB cable, or uploading private files to someone else's server. `lan-drop-zero` starts a tiny local web server for one job: move files between devices you already trust on the same network.

## Usage

```bash
lan-drop-zero --dir ./dropbox --port 8741
lan-drop-zero serve --dir ./dropbox --host 0.0.0.0 --port 8741
```

Options:

- `--dir <path>`: folder to share and receive uploads
- `--host <host>`: bind address, default `0.0.0.0`
- `--port <port>`: port, default `8741`

## API

```text
GET  /             browser UI
GET  /api/files    JSON file list
GET  /download/:file
POST /upload       multipart file upload
```

## Security Notes

This is for trusted local networks. Do not expose it to the public internet. Downloads are restricted to the configured folder, and uploads are saved with sanitized file names.

## Verification

```bash
npm run check
```

## License

MIT
