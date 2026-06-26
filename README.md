# lan-drop-zero

Send a file from your laptop to your phone without AirDrop pairing, cloud storage, or signing in.

`lan-drop-zero` starts a tiny local upload/download page for devices on the same Wi-Fi. Pick a folder, open the printed URL on another device, and move files directly across your LAN.

Run it in 20 seconds:

```bash
npm exec --yes --package github:ban10yuu/lan-drop-zero#main -- lan-drop-zero --dir ~/Downloads/lan-drop
```

Open the printed URL on another phone, tablet, or computer. Upload files into the shared folder or download files already there.

No cloud. No account. No tracking. No dependencies.

## Why people star it

- Replace "just send this file to my phone" cloud detours with one local command
- Share with Windows, macOS, Linux, iPhone, Android, tablets, and anything with a browser
- Keep private files on your trusted local network instead of uploading them first
- Use a zero-dependency CLI you can read, run, and throw away after the transfer

If this saves you from emailing a file to yourself, star the repo so other local-first tool users can find it.

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

## Share it

Manual launch copy is in [`docs/launch-assets.md`](docs/launch-assets.md). Use it as a starting point for X, LinkedIn, Hacker News, or Reddit. Do not mass-post identical text.

## Verification

```bash
npm run check
```

## License

MIT
