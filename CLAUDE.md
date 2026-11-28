# SoulHauss website: how to work on it

You look after this website with Shannon, the founder of SoulHauss. She is not a developer. Make the change she asks for, show her what changed and explain it in plain words. When you need her to do something, tell her exactly what to click, one step at a time. Never ask her for a password.

## What SoulHauss is

A community-led wellbeing hub in Leeds. We run Soulcials: creative Sunday afternoons for women and trans women aged 18 and over, with a guest-led session, a free hot drink and small gifts to take home. They are social battery friendly: nobody has to socialise in any particular way. Contact: connect@soulhauss.com. Instagram @soulhauss_. TikTok @soulhauss. Tickets are sold through Ticket Tailor.

## How we sound

Warm, northern, direct. Short sentences. Phrases that are ours: "youth club for grown ups", "social battery friendly", "no fluff", "come as you are", "fills your cup", "a brew", "hey loves". UK spelling. No jargon and no wellness cliches. No long dashes.

## Rules you must keep

- Never invent facts, dates, prices, quotes, reviews, guest names or statistics. If something is missing, ask.
- Never name or show a person without Shannon's word that they agreed.
- Do not add tracking, pop-ups or anything that collects personal details unless she asks, and tell her what consent wording it needs.
- Every picture needs a short description for people who cannot see it. Text must stay easy to read against its background.
- Most visitors are on a phone. Check every change at phone width first, then laptop.
- Show the change and get a yes before anything is published.
- Keep the "Preview" label and the hidden-from-search setting until she says the site is live.

## How it looks

- Colours: cream paper #F3EFDD, sand #EBD3A4, sage #B9BC8F, deep sage #7C8450, olive #3A3D1F, ink #2A2413, amber #D08838, gold #E9B454, burnt orange #BF4317 (the one colour that pops), wine #4E1D18.
- Type: Playfair Display for headings with one italic phrase in burnt orange, Jost for reading, Caveat only for small handwritten touches.
- The feel: calm, artistic, handmade. Cut-paper edges between sections, a gold sun with fine rays, the eight-point star as our mark, drawn women each in her own light. No stock photos, no clip art, no generic icons.
- Movement is gentle and never in the way of reading.
- The front door (knock twice to come in) is the signature of the site. Do not remove it or shorten it. It must work with one finger on a phone, and it has a gentler version for people who switch on Reduce Motion.

## Where things live

This is plain HTML, CSS and JavaScript. There is no build step and there are no libraries. Keep it that way.

- `index.html`: all the words and sections.
- `css/style.css`: colours, type and layout.
- `js/art.js`: the drawings (the women, the sun, the stars).
- `js/main.js`: the front door, the social battery circles and movement.
- `img/`: photos, the logo, the share picture (`og.jpg`) and the Cosy Club drawing (`cosy-club.svg`).
- `tools/draw_venue.py`: the script that draws the Cosy Club picture. Run it as `python3 tools/draw_venue.py img/cosy-club.svg`. A new venue needs a new drawing, traced from a photo of that venue.

## How to make a change

1. Make the change in this folder.
2. Show it. Serve the folder on this computer (for example `python3 -m http.server 8811`) and open it at phone width, about 390 pixels, then at laptop width. The page opens behind the front door. Add `#hero-h` to the end of the address to skip the door while checking, or `?calm` to see the Reduce Motion version.
3. Say what changed in plain words and wait for a yes.
4. Publish: commit to `main` with a message in plain words and push. GitHub Pages puts it live in about a minute. Open the live address and confirm the change is there.
5. To undo, revert that commit and push. Never force push.

After any change to the door or to `js/main.js`, test the door: two knocks open it, one knock opens it after a pause, and the `?calm` version still opens.

## When Shannon gives you a new Soulcial

Change every place the date, time, venue, guest and price appear: the "next Soulcial" card at the top, the guest cards, the questions section, the tickets panel, the bar at the bottom of the phone screen and the event details for Google in the page head. Add a new guest card and mark it "Next up". Then list what you changed.

## Still to confirm with Shannon

These were written or chosen before she had seen the site. Ask her about each one before the site goes live.

- "A note from Shannon" is a draft made from her public posts. It needs her own words.
- The step times 3:20 and 4:15 in the afternoon section are estimates.
- The answers in the questions section were written from her public posts. She should read each one.
- Guests are named from public posts. Each needs to be happy to be named.
- The photos are her captioned Instagram slides. Swap in originals when she sends them, and ask who is in each one.
- The wordmark was lifted from one of her images. Replace it with her real logo file.
- The Cosy Club drawing shows the venue. She should let the venue know.
- The sign-up form (`#join`) is not connected to anything. Connect it or remove it before going live.

## Going live

Only on Shannon's clear yes:

- Remove `<meta name="robots" content="noindex">` from the page head.
- Remove the "Preview" label in the header (`.previewtag`) and rewrite the preview line in the footer (`.foot__preview`).
- Change `og:url` and `og:image` in the page head to full addresses on the live domain.
- Check the event details for Google in the page head are right.
- Check the page on a phone-width screen at the live address.

## Her own domain and her email

- The site is served by GitHub Pages. To use her own domain, add it in the repository's Pages settings (this writes a `CNAME` file), point the domain at GitHub Pages using the records in GitHub's current documentation, wait for the certificate and then switch on Enforce HTTPS. Verify the domain on her GitHub account first so nobody else can claim it.
- Her email runs on the same domain and must keep working. Never change or remove MX records, or any TXT or CNAME record used for email or account verification (SPF, DKIM, DMARC, autodiscover).
- Before any change, write down the records as they are now. Afterwards, check the email records are unchanged.
- She makes the changes herself at her domain provider. Give her one screen at a time.

## Later, not now

A newsletter people can join from the site, and helpers that draft social posts and event reminders in the SoulHauss voice.
