# Internship Semester 2, 2026/2027

Upload-ready website for the GitHub repository `lammc-const/intern_sem2_26-27`.

The intended published address is:

https://lammc-const.github.io/intern_sem2_26-27/

## Publish this website

1. Sign in to GitHub as `lammc-const` and create a repository named exactly `intern_sem2_26-27`. Choose Public and initialise it with a README.
2. Extract this ZIP on your computer.
3. Open the repository, choose **Add file → Upload files**, and upload the extracted contents. Upload `index.html`, `styles.css`, `app.js`, `content.js`, and the entire `assets` and `downloads` folders directly to the repository root. You may also upload this README and `.nojekyll`.
4. Commit the files. The Code tab should show `index.html` directly in the root.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select **main** and **/ (root)**, then click **Save**.
8. Wait for the Pages deployment to succeed in **Actions**. The published address is shown in **Settings → Pages**. It may take several minutes.

An extra enclosing folder in the repository adds an extra path segment to the website address. Upload the files inside the extracted package directly to the repository root to obtain the intended address above.

## Preview on your computer

Open the extracted `index.html` file in your browser. JavaScript must be enabled. All fonts, images and the two downloadable PDF guides are included locally.

## Edit the content

| Change | File |
| --- | --- |
| FAQ questions, answers, keywords and filters | `content.js`, under `faqs` |
| Course-specific dates | `content.js`, under `timeline` |
| FITS tutorials | `content.js`, under `tutorials` |
| Checklists | `content.js`, under `checklists` |
| Links to FITS, Teams, WhatsApp and Semester 1 | `content.js`, under `links` and `semester1Url` |
| Assessment tables, contacts and main page wording | `app.js` |
| Colours, fonts and responsive layout | `styles.css` |

Keep each FAQ ID unique and stable because individual question links use it. Commit your edits to publish updates.

## Homepage resources

The homepage includes downloads for the supplied 80-page internship briefing, 42-page FITS user manual and editable Word technical report template. All three files are bundled in `downloads/`. The report template is also linked from Report & KLIK and Resources & support. The supplied Word file is preserved as `Technical_Report_Template_2025.docx`. Keep that folder with the website when uploading to GitHub.

The Microsoft Teams section displays code `bvg8kis`, a copy-code button, joining instructions and a link to open Teams. Edit `teamsCode` and `downloads` in `content.js` to update these resources.

## Blue theme

The Semester 2 website uses a navy sidebar and hero, blue buttons and links, pale blue selected states, and a light blue background. Theme colours are defined at the top of `styles.css`.

## Included features

- Two PDF guides, an editable Word report template and Microsoft Teams information on the homepage.
- 50 searchable FAQs with English and Bahasa Melayu keywords.
- Topic, stage, course and track filters.
- Shareable links to individual questions.
- 10 FITS tutorials with selected manual screenshots.
- Before, during and completion checklists saved on the current device.
- Course-specific timelines and calendar downloads.
- Assessment, report, KLIK and contact guidance.
- An email-draft helper with an editable internship semester in the question box. The semester and question are included in the email opened for review.

## Content decisions to review

- The Semester 2 start deadline is 12 April 2027 for TTTT4056 and TTTT411A. Older October 2026 dates repeated in the FAQ source were excluded.
- The website follows the briefing's seven-day report duty deadline. The FITS manual also contains older “first two weeks” wording.
- The FAQ source and briefing have different five-day and six-day leave thresholds. The website flags the difference and directs students to HEJIM for the applicable replacement-day rule.
- KLIK dates follow the supplied briefing and are labelled subject to change.
- The supplied content is based on the Semester 2 briefing, FITS manual and HEJIM FAQ document. Update `updated` in `content.js` when reviewing the content.

The website is a static guide. Checklist progress is a student's own record on the current device. Official submission and approval status is available in FITS.

## GitHub references

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
