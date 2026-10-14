/*
 * What's new: plain one-liners about this site and its demos, newest first. Only things a visitor can see,
 * taken from what actually shipped (the git history). Client work stays private, so it is never listed here.
 */
export type ChangeDay = { date: string; items: string[] };

export const CHANGELOG: ChangeDay[] = [
  {
    date: "2026-10-14",
    items: [
      "A few soft sounds for the moments that matter, and a switch in the footer to turn them off.",
      "A wink counter: see how many times you've made the mascot wink (it stays in your browser).",
      "New: paste the column names of a spreadsheet and see the simple app it would become.",
      "On the Reports example, each total opens the jobs behind it, and each job opens what was captured on site.",
      "The paperwork around the homepage headline can be picked up and thrown around. Point at the main button to tidy it.",
      "The printable checklist has a QR code that opens the same check on your phone.",
      "The checklist demo on Our work keeps going with your Wi-Fi off, then catches up when the signal is back.",
      "Section headings now rise out of a fine line of light, the same move as our logo.",
      "Sending the contact form folds it into one card of what you sent.",
      "The mascot blinks, winks, leans toward what you point at, and has a thinking face in the chat.",
    ],
  },
  { date: "2026-10-13", items: ["New: Our work, three real apps rebuilt as demos you can try."] },
  {
    date: "2026-10-09",
    items: [
      "A pause button for anyone who prefers the page to stand still.",
      "New Terms of Service and Privacy Policy, in plain language.",
      "Faster pages and accessibility fixes across the site.",
    ],
  },
  { date: "2026-10-08", items: ["Dark mode: switch it in the top bar."] },
  { date: "2026-10-07", items: ["A new homepage, built to show what we build rather than describe it."] },
];
