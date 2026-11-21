/* Internship Hub. Buildless JavaScript for GitHub Pages and local use. */
'use strict';

(() => {
  const data = window.INTERNSHIP_DATA;
  const main = document.querySelector('main');
  const storageKey = 'ftsm-internship-sem2-2026-2027';
  const routeNames = {
    home: 'Overview', guide: 'Internship guide', dates: 'Dates & assessment',
    report: 'Report & KLIK', tutorials: 'FITS tutorials', faq: 'Search FAQs', support: 'Resources & support'
  };
  const navIcons = {
    home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    guide: '<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4zM20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3z"/>',
    dates: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3"/>',
    report: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
    tutorials: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4m-1-13 5 3-5 3z"/>',
    faq: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M8 8a2 2 0 1 1 3 2c-1 0-1 1-1 1M10 14h.01"/>',
    support: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h5v-7zM20 12h2v7h-5v-7zM20 19c0 3-4 3-7 3"/>'
  };

  function icon(name) {
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${navIcons[name] || navIcons.guide}</svg>`;
  }

  function escape(value = '') {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return {
        course: ['4056', '411a'].includes(saved.course) ? saved.course : '',
        track: ['industry', 'research'].includes(saved.track) ? saved.track : '',
        checks: saved.checks && typeof saved.checks === 'object' ? saved.checks : {}
      };
    } catch {
      return { course: '', track: '', checks: {} };
    }
  }

  const state = loadState();
  let toastTimer;
  let faqCategory = 'All topics';
  let faqStage = 'all';
  let faqCourse = '';
  let faqTrack = '';
  let lastRoute = '';

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { /* Private browsers may disable local storage. The guide still works. */ }
  }

  function toast(message) {
    const target = document.getElementById('toast');
    clearTimeout(toastTimer);
    target.textContent = message;
    target.hidden = false;
    toastTimer = setTimeout(() => { target.hidden = true; }, 3500);
  }

  function readRoute() {
    const raw = location.hash.slice(1);
    const separator = raw.indexOf('?');
    const name = separator < 0 ? raw : raw.slice(0, separator);
    const params = new URLSearchParams(separator < 0 ? '' : raw.slice(separator + 1));
    return { name: routeNames[name] ? name : 'home', params };
  }

  function routeHref(name, params = {}) {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
    return `#${name}${query.size ? '?' + query.toString() : ''}`;
  }

  function intro(title, description, eyebrow = '') {
    return `<div class="page-intro">${eyebrow ? `<p class="eyebrow">${escape(eyebrow)}</p>` : ''}<h1>${escape(title)}</h1><p>${escape(description)}</p></div>`;
  }

  function faqLink(id, label) {
    return `<a href="${routeHref('faq', { id })}">${escape(label || data.faqs.find(item => item.id === id)?.question || 'Read FAQ')}</a>`;
  }

  function searchForm(value = '', id = 'home-search') {
    return `<form class="search-form" data-search-form role="search"><div class="search-field">${icon('faq')}<label class="visually-hidden" for="${id}">Search internship questions</label><input id="${id}" name="q" type="search" value="${escape(value)}" placeholder="Ask an internship question…" autocomplete="off" maxlength="250"></div><button class="button" type="submit">Search</button></form>`;
  }

  function courseLabel(course = state.course) {
    return course === '411a' ? 'TTTT411A' : course === '4056' ? 'TTTT4056 + TTTT4076' : 'All course routes';
  }

  function selectedCourses() {
    return state.course ? [state.course] : ['4056', '411a'];
  }

  function shortDate(date, includeYear = true) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'short', ...(includeYear ? { year: 'numeric' } : {}), timeZone: 'UTC'
    }).format(new Date(date + 'T12:00:00Z'));
  }

  function dateRange(start, end) {
    const crossesYear = start.slice(0, 4) !== end.slice(0, 4);
    return start === end ? shortDate(start) : `${shortDate(start, crossesYear)} – ${shortDate(end)}`;
  }

  function home() {
    const image = './assets/internship-office.webp';
    return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Semester 2 · 2026/2027</p><h1>Your internship<br>starts here</h1><p>Find your next step, keep track of deadlines and get answers throughout your internship.</p><a class="button" href="#guide">Explore the internship guide</a></div><img src="${image}" alt="Illustrative scene of colleagues discussing work at a laptop" fetchpriority="high"></section>
      <section class="search-panel" aria-labelledby="home-search-heading"><h2 id="home-search-heading">What would you like to know?</h2>${searchForm()}<p class="search-hint">Search in English or Bahasa Melayu. Try “SV tak dapat email” or “cover letter”.</p><div class="quick-questions">${faqLink('activation-email', 'Supervisor activation')}${faqLink('letter-dates', 'Change cover letter dates')}${faqLink('late-start', 'Latest start date')}</div></section>
      <div class="home-resources">
        <section class="panel" aria-labelledby="downloads-heading">
          <h2 id="downloads-heading">Downloads & templates</h2>
          <div class="download-list">
            ${data.downloads.map(file => `<a class="download-item" href="${escape(file.file)}" download aria-label="Download ${escape(file.title)} ${escape(file.format)}"><span class="download-description"><strong>${escape(file.title)}</strong><small>${escape(file.format)}${file.pages ? ` · ${file.pages} pages` : ''} · ${escape(file.size)}</small></span><span class="download-action">${escape(file.action)}</span></a>`).join('')}
          </div>
        </section>
        <section class="panel teams-panel" aria-labelledby="teams-heading">
          <h2 id="teams-heading">Join Microsoft Teams</h2>
          <p>Find briefing recordings, forms, report templates and internship announcements.</p>
          <div class="teams-code-row"><div><span class="teams-code-label">Team code</span><code class="teams-code">${escape(data.teamsCode)}</code></div><button class="button secondary compact" type="button" data-copy-teams>Copy team code</button></div>
          <ol class="teams-steps"><li>Open Teams and sign in with your university account.</li><li>Choose <strong>Join team</strong> and find <strong>Join a team with a code</strong>.</li><li>Enter <strong>${escape(data.teamsCode)}</strong> to join the internship team.</li></ol>
          <div class="teams-actions"><a class="button" href="${data.links.teams}" target="_blank" rel="noopener">Open Microsoft Teams</a><a class="inline-link" href="https://support.microsoft.com/en-us/teams/teams-channels/use-a-link-or-code-to-join-a-team-in-microsoft-teams" target="_blank" rel="noopener">Joining help</a></div>
        </section>
      </div>
      <div class="home-grid"><section class="panel"><div class="section-head"><h2>Your internship journey</h2></div>
        ${[['before', 'Before internship', 'Eligibility, placement and offer letters', 'guide'], ['during', 'During internship', 'Report duty, weekly reports and supervisors', 'tutorials'], ['completion', 'Completing internship', 'Final documents, technical report and KLIK', 'report']].map(([stage, title, text, imageName]) => `<a class="journey-link" href="${routeHref('guide', { stage })}"><span class="journey-icon">${icon(imageName)}</span><span><strong>${title}</strong><small>${text}</small></span></a>`).join('')}
      </section><section class="panel"><div class="section-head"><h2>Key dates</h2><a href="#dates">Full timeline</a></div>
        <div class="date-preview"><div class="date-square">23<small>Nov</small></div><div><strong>Cover letter applications open</strong><p>23 Nov 2026 – 31 Jan 2027</p></div></div>
        <div class="date-preview"><div class="date-square">08<small>Feb</small></div><div><strong>Internship begins</strong><p>8 Feb – 28 Jun 2027 · 20 weeks</p></div></div>
        <div class="date-preview"><div class="date-square">12<small>Apr</small></div><div><strong>Latest permitted start</strong><p>Applies to TTTT4056 and TTTT411A</p></div></div>
      </section></div>
      <p class="source-note">Prepared from the Semester 2 briefing, FITS manual and HEJIM FAQ. Content reviewed ${escape(data.updated)}. Check Teams for updated announcements.</p>`;
  }

  function applicableChecklist(item) {
    const restriction = item[2];
    return restriction === 'all' || restriction === state.course || restriction === state.track ||
      (['industry', 'research'].includes(restriction) && !state.track) || (restriction === '4056' && !state.course);
  }

  function checkKey(stage, item) {
    return `${state.course || 'all'}:${state.track || 'all'}:${stage}:${item}`;
  }

  function guide(params) {
    const stage = ['before', 'during', 'completion'].includes(params.get('stage')) ? params.get('stage') : 'before';
    const titles = { before: 'Before internship', during: 'During internship', completion: 'Completing internship' };
    const items = data.checklists[stage].filter(applicableChecklist);
    const checked = items.filter(([id]) => state.checks[checkKey(stage, id)]).length;
    const context = state.track === 'research' ? 'Research track' : state.track === 'industry' ? 'Industry Readiness track' : 'All placement tracks';
    return intro('Your internship guide', 'Follow the steps for your stage. Choose your course route and track above to tailor the checklist.') +
      `<nav class="tabs" aria-label="Internship stage">${Object.entries(titles).map(([id, label]) => `<a class="tab" aria-current="${id === stage}" href="${routeHref('guide', { stage: id })}">${label}</a>`).join('')}</nav>
      <div class="guide-layout"><section class="panel"><h2>${titles[stage]}</h2><div class="progress-meta"><span>${checked} of ${items.length} steps checked</span><span>${Math.round(checked / items.length * 100)}%</span></div><div class="progress-track" role="progressbar" aria-label="Checklist completion" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${checked}"><span style="width:${checked / items.length * 100}%"></span></div><ul class="checklist">${items.map(([id, label, restriction]) => `<li><label class="check-item"><input type="checkbox" data-check="${escape(checkKey(stage, id))}" ${state.checks[checkKey(stage, id)] ? 'checked' : ''}><span>${escape(label)}${!state.track && ['industry', 'research'].includes(restriction) ? ` <small class="muted">(${restriction === 'research' ? 'Research track' : 'Industry Readiness'})</small>` : ''}${!state.course && restriction === '4056' ? ' <small class="muted">(TTTT4056 route)</small>' : ''}</span></label></li>`).join('')}</ul><p class="source-note">Your checklist is saved on this device. Official submission and approval status is available in FITS.</p><button class="link-button" data-reset-checklist="${stage}" type="button">Reset this checklist</button></section>
      <aside class="guide-aside"><section class="panel"><p class="eyebrow">Your selections</p><h2>${courseLabel()}</h2><p>${context}</p><a class="inline-link" href="#dates">View dates and assessment</a></section>
      <div class="info-strip">${stage === 'before' ? 'Allow 3–5 working days for FITS requests and HEJIM enquiries. Follow up from the third working day.' : stage === 'during' ? 'Report duty form due within seven days. Submit your weekly report every week and request supervisor approval.' : 'The corrected final report goes to FITS and your Faculty Supervisor after KLIK.'}</div>
      <section class="panel"><h2>Questions for this stage</h2><ul class="simple-list">${(stage === 'before' ? ['prerequisites', 'job-scope', 'letter-dates', 'research-supervisors'] : stage === 'during' ? ['activation-email', 'weekly-report', 'faculty-contact', 'leave'] : ['completion-form', 'report-upload', 'support-letter', 'klik']).map(id => `<li>${faqLink(id)}</li>`).join('')}</ul></section></aside></div>
      ${stage === 'before' ? `<section class="two-column"><div class="panel"><h2>Industry Readiness</h2><p>Work with a company or agency on degree-level IT tasks involving programming, coding or scripting.</p><p>Physical or hybrid placements are permitted, with up to two work-from-home days per week.</p>${faqLink('job-scope', 'Check placement requirements')}</div><div class="panel"><h2>Research track</h2><p>A minimum CGPA of 3.00 applies. Work under an FTSM lecturer and attend TTTM6124 Advanced Research Methodology in Computing.</p><p>If your research host is your FYP supervisor, discuss and propose another Faculty Supervisor.</p>${faqLink('research-eligibility', 'View research track guidance')}</div></section>` : ''}`;
  }

  function dates() {
    const courses = selectedCourses();
    const dateCells = row => courses.map(course => {
      const [start, end] = row.both ? [row.start, row.end] : row[course];
      return `<td>${dateRange(start, end)}</td>`;
    }).join('');
    return intro('Dates & assessment', 'Check your course timeline, submission sequence and assessment components.') +
      `<div class="section-head"><h2>Semester 2 timeline</h2><button class="button secondary compact" type="button" data-calendar>Download calendar</button></div>
      <p class="selection-hint">${state.course ? `Showing ${courseLabel()}.` : 'Showing both course routes. Select yours above to focus the timeline.'}</p>
      <div class="table-wrap"><table><caption class="visually-hidden">Semester 2 internship dates by course route</caption><thead><tr><th scope="col">Milestone</th>${courses.map(course => `<th scope="col">${courseLabel(course)}</th>`).join('')}</tr></thead><tbody>${data.timeline.map(row => `<tr><th scope="row"><strong>${escape(row.label)}</strong><br><small class="muted">${escape(row.type)}</small></th>${dateCells(row)}</tr>`).join('')}</tbody></table></div>
      <div class="notice">KLIK presentation dates are subject to change. Check Teams for the latest announcements. A late start can affect your assessment schedule.</div>
      ${courses.includes('4056') ? `<section><h2>TTTT4056 · Internship</h2><div class="table-wrap"><table><thead><tr><th scope="col">Industry Supervisor assessment</th><th scope="col">Weight</th></tr></thead><tbody><tr><td>Logbook</td><td>40%</td></tr><tr><td>Performance evaluation</td><td>60%</td></tr><tr><td><strong>Total</strong></td><td><strong>100%</strong></td></tr></tbody></table></div><p>The result is pass/fail. Failing TTTT4056 also results in a fail for TTTT4076.</p><h2>TTTT4076 · Industrial Project</h2><div class="weighting"><div class="weight"><strong>20%</strong><h3>Summative progress</h3><p>Contact your Faculty Supervisor at least five times during the internship.</p></div><div class="weight"><strong>50%</strong><h3>Technical report</h3><p>Explain the method, applied knowledge, design and complete results.</p></div><div class="weight"><strong>30%</strong><h3>KLIK presentation</h3><p>Present your project clearly with readable materials and neat appearance.</p></div></div></section>` : ''}
      ${courses.includes('411a') ? `<section><h2>TTTT411A · Internship</h2><div class="two-column"><div><h3>Industry Supervisor · 60%</h3><div class="table-wrap"><table><thead><tr><th scope="col">Component</th><th scope="col">Weight</th></tr></thead><tbody><tr><td>Job understanding, ethics and professionalism</td><td>15%</td></tr><tr><td>IT knowledge and skills</td><td>20%</td></tr><tr><td>Leadership, responsibility and teamwork</td><td>15%</td></tr><tr><td>Entrepreneurial value</td><td>10%</td></tr></tbody></table></div></div><div><h3>Faculty Supervisor · 40%</h3><div class="table-wrap"><table><thead><tr><th scope="col">Component</th><th scope="col">Weight</th></tr></thead><tbody><tr><td>IT knowledge and skills</td><td>10%</td></tr><tr><td>Technical report</td><td>20%</td></tr><tr><td>Project presentation</td><td>10%</td></tr></tbody></table></div></div></div><p>The briefing specifies minimums of 40% in continuous assessment and 30% in the final assessment or examination.</p></section>` : ''}
      <details class="disclosure"><summary>Internship performance bands and TTTT4076 grades</summary><div class="two-column"><div><h3>Internship performance</h3><p>80–100 Excellent · 60–79 Good · 35–59 Pass · 0–34 Fail. TTTT4056 and TTTT411A use the pass/fail status in the briefing.</p></div><div><h3>TTTT4076 letter grades</h3><p>80–100 A, 75–79 A−, 70–74 B+, 65–69 B, 60–64 B−, 55–59 C+, 50–54 C, 45–49 C−, 40–44 D+, 35–39 D, 0–34 E.</p></div></div></details>
      <div class="button-row"><a class="button secondary" href="${routeHref('faq', { id: 'failure' })}">Failure and invalidity conditions</a><a class="button secondary" href="#report">Report & KLIK guidance</a></div>`;
  }

  function report() {
    const template = data.downloads.find(file => file.id === 'report-template');
    return intro('Technical report & KLIK', 'Prepare your project evidence, follow the review schedule and submit your corrected final report.') +
      `<div class="report-specs"><div class="report-spec"><strong>15–20 pages</strong><small>Excluding appendices</small></div><div class="report-spec"><strong>English</strong><small>Report language</small></div><div class="report-spec"><strong>12 pt</strong><small>Times New Roman</small></div></div>
      <div class="button-row report-template-download"><a class="button" href="${escape(template.file)}" download>Download Word template (.docx)</a><span class="muted">${escape(template.size)} · Editable Word document</span></div>
      <div class="section-head"><h2>Report structure</h2><button class="button secondary compact" type="button" data-print>Print guidance</button></div>
      ${data.reportSections.map(([title, body], index) => `<details class="disclosure" ${index === 0 ? 'open' : ''}><summary>${escape(title)}</summary><p>${escape(body)}</p></details>`).join('')}
      <div class="info-strip">Remove confidential information or replace it with dummy data. Proofread and revise with your Faculty Supervisor before submission.</div>
      <section style="margin-top:32px"><h2>A methodology suited to your project</h2>${data.methods.map(([title, body]) => `<details class="disclosure"><summary>${escape(title)}</summary><p>${escape(body)}</p></details>`).join('')}</section>
      <section class="two-column"><div class="panel"><h2>Supervisor review</h2><p>Submit the report for Faculty Supervisor review, then Industry Supervisor review, according to your course timeline. Allow time for corrections.</p><a class="inline-link" href="#dates">Check the review dates</a></div><div class="panel"><h2>KLIK presentation</h2><p>Attendance is compulsory. Explain your project clearly, use readable presentation materials and dress neatly.</p><p>Submit the corrected report to FITS and your Faculty Supervisor after KLIK.</p><a class="inline-link" href="${routeHref('tutorials', { id: 'technical-report' })}">View the FITS submission tutorial</a></div></section>
      <p class="source-note">Use the downloadable Word template for detailed title, author, abstract and verification formatting.</p>`;
  }

  function tutorials(params) {
    const selected = data.tutorials.find(item => item.id === params.get('id'));
    if (!selected) {
      return intro('FITS tutorials', 'Step-by-step help for the tasks you complete in the FTSM Industrial Training System.') +
        `<div class="tutorial-list">${data.tutorials.map(item => `<a class="tutorial-card" href="${routeHref('tutorials', { id: item.id })}"><span class="eyebrow">${escape(item.stage)}</span><h2>${escape(item.title)}</h2><p>${escape(item.time)}</p></a>`).join('')}</div><div class="button-row"><a class="button" href="${data.links.fits}" target="_blank" rel="noopener">Open FITS</a></div>`;
    }
    return `<a class="back-link" href="#tutorials">All FITS tutorials</a>` + intro(selected.title, selected.time, selected.stage) +
      `<ol class="tutorial-steps">${selected.steps.map(step => `<li><span>${escape(step)}</span></li>`).join('')}</ol>
      ${selected.image ? `<figure class="screenshot"><img src="./assets/tutorials/${escape(selected.image)}" alt="FITS manual screenshot for ${escape(selected.title.toLowerCase())}" loading="lazy"><figcaption>Example interface from the supplied FITS manual. Sample entries illustrate the form and are not your current internship details.</figcaption></figure>` : ''}
      <div class="button-row"><a class="button" href="${data.links.fits}" target="_blank" rel="noopener">Open FITS</a><a class="button secondary" href="${routeHref('faq', { id: selected.faq })}">Related FAQ</a><button class="button secondary" type="button" data-print>Print steps</button></div>`;
  }

  const synonymGroups = [
    ['supervisor', 'sv', 'penyelia'], ['email', 'emel', 'mel'], ['activation', 'activate', 'aktif', 'activationemail'],
    ['company', 'syarikat', 'companies'], ['letter', 'surat'], ['cover', 'permohonan'],
    ['weekly', 'mingguan', 'logbook', 'log'], ['report', 'laporan'], ['duty', 'lapor', 'diri'],
    ['leave', 'cuti', 'mc', 'sick', 'medical', 'sakit'], ['change', 'tukar', 'ubah'],
    ['date', 'dates', 'tarikh'], ['start', 'mula'], ['end', 'tamat', 'completion'],
    ['deadline', 'cutoff', 'lewat', 'late'], ['research', 'penyelidikan'], ['master', 'masters', 'sarjana'],
    ['insurance', 'insurans'], ['fail', 'failed', 'gagal'], ['form', 'borang'], ['offer', 'tawaran'],
    ['approval', 'approve', 'approved', 'lulus'], ['submit', 'submission', 'hantar', 'upload', 'muatnaik'],
    ['faculty', 'fakulti'], ['industry', 'industri'], ['working', 'bekerja'], ['password', 'katalaluan']
  ];
  const ignoredWords = new Set('a an the is are can i my me do to for how what when where why in on of and with if it does not tak tidak dapat terima boleh saya nak yang untuk dan di ke ini itu berapa macam mana have has as be do you your'.split(' '));

  function normalize(text) {
    return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function tokensFor(query) {
    return [...new Set(normalize(query).split(/\s+/).filter(token => token && !ignoredWords.has(token)))];
  }

  function nearWord(first, second) {
    if (first === second) return true;
    if (first.length < 5 || Math.abs(first.length - second.length) > 1) return false;
    let left = 0;
    let right = 0;
    let edits = 0;
    while (left < first.length && right < second.length) {
      if (first[left] === second[right]) { left++; right++; continue; }
      if (++edits > 1) return false;
      if (first.length >= second.length) left++;
      if (second.length >= first.length) right++;
    }
    return edits + (first.length - left) + (second.length - right) <= 1;
  }

  function rankQuestion(item, query) {
    const tokens = tokensFor(query);
    if (!query.trim()) return 1;
    if (!tokens.length) return 1;
    const title = normalize(item.question);
    const keywords = normalize(item.keywords);
    const answer = normalize([item.answer, ...item.steps].join(' '));
    const combinedWords = `${title} ${keywords} ${answer}`.split(' ');
    let score = 0;
    let matches = 0;
    for (const token of tokens) {
      const variants = synonymGroups.find(group => group.includes(token)) || [token];
      const titleMatch = variants.some(word => title.includes(word));
      const keywordMatch = variants.some(word => keywords.includes(word));
      const answerMatch = variants.some(word => answer.includes(word));
      const approximate = !titleMatch && !keywordMatch && !answerMatch && combinedWords.some(word => nearWord(token, word));
      if (titleMatch || keywordMatch || answerMatch || approximate) {
        matches++;
        score += titleMatch ? 8 : keywordMatch ? 6 : answerMatch ? 2 : 1;
      }
    }
    // A single broad term should not swamp a multi-term question.
    const required = Math.max(1, Math.ceil(tokens.length * 0.6));
    if (matches < required) return 0;
    if (title.includes(normalize(query))) score += 15;
    return score + matches / tokens.length * 8;
  }

  function highlight(text, query) {
    const words = tokensFor(query).filter(word => word.length >= 3);
    if (!words.length) return escape(text);
    const matcher = new RegExp('(' + words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    return String(text).split(matcher).map((part, index) => index % 2 ? `<mark>${escape(part)}</mark>` : escape(part)).join('');
  }

  function faqCard(item, query, opened) {
    const stages = { before: 'Before internship', during: 'During internship', completion: 'Completion' };
    return `<details class="faq-item" id="faq-${escape(item.id)}" ${opened ? 'open' : ''}><summary>${highlight(item.question, query)}</summary><div class="faq-answer"><div class="faq-meta"><span>${escape(item.category)}</span>${item.course !== 'all' ? `<span>${courseLabel(item.course)}</span>` : ''}${item.track !== 'all' ? `<span>${item.track === 'research' ? 'Research track' : 'Industry Readiness'}</span>` : ''}${stages[item.stage] ? `<span>${stages[item.stage]}</span>` : ''}</div><p>${highlight(item.answer, query)}</p>${item.steps.length ? `<ol>${item.steps.map(step => `<li>${highlight(step, query)}</li>`).join('')}</ol>` : ''}${item.notice ? `<div class="notice">${escape(item.notice)}</div>` : ''}${item.related.length ? `<div class="related-links"><strong>Related questions</strong>${item.related.map(id => faqLink(id)).join('')}</div>` : ''}<div class="faq-action-row">${item.tutorial ? `<a href="${routeHref('tutorials', { id: item.tutorial })}">View FITS tutorial</a>` : '<a href="#support">Contact HEJIM</a>'}<button type="button" class="link-button" data-copy-faq="${escape(item.id)}">Copy question link</button></div><p class="source-note">${escape(item.source)} · Reviewed ${escape(data.updated)}</p></div></details>`;
  }

  function faqPage(params) {
    const query = params.get('q') || '';
    const categories = ['All topics', ...new Set(data.faqs.map(item => item.category))];
    return intro('Find your answer', 'Search internship questions in English or Bahasa Melayu, or browse by topic.') +
      `<div class="search-panel">${searchForm(query, 'faq-search')}<p class="search-hint">Try “SV tak dapat email”, “tukar tarikh” or “insurance letter”.</p></div>
      <div class="faq-layout"><aside class="faq-filters" aria-label="FAQ filters"><span class="filter-label">Browse topics</span><div class="category-buttons">${categories.map(category => `<button class="category-button" data-category="${escape(category)}" aria-pressed="${faqCategory === category}" type="button">${escape(category)}<small>${category === 'All topics' ? data.faqs.length : data.faqs.filter(item => item.category === category).length}</small></button>`).join('')}</div></aside><section aria-label="Frequently asked questions"><div class="faq-tools"><p id="faq-count" role="status" aria-live="polite"></p><label><span class="visually-hidden">Filter by internship stage</span><select id="faq-stage"><option value="all">All stages</option><option value="before">Before internship</option><option value="during">During internship</option><option value="completion">Completion</option></select></label></div><div class="faq-tools"><label><span class="visually-hidden">Filter by course</span><select id="faq-course"><option value="">All courses</option><option value="4056">TTTT4056 + TTTT4076</option><option value="411a">TTTT411A</option></select></label><label><span class="visually-hidden">Filter by placement track</span><select id="faq-track"><option value="">All tracks</option><option value="industry">Industry Readiness</option><option value="research">Research</option></select></label><button type="button" class="link-button" data-clear-faq>Clear filters</button></div><div id="faq-results" class="faq-list"></div></section></div>`;
  }

  function updateFaq() {
    const params = readRoute().params;
    const query = document.getElementById('faq-search')?.value || '';
    const id = params.get('id');
    const results = data.faqs.map(item => ({ item, score: rankQuestion(item, query) })).filter(({ item, score }) =>
      score > 0 && (faqCategory === 'All topics' || item.category === faqCategory) &&
      (faqStage === 'all' || item.stage === 'all' || item.stage === faqStage) &&
      (!faqCourse || item.course === 'all' || item.course === faqCourse) &&
      (!faqTrack || item.track === 'all' || item.track === faqTrack)
    ).sort((first, second) => {
      if (first.item.id === id) return -1;
      if (second.item.id === id) return 1;
      return query.trim() ? second.score - first.score : 0;
    });
    const label = `${results.length} ${results.length === 1 ? 'answer' : 'answers'}${query.trim() ? ` for “${query.trim()}”` : ''}`;
    document.getElementById('faq-count').textContent = label;
    document.getElementById('faq-results').innerHTML = results.length ? results.map(({ item }, index) => faqCard(item, query, item.id === id || (query.trim() && index === 0))).join('') :
      `<div class="empty"><h2>No matching answers yet</h2><p class="muted">Try fewer words, a different spelling or clear the topic and stage filters.</p><button class="button secondary" data-clear-faq type="button">Clear search and filters</button><p style="margin-top:20px">Still need help? <a href="#support">Contact HEJIM</a></p></div>`;
    document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === faqCategory)));
  }

  function support() {
    return intro('Resources & support', 'Find the right channel, prepare your request and access the official internship resources.') +
      `<section class="contact-list"><div class="contact-card"><h2>HEJIM enquiries</h2><p>Placement questions, cover letter requests, supervisor issues and internship assistance.</p><a class="email" href="mailto:hejimftsm@ukm.edu.my">hejimftsm@ukm.edu.my</a><p>03-8921 6178</p><a class="inline-link" href="#support?contact=1">Prepare an enquiry</a></div><div class="contact-card"><h2>Faculty signature requests</h2><p>Send company documents requiring a faculty signature to both addresses.</p><a class="email" href="mailto:tdhejim.ftsm@ukm.edu.my">tdhejim.ftsm@ukm.edu.my</a><a class="email" href="mailto:hejimftsm@ukm.edu.my">hejimftsm@ukm.edu.my</a></div><div class="contact-card"><h2>Insurance letters</h2><p>Contact Encik Nashrul, HEP UKM. Include your full name, matric number, IC number, company name and address. State whether coverage details are required.</p><a class="email" href="mailto:nashrul@ukm.edu.my">nashrul@ukm.edu.my</a></div><div class="contact-card"><h2>Academic support letters</h2><p>Contact the Academic Unit for a letter about your academic completion status.</p><a class="email" href="mailto:tdpraftsm@ukm.edu.my">tdpraftsm@ukm.edu.my</a><a class="email" href="mailto:nur.syazwani@ukm.edu.my">nur.syazwani@ukm.edu.my</a></div></section>
      <section class="two-column"><div class="panel"><h2>Forms, templates and recordings</h2><ul class="simple-list"><li>Report duty form — download from FITS or Teams.</li><li>Internship completion form — download from FITS or Teams.</li><li>Technical report template — <a href="./downloads/Technical_Report_Template_2025.docx" download>download the Word document (.docx)</a>.</li><li>Briefing slides, recording and FITS manual — available in Teams.</li></ul><p class="source-note">Microsoft Teams code <strong>${escape(data.teamsCode)}</strong></p><div class="button-row"><a class="button secondary" href="${data.links.teams}" target="_blank" rel="noopener">Open Microsoft Teams</a><button class="button secondary" type="button" data-copy-teams>Copy team code</button></div></div><div class="panel"><h2>Keep up with announcements</h2><p>Check the WhatsApp group description and Teams resources for the latest instructions.</p><a class="button secondary" href="${data.links.whatsapp}" target="_blank" rel="noopener">Join the WhatsApp group</a><div class="info-strip">Allow 3–5 working days for requests. Follow up from the third working day. Contact officers during working hours.</div></div></section>
      <section class="panel" id="support-contact"><h2>Prepare an email to HEJIM</h2><p class="contact-instructions">Include your full name, matric number, internship course code and the semester in which you are conducting your internship. The button opens your email app so you can review the message and attach documents.</p><form id="contact-form" class="contact-form"><div class="two-column"><label>Full name<input name="fullName" autocomplete="name" required maxlength="120"></label><label>Matric number<input name="matric" autocomplete="off" required maxlength="30"></label></div><label>Internship course code<input name="courseCode" placeholder="e.g. TTTT4056" required maxlength="30"></label><label>Your question or request<textarea name="message" required maxlength="5000" aria-describedby="message-help">Internship semester: ${escape(data.session)}\n\nQuestion or request:\n</textarea></label><p class="contact-instructions" id="message-help">Check the internship semester in the box, then add your question or request.</p><button class="button" type="submit">Open email draft</button></form></section>`;
  }

  function setMenu(open) {
    document.getElementById('sidebar').classList.toggle('open', open);
    document.getElementById('menu-toggle').setAttribute('aria-expanded', String(open));
    document.getElementById('menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.getElementById('menu-overlay').hidden = !open;
  }

  function render({ focus = false } = {}) {
    const { name, params } = readRoute();
    if (name === 'faq' && params.get('id')) {
      faqCategory = 'All topics'; faqStage = 'all'; faqCourse = ''; faqTrack = '';
    }
    const pages = { home, guide, dates, report, tutorials, faq: faqPage, support };
    main.innerHTML = pages[name](params);
    document.getElementById('page-label').textContent = routeNames[name];
    document.title = `${routeNames[name]} · Internship Hub · FTSM UKM`;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.route === name) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (name === 'faq') {
      document.getElementById('faq-stage').value = faqStage;
      document.getElementById('faq-course').value = faqCourse;
      document.getElementById('faq-track').value = faqTrack;
      updateFaq();
    }
    setMenu(false);
    if (focus) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
    if (name === 'faq' && params.get('id')) {
      requestAnimationFrame(() => document.getElementById('faq-' + params.get('id'))?.scrollIntoView({ block: 'start' }));
    }
    if (name === 'support' && params.get('contact')) {
      requestAnimationFrame(() => document.getElementById('support-contact')?.scrollIntoView({ block: 'start' }));
    }
    lastRoute = name;
  }

  function saveDownload(filename, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadCalendar() {
    if (!state.course) {
      toast('Choose your course route above to download the correct calendar.');
      document.getElementById('course-select').focus();
      return;
    }
    const compactDate = date => date.replace(/-/g, '');
    const nextDay = date => {
      const value = new Date(date + 'T00:00:00Z');
      value.setUTCDate(value.getUTCDate() + 1);
      return value.toISOString().slice(0, 10);
    };
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const events = data.timeline.map(row => {
      const [start, end] = row.both ? [row.start, row.end] : row[state.course];
      return ['BEGIN:VEVENT', `UID:${row.id}-${state.course}-sem2-2026-2027@ftsm-internship`,
        `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${compactDate(start)}`, `DTEND;VALUE=DATE:${compactDate(nextDay(end))}`,
        `SUMMARY:${row.label} (${courseLabel()})`,
        `DESCRIPTION:${row.type}. Check Teams for updates.`, 'END:VEVENT'].join('\r\n');
    });
    // Fold calendar content lines at 75 UTF-8 octets for calendar-app compatibility.
    const foldLine = line => {
      let result = '';
      let width = 0;
      for (const character of line) {
        const bytes = new TextEncoder().encode(character).length;
        if (width + bytes > 75) { result += '\r\n '; width = 1; }
        result += character;
        width += bytes;
      }
      return result;
    };
    const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FTSM UKM//Internship Guide//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].join('\r\n').split('\r\n').map(foldLine).join('\r\n');
    saveDownload(`Internship-Sem2-2026-2027-${state.course}.ics`, calendar, 'text/calendar;charset=utf-8');
    toast('Calendar downloaded. Import it into your calendar app.');
  }

  async function copyText(value) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      toast('Copied to clipboard.');
    } catch {
      window.prompt('Copy this text', value);
    }
  }

  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: 'start' });
  });

  document.getElementById('main-nav').innerHTML = Object.entries(routeNames).map(([name, label]) =>
    `<a href="#${name}" class="nav-link" data-route="${name}">${icon(name)}<span>${label}</span></a>`).join('');
  document.getElementById('semester1-link').href = data.semester1Url;
  document.getElementById('course-select').value = state.course;
  document.getElementById('track-select').value = state.track;
  document.getElementById('course-select').addEventListener('change', event => {
    state.course = event.target.value; saveState(); render();
  });
  document.getElementById('track-select').addEventListener('change', event => {
    state.track = event.target.value; saveState(); render();
  });
  document.getElementById('menu-toggle').addEventListener('click', () => setMenu(!document.getElementById('sidebar').classList.contains('open')));
  document.getElementById('menu-overlay').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('hashchange', () => render({ focus: true }));

  main.addEventListener('submit', event => {
    if (event.target.matches('[data-search-form]')) {
      event.preventDefault();
      const query = new FormData(event.target).get('q').trim();
      faqCategory = 'All topics'; faqStage = 'all'; faqCourse = ''; faqTrack = '';
      location.hash = routeHref('faq', { q: query });
      if (lastRoute === 'faq') render();
    }
    if (event.target.id === 'contact-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const messageField = event.target.elements.message;
      const question = messageField.value
        .replace(/^Internship semester:.*$/m, '')
        .replace(/^Question or request:\s*/m, '')
        .trim();
      messageField.setCustomValidity(question ? '' : 'Please add your question or request below the internship semester.');
      if (!messageField.reportValidity()) return;
      const subject = `Internship enquiry – ${form.get('courseCode')} – ${form.get('matric')}`;
      const body = `Dear HEJIM,\n\nName: ${form.get('fullName')}\nMatric number: ${form.get('matric')}\nInternship course: ${form.get('courseCode')}\n\n${form.get('message')}\n\nThank you.`;
      window.location.href = `mailto:${data.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  });

  main.addEventListener('input', event => {
    if (event.target.name === 'message') event.target.setCustomValidity('');
    if (event.target.id === 'faq-search') {
      const query = event.target.value;
      history.replaceState(null, '', routeHref('faq', { q: query }));
      updateFaq();
    }
  });

  main.addEventListener('change', event => {
    if (event.target.matches('[data-check]')) {
      state.checks[event.target.dataset.check] = event.target.checked;
      saveState();
      const inputs = [...main.querySelectorAll('[data-check]')];
      const total = inputs.length;
      const complete = inputs.filter(input => input.checked).length;
      main.querySelector('.progress-meta').innerHTML = `<span>${complete} of ${total} steps checked</span><span>${Math.round(complete / total * 100)}%</span>`;
      const progress = main.querySelector('[role=progressbar]');
      progress.setAttribute('aria-valuenow', complete);
      progress.firstElementChild.style.width = `${complete / total * 100}%`;
    }
    if (event.target.id === 'faq-stage') { faqStage = event.target.value; updateFaq(); }
    if (event.target.id === 'faq-course') { faqCourse = event.target.value; updateFaq(); }
    if (event.target.id === 'faq-track') { faqTrack = event.target.value; updateFaq(); }
  });

  main.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-category')) { faqCategory = button.dataset.category; updateFaq(); }
    if (button.hasAttribute('data-clear-faq')) {
      faqCategory = 'All topics'; faqStage = 'all'; faqCourse = ''; faqTrack = '';
      history.replaceState(null, '', '#faq'); render();
      document.getElementById('faq-search').focus();
    }
    if (button.hasAttribute('data-copy-faq')) {
      const url = new URL(location.href);
      url.hash = routeHref('faq', { id: button.dataset.copyFaq });
      copyText(url.href);
    }
    if (button.hasAttribute('data-copy-teams')) copyText(data.teamsCode);
    if (button.hasAttribute('data-calendar')) downloadCalendar();
    if (button.hasAttribute('data-print')) window.print();
    if (button.hasAttribute('data-reset-checklist')) {
      if (window.confirm('Reset the checklist for this stage and your current selections?')) {
        const prefix = `${state.course || 'all'}:${state.track || 'all'}:${button.dataset.resetChecklist}:`;
        Object.keys(state.checks).filter(key => key.startsWith(prefix)).forEach(key => delete state.checks[key]);
        saveState(); render();
      }
    }
  });

  render();
})();
