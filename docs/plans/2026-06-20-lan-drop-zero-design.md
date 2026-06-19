# lan-drop-zero Design

## Goal

Build a zero-dependency Node CLI that starts a local web server for trusted LAN file transfer. It should feel like a free, self-hosted AirDrop-style utility.

## Scope

- Browser upload form
- File listing and downloads
- JSON file list endpoint
- Path traversal protection through file-name sanitization
- Node test coverage for listing, upload, and download

## Non-Goals

- Public internet exposure
- Authentication
- End-to-end encryption
- Mobile app packaging

## Verification

Run `npm run check`, then execute through GitHub with `npm exec`.
