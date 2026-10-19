/*
 * Industry pages (/for/[slug]). Plain words, no invented stats. Each industry shows an example app in its own brand
 * (the same five example brands as the "Made to fit" reel and carousel). All names and numbers are made up.
 */
export type Industry = {
  slug: string;
  label: string; // footer + "other industries" links
  title: string; // <title>
  description: string; // meta description
  h1: string;
  sub: string;
  pains: string[];
  builds: [string, string][];
  prefill: string;
};

export const industries: Industry[] = [
  {
    slug: "trades",
    label: "Trades & field service",
    title: "Apps for trades and field service | Flowrate",
    description: "A custom app for your trade business: jobs out to the team, photos and sign-offs back, invoices ready from the job. Built around how you already work.",
    h1: "An app for your trade business.",
    sub: "Jobs go out to the team, photos and sign-offs come back, and the invoice is ready before the van gets home.",
    pains: [
      "Job details live in group chats and on the back of receipts.",
      "Photos and signatures sit on someone's phone until Friday.",
      "Invoices wait until somebody retypes the job sheet.",
    ],
    builds: [
      ["Job cards on every phone", "The address, the notes and the customer, sent to the right person."],
      ["Photos and sign-off on site", "Taken in the app and saved to the job, even with no signal."],
      ["Invoices from the job", "Hours and parts flow straight into a draft invoice."],
      ["One view for the office", "Every job and where it is right now."],
    ],
    prefill: "I run a trade business and want an app for jobs, photos and invoices.",
  },
  {
    slug: "transport",
    label: "Transport & logistics",
    title: "Apps for transport and logistics | Flowrate",
    description: "A custom driver app and office board: loads, documents and proof of delivery go from the cab to the office in one tap, with or without signal.",
    h1: "An app for your drivers.",
    sub: "Loads, documents and proof of delivery go from the cab to the office in one tap, with or without signal.",
    pains: [
      "Delivery notes come back crumpled, days later.",
      "The office phones drivers all day to ask where they are.",
      "Load documents get retyped before anyone can invoice.",
    ],
    builds: [
      ["Load sheets on the phone", "Truck, driver and load picked in a few taps."],
      ["Documents as photos", "Delivery notes and slips captured at the drop, saved to the load."],
      ["A live board for the office", "Every load and its status, without a phone call."],
      ["Ready to invoice", "The paperwork is already there when the truck is back."],
    ],
    prefill: "I run a transport business and want a driver app and an office board.",
  },
  {
    slug: "farms",
    label: "Farms & agriculture",
    title: "Apps for farms and agriculture | Flowrate",
    description: "A custom farm app: daily tasks, readings and stock counts captured in the field and seen from the office, even where there's no signal.",
    h1: "An app for your farm.",
    sub: "Tasks, readings and stock counts captured in the field and seen from the office, even where there's no signal.",
    pains: [
      "The day's jobs are shouted across the yard or written on a whiteboard.",
      "Rain, feed and stock numbers live in a notebook in the truck.",
      "Nobody knows what got done until the evening.",
    ],
    builds: [
      ["Daily task lists", "Who's doing what, ticked off as it's done."],
      ["Readings and counts", "Rain, feed, water and stock, entered once in the field."],
      ["Works with no signal", "Everything saves on the phone and sends itself later."],
      ["A record of the season", "Every task and reading, searchable, in one place."],
    ],
    prefill: "I run a farm and want an app for daily tasks, readings and stock counts.",
  },
  {
    slug: "salons",
    label: "Salons & studios",
    title: "Apps for salons and studios | Flowrate",
    description: "A custom booking and client app for your salon or studio: online bookings, client notes and reminders in one calm diary.",
    h1: "An app for your salon.",
    sub: "Bookings, client notes and reminders in one calm diary that fits how your team already works.",
    pains: [
      "Bookings arrive by message, phone call and text, and some get missed.",
      "Client notes like colour formulas live in someone's head.",
      "Empty chairs because nobody sent a reminder.",
    ],
    builds: [
      ["Online booking", "Clients pick a time that's actually free."],
      ["Client cards", "Notes, formulas and history for every client, on every device."],
      ["Reminders that send themselves", "A friendly message the day before."],
      ["The day at a glance", "Every chair, every booking, one screen."],
    ],
    prefill: "I run a salon or studio and want online bookings, client notes and reminders.",
  },
  {
    slug: "manufacturing",
    label: "Manufacturing & workshops",
    title: "Apps for manufacturing and workshops | Flowrate",
    description: "A custom shop-floor app: batches, checks and quality records captured on a tablet at the machine, searchable and ready to report.",
    h1: "An app for your shop floor.",
    sub: "Batches, checks and quality records captured on a tablet at the machine, not on paper in a drawer.",
    pains: [
      "Quality sheets are filled in by hand and filed away.",
      "Finding last month's batch record means digging through boxes.",
      "Customer reports take a day to put together.",
    ],
    builds: [
      ["Batch records on a tablet", "Filled in at the machine, with the checks built in."],
      ["Checks with photos", "Proof saved with the batch, the moment it's done."],
      ["A searchable register", "Any batch, any date, found in seconds."],
      ["Reports in one click", "Ready to send to a customer or an auditor."],
    ],
    prefill: "I run a manufacturing business and want batch and quality records on a tablet.",
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
