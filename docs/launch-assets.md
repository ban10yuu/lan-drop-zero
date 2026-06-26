# Launch Assets

Use these manually. Do not mass-post, auto-post, or repeat identical text across accounts. Before posting, run the command once and mention the device pair you tested.

## GitHub Description

Move files between devices on the same Wi-Fi with one local command. No cloud or account.

## One-Liner

`lan-drop-zero` starts a local upload/download page so any phone, tablet, or computer on your Wi-Fi can move files through one folder.

## Best Manual Channels

- X: local-first tools, indie hackers, Mac/Windows/Linux utility accounts
- LinkedIn: privacy-conscious operators and small teams that pass files between devices
- Hacker News: lead with "no cloud account for a simple LAN transfer"
- Reddit: relevant local-network, self-hosted, or productivity threads only; check rules before linking

## X Drafts

### Draft 1

I got tired of using cloud storage for a file that was already in the same room.

`lan-drop-zero` starts a tiny local drop page:

```bash
npm exec --yes --package github:ban10yuu/lan-drop-zero#main -- lan-drop-zero --dir ~/Downloads/lan-drop
```

Open the printed URL on your phone or another laptop. Upload/download over LAN.

No cloud. No account.

https://github.com/ban10yuu/lan-drop-zero

### Draft 2

AirDrop is great when it works. When it does not, I still want the boring version:

one folder
one local URL
any device with a browser

So I made `lan-drop-zero`, a zero-dependency LAN file drop CLI.

https://github.com/ban10yuu/lan-drop-zero

### Draft 3

New small OSS tool:

`lan-drop-zero` lets devices on the same Wi-Fi exchange files through a local web page.

Useful for:
- Mac to Android
- Windows to iPhone
- tablet to laptop
- temporary team file drops

No SaaS detour for a file that never needed to leave the room.

https://github.com/ban10yuu/lan-drop-zero

## LinkedIn Draft

Simple file transfer still gets weirdly complicated.

If a file is on my laptop and I need it on a phone or another machine next to me, I should not have to upload it to a cloud account first.

I made a small open-source CLI called `lan-drop-zero`.

It starts a local upload/download page for devices on the same Wi-Fi:

```bash
npm exec --yes --package github:ban10yuu/lan-drop-zero#main -- lan-drop-zero --dir ~/Downloads/lan-drop
```

Open the printed URL on the other device, move the file, stop the process.

No cloud. No account. No tracking. No dependency pile.

GitHub: https://github.com/ban10yuu/lan-drop-zero

## Hacker News / Reddit Title Ideas

- Show HN: lan-drop-zero, a local Wi-Fi file drop with no cloud account
- I built a tiny LAN file drop for phones and laptops on the same Wi-Fi
- Move files across your LAN with one local command

## Comment Reply Angles

- This is for trusted local networks, not public internet exposure.
- The boring use case is the point: quick file movement without a cloud detour.
- It works across device types because the other side only needs a browser.

## Short Reply For Comments

The goal is the boring fallback: one local URL, one shared folder, and no cloud account when two devices are already on the same Wi-Fi.
