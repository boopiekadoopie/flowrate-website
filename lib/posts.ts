/*
 * Guides (/blog). Each one grew out of a Flowrate carousel; the slides are reused as the pictures.
 * Plain words, no invented stats. Names and numbers inside the pictures are made-up examples.
 */
export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "list"; items: [string, string][] }
  | { t: "img"; src: string; alt: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  cover: string;
  coverAlt: string;
  body: Block[];
};

const img = (slug: string, f: string, alt: string): Block => ({ t: "img", src: `/blog/${slug}/${f}.jpg`, alt });

export const posts: Post[] = [
  {
    slug: "wheres-the-job-right-now",
    title: "Where's the job right now? Ask your business and count the answers",
    description: "Ask the team chat, the whiteboard, the spreadsheet and the paper job sheet where one job is, and you'll often get four different answers. Here's why, and what fixes it.",
    date: "2026-10-19",
    cover: "/blog/wheres-the-job-right-now/slide-01-wheres-the-job.jpg",
    coverAlt: "Where's the job right now? A customer's text asking if someone is still coming today.",
    body: [
      { t: "p", text: "A customer sends a simple text: is someone still coming today? It should take ten seconds to answer. In a lot of businesses it takes ten minutes, because the answer lives in five places at once." },
      { t: "h2", text: "Five places, five answers" },
      img("wheres-the-job-right-now", "slide-02-team-chat", "The team chat says Dan's got the job."),
      { t: "list", items: [
        ["The team chat", "says somebody's got it. The real update is 200 messages further up."],
        ["The whiteboard", "says Tuesday. It was moved to Wednesday, then somebody leaned on it."],
        ["The spreadsheet", "says \"in progress\". It was last edited three days ago, and there are two rows for the same job."],
        ["The paper job sheet", "says done. It's right, but it's on the dashboard of a van until Friday."],
        ["The person doing the job", "says nothing, because they're on a roof with their phone in the van."],
      ] },
      img("wheres-the-job-right-now", "slide-04-spreadsheet", "The spreadsheet says in progress, with two rows for the same job."),
      { t: "h2", text: "Nobody got it wrong on purpose" },
      { t: "p", text: "Every one of those places was a sensible choice when it started. The trouble is they can't see each other. Each holds a piece of the truth, and someone in the office spends part of every day stitching the pieces together by hand." },
      img("wheres-the-job-right-now", "slide-07-five-answers", "Five answers, one job."),
      { t: "h2", text: "One place, one answer" },
      { t: "p", text: "The fix isn't another tool on top. It's one simple app where the job lives from start to finish: booked, moved, on site, done, invoiced. The person doing the work taps it on their phone; everyone else sees it straight away." },
      img("wheres-the-job-right-now", "slide-08-one-answer", "One app, one answer: the job's timeline on a phone."),
      { t: "p", text: "That's what we build at Flowrate: an app shaped around how your business already works, so the next time a customer asks, the answer is one tap away." },
    ],
  },
  {
    slug: "five-signs-youve-outgrown-your-spreadsheet",
    title: "5 signs you've outgrown your spreadsheet",
    description: "A quick self-check for business owners: five signs a spreadsheet has stopped helping and started running you, and what to do about it.",
    date: "2026-10-19",
    cover: "/blog/five-signs-youve-outgrown-your-spreadsheet/slide-01-five-signs.jpg",
    coverAlt: "5 signs you've outgrown your spreadsheet.",
    body: [
      { t: "p", text: "Spreadsheets are brilliant for getting started. At some point, though, a lot of businesses notice the spreadsheet is running them, not the other way round. Count how many of these you nod at." },
      { t: "list", items: [
        ["More than one person edits it", "and you're never quite sure whose version is the latest."],
        ["There's a file called FINAL_v3 (2)", "and someone is still working in FINAL_v2."],
        ["There's a column nobody's allowed to touch", "because one wrong edit breaks the formulas."],
        ["The same numbers get typed in twice", "once on paper or in a chat, then again into the sheet."],
        ["Nobody trusts the total", "so someone checks it by hand before every invoice run."],
      ] },
      img("five-signs-youve-outgrown-your-spreadsheet", "slide-03-final-v3", "A spreadsheet file called FINAL_v3."),
      img("five-signs-youve-outgrown-your-spreadsheet", "slide-05-typed-twice", "The same numbers typed in twice."),
      { t: "h2", text: "Two or more? Here's what usually helps" },
      { t: "p", text: "That's normally the point where a simple app beats the sheet. Everyone adds things in one place, from their phone or the office. Everyone sees the same thing. The totals add themselves up, and nobody has to retype a thing." },
      img("five-signs-youve-outgrown-your-spreadsheet", "slide-06-nobody-trusts-the-total", "Nobody trusts the total."),
      { t: "p", text: "And if your spreadsheet still does the job? Keep it. We'd rather tell you that on a free call than build something you don't need." },
    ],
  },
  {
    slug: "tech-words-in-plain-english",
    title: "Tech words, in plain English: 12 terms you'll hear when you get an app built",
    description: "Offline mode, sync, the cloud, integration, dashboard, user roles, database, automation, notifications, backup, audit trail and export, each explained in one plain sentence.",
    date: "2026-10-19",
    cover: "/blog/tech-words-in-plain-english/slide-01-tech-words.jpg",
    coverAlt: "Tech words, in plain English.",
    body: [
      { t: "p", text: "When someone builds software for your business, the conversation fills up with words that sound more complicated than they are. Here are twelve of the most common, each in one plain sentence. Save it for the next time someone says \"sync\" at you." },
      img("tech-words-in-plain-english", "slide-02-offline-mode", "Offline mode, explained."),
      { t: "list", items: [
        ["Offline mode", "The app keeps working with no signal, and sends everything the moment signal is back."],
        ["Sync", "Change something on one screen and everyone else's screen shows it a moment later."],
        ["The cloud", "Your information is kept on secure computers online, not on one laptop in the office."],
        ["Integration", "Two programs passing information to each other, so nobody types the same thing twice."],
        ["Dashboard", "One screen that shows how things stand right now, without phoning anyone to ask."],
        ["User roles", "Each person sees only what their job needs."],
      ] },
      img("tech-words-in-plain-english", "slide-03-sync", "Sync, explained."),
      img("tech-words-in-plain-english", "slide-06-dashboard", "Dashboard, explained."),
      { t: "h2", text: "Six more" },
      { t: "list", items: [
        ["Database", "One organised place where every record lives, so you can find any job in seconds."],
        ["Automation", "The app does the boring next step by itself. A job gets finished; the paperwork just happens."],
        ["Notifications", "A short message on your phone the moment something needs you, so nobody has to keep checking."],
        ["Backup", "A copy of everything, made every night, so a mistake can be undone."],
        ["Audit trail", "A record of who changed what, and when. Nobody has to remember."],
        ["Export", "Your information out as a spreadsheet or PDF, whenever you want it. It's yours."],
      ] },
      img("tech-words-in-plain-english", "slide-03-automation", "Automation, explained."),
      img("tech-words-in-plain-english", "slide-06-audit-trail", "Audit trail, explained."),
      { t: "p", text: "You don't need to know any of these to get a system built. Tell us how your work runs, in your own words, and we'll do the translating." },
    ],
  },
  {
    slug: "paper-job-sheet-to-phone",
    title: "From paper job sheet to phone: where each box ends up",
    description: "Follow a paper job sheet onto a phone, box by box: customer, work done, hours, parts, photos and signature, and why nothing needs retyping afterwards.",
    date: "2026-10-19",
    cover: "/blog/paper-job-sheet-to-phone/slide-01-paper-trail.jpg",
    coverAlt: "Paper Trail: a paper job sheet followed onto a phone.",
    body: [
      { t: "p", text: "Paper job sheets work, until someone has to read the handwriting, chase the missing photos and type it all into the invoice. Here's what happens to each box when the same sheet becomes an app." },
      img("paper-job-sheet-to-phone", "slide-02-customer", "The customer box, on paper and on the phone."),
      { t: "list", items: [
        ["The customer", "Picked from your list, address included. No more guessing at a scribbled name."],
        ["The work done", "Ticked from a short list, so nothing gets missed off the bill."],
        ["The hours", "Start and finish tapped in; the total is worked out for you."],
        ["The parts", "Chosen from your list, with your prices already on."],
        ["The photos", "Taken inside the job, with the time on them, and saved to it."],
        ["The signature", "Signed on the screen, and the office knows the job's done."],
      ] },
      img("paper-job-sheet-to-phone", "slide-06-photos", "Photos taken inside the job."),
      { t: "h2", text: "Same job, nothing to retype" },
      { t: "p", text: "The point isn't to get rid of the sheet. It's to keep the sheet your team already understands and stop typing it twice. We build the app around the boxes you already use, so the switch feels familiar on day one." },
      img("paper-job-sheet-to-phone", "slide-08-nothing-to-retype", "Same job. Nothing to retype."),
    ],
  },
  {
    slug: "why-off-the-shelf-software-doesnt-fit",
    title: "Why off-the-shelf software doesn't fit (and what to do instead)",
    description: "Most software makes every business work the same way. Here's why that rarely fits, and how an app built around your business is different.",
    date: "2026-10-19",
    cover: "/blog/why-off-the-shelf-software-doesnt-fit/slide-01-doesnt-fit.jpg",
    coverAlt: "Most software doesn't fit: generic app screens spilling out of a box labelled Your business.",
    body: [
      { t: "p", text: "Off-the-shelf software is built for the average business. Yours isn't average. So you end up bending your work around the software: extra steps, workarounds, a second app for the bit the first one can't do, and a monthly bill that grows every time you need one more feature." },
      { t: "h2", text: "Do it the other way round" },
      { t: "p", text: "Start with how your business actually works, then build the app around it. A plumber's app looks nothing like a salon's, and it shouldn't. Each one speaks the language of the job and shows only what that team needs." },
      img("why-off-the-shelf-software-doesnt-fit", "slide-03-plumbers", "An app for your plumbers."),
      img("why-off-the-shelf-software-doesnt-fit", "slide-07-sawmill", "An app for your sawmill."),
      { t: "h2", text: "What that looks like" },
      { t: "list", items: [
        ["For trades", "job cards, photos and sign-off on site, and invoices drafted from the job."],
        ["For transport", "load sheets and documents from the cab, and a live board for the office."],
        ["For farms", "daily tasks, readings and stock counts that work with no signal."],
        ["For salons", "online booking, client notes and reminders that send themselves."],
        ["For workshops", "batch and quality records on a tablet, searchable in seconds."],
      ] },
      img("why-off-the-shelf-software-doesnt-fit", "slide-08-built-around-you", "Built around your business."),
      { t: "p", text: "That's what Flowrate does, for any business: custom apps, dashboards, portals and websites, built around how you already work." },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const fmtDate = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/* Minutes to read, at an easy 220 words a minute (pictures not counted). */
export const readMinutes = (p: Post) => {
  const words = p.body.reduce((n, b) => n + (b.t === "p" || b.t === "h2" ? b.text : b.t === "list" ? b.items.flat().join(" ") : "").split(/\s+/).filter(Boolean).length, 0);
  return Math.max(1, Math.ceil(words / 220));
};
/* The guide after this one (older first, then round to the newest), for the "Read next" card. */
export const nextPost = (slug: string) => {
  const i = posts.findIndex((p) => p.slug === slug);
  return posts[(i + 1) % posts.length];
};
