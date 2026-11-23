# Odinin website with Decap CMS

A static site for Netlify. The pages keep all their animations, games and the enquiry form.
Text, questions, event announcements and a few images are edited at `/admin/` without touching code.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` and the five service pages | The website. Every page has its text built in, so it still works if the content files cannot load. |
| `js/cms.js` | Small loader. It reads the files in `content/` and swaps in the edited text. |
| `content/settings.json` | Footer, contact email, contact heading, optional logo and social share image. |
| `content/pages/*.json` | Headline, intro, section titles, subtitles and "How it works" steps for each page. |
| `content/faq/*.json` | The question cards on Business Development and B2B Growth. |
| `content/events.json` | Event announcements shown on the Events page. |
| `admin/index.html`, `admin/config.yml` | The Decap CMS editor and its settings (git-gateway backend). |
| `images/uploads/` | Where images uploaded in the editor are saved. |
| `netlify.toml` | Publishes the folder as is, and stops caching of `content/` so edits show quickly. |

## One time setup on Netlify

1. Put this folder in a GitHub repository (the CMS saves edits as commits, so a Git repository is required).
2. In Netlify, choose **Add new site, Import an existing project**, pick the repository. No build command is needed; the publish directory is the repository root.
3. Open **Site configuration, Identity** and click **Enable Identity**.
4. Under **Identity, Registration**, set registration to **Invite only**.
5. Under **Identity, Services**, click **Enable Git Gateway**.
6. Under **Identity**, click **Invite users** and invite your own email.
7. Accept the invitation email, choose a password, and you land in the editor.
8. Point your domain at the Netlify site under **Domain management**. The editor is then at `https://your-domain/admin/`.

If your repository's main branch is not called `main`, change `branch:` in `admin/config.yml`.
If the live domain is not `odinin.com`, change `site_url` and `display_url` there too.

## How editing works

* **Page texts**: one entry per page. Put `*stars*` around a word in a title to make it italic with the gradient, as in "Your logo, *everywhere*". A new line in a title becomes a line break.
* **Common questions**: add, remove, reorder or edit the questions. The flip card game updates itself.
* **Event announcements**: add an event, tick **Published**, save. Published events that are not in the past appear as cards on the Events page, earliest first. Leave the button link empty to send people to the enquiry form with Events ticked.
* **Site settings**: changing the contact email also changes where the enquiry form sends to.

Each save commits to the repository and Netlify redeploys in about a minute.

## What is not editable from the CMS

The animated scenes, games and their labels are drawn in code, so they are not image files that can be swapped. Changing those still needs a developer.
