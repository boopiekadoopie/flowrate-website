import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Flowrate",
  description: "The terms that apply to this website and to the systems, apps and websites Flowrate builds for clients.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service | Flowrate", url: "/terms" },
};

const EMAIL = "andrew@flowrate.agency";
const ul = "list-disc pl-5 space-y-1.5";

const sections: LegalSection[] = [
  {
    h: "Who we are and what these terms cover",
    body: [
      <p key="a">
        Flowrate (&ldquo;we&rdquo;, &ldquo;us&rdquo;) designs and builds custom apps, business systems,
        dashboards and websites. These terms apply to this website and to any work we do for you
        (&ldquo;you&rdquo;). Your written quote forms part of these terms. If the quote and these terms
        disagree, the quote wins.
      </p>,
    ],
  },
  {
    h: "Quotes and scope",
    body: [
      <p key="a">
        Every project is scoped with you and confirmed in a written quote that sets out what we will
        build, the price, the payment stages and an expected timeline. Work starts once you accept the
        quote and the first payment is received.
      </p>,
      <p key="b">
        If you want something that isn&apos;t in the quote, we&apos;ll tell you what it adds in time and
        cost before doing it. Nothing extra is charged without your written OK.
      </p>,
    ],
  },
  {
    h: "Payment",
    body: [
      <p key="a">Payment is made in stages, as set out in your quote. Unless the quote says otherwise:</p>,
      <ul key="b" className={ul}>
        <li>40% when you accept the quote, to start the work;</li>
        <li>40% when you approve the working version;</li>
        <li>20% at launch.</li>
      </ul>,
      <p key="c">
        Invoices are due within 7 days. If a payment is more than 14 days late, we may pause work until
        it is paid, and timelines move by the length of the pause. If VAT applies, it is shown on the
        quote and invoice.
      </p>,
    ],
  },
  {
    h: "How a build works",
    body: [
      <p key="a">
        We start by mapping how the work is done today. We then show you how the system will work,
        screen by screen, and change it until it fits. You approve the working version before we finish
        and launch it. We test on real jobs before your team relies on it, and help set it up with your
        team.
      </p>,
    ],
  },
  {
    h: "What we need from you",
    body: [
      <ul key="a" className={ul}>
        <li>Access to the people, tools and accounts the system needs to connect to.</li>
        <li>Accurate information about how your business works, and feedback within a reasonable time.</li>
        <li>
          A person on your side to check anything the system prepares for you, such as draft invoices,
          before it is sent. Our systems prepare drafts; you stay in control of what goes out.
        </li>
        <li>Permission to use any content, data or branding you give us.</li>
      </ul>,
    ],
  },
  {
    h: "After launch",
    body: [
      <p key="a">
        For 30 days after launch we fix, at no charge, anything that doesn&apos;t work as agreed in the
        quote.
      </p>,
      <p key="b">
        After that you can choose an optional monthly care plan covering hosting, monitoring, updates
        and small changes. It runs month to month and you can cancel it before the next month starts.
        New features are quoted separately.
      </p>,
      <p key="c">
        Running costs such as hosting, AI usage, text messages and third-party software subscriptions
        are paid by you at cost. Where we can, we set these accounts up in your name so you hold them
        directly.
      </p>,
    ],
  },
  {
    h: "Who owns what",
    body: [
      <ul key="a" className={ul}>
        <li>
          <strong className="text-heading font-semibold">Your data is yours.</strong> Everything your
          business puts into the system belongs to you. We only use it to build, run and support your
          system.
        </li>
        <li>
          <strong className="text-heading font-semibold">Your custom code is yours once paid for.</strong>{" "}
          When the build has been paid in full, you own the code we wrote specifically for you, and we
          give you a copy on request. You are not locked in to us.
        </li>
        <li>
          <strong className="text-heading font-semibold">Our building blocks stay ours.</strong> We
          bring tools, templates and components we use across projects. We keep ownership of those, and
          you get a permanent licence to use them as part of your system.
        </li>
        <li>
          Third-party software (for example your accounting package) stays under that provider&apos;s
          own terms.
        </li>
      </ul>,
    ],
  },
  {
    h: "Confidentiality and your information",
    body: [
      <p key="a">
        We keep your business information confidential and only share it with the service providers
        needed to build and run your system. When your system handles personal information about your
        staff or customers, we process it on your behalf and in line with the Protection of Personal
        Information Act (POPIA). We can sign a data processing agreement if you need one.
      </p>,
      <p key="b">We won&apos;t name you or show your system publicly without your written permission.</p>,
    ],
  },
  {
    h: "Other services we connect to",
    body: [
      <p key="a">
        Systems often connect to other services, such as accounting software, messaging or cloud
        storage. We aren&apos;t responsible for their outages or for changes they make, but if a change
        on their side affects your system we will tell you what it takes to adapt.
      </p>,
    ],
  },
  {
    h: "Results and liability",
    body: [
      <p key="a">
        We build carefully and test before launch, but we can&apos;t promise specific business results,
        such as time saved or revenue gained, because those depend on how a system is used.
      </p>,
      <p key="b">
        To the extent the law allows, our total liability for any claim relating to our work is limited
        to the fees you paid us in the 12 months before the claim, and we are not liable for indirect
        losses such as lost profits. Nothing in these terms limits rights you have that the law does
        not allow us to exclude.
      </p>,
    ],
  },
  {
    h: "Ending the work",
    body: [
      <p key="a">
        Either of us can end a project with written notice. You pay for the work done up to that point,
        and we hand over everything you have paid for, including a copy of the code and your data.
      </p>,
    ],
  },
  {
    h: "This website and the chat assistant",
    body: [
      <p key="a">
        The content on this site is general information. The chat assistant is an AI that answers common
        questions; it can make mistakes, and nothing it says is a quote or a commitment. Please
        don&apos;t copy our designs, content or media and present them as your own.
      </p>,
    ],
  },
  {
    h: "Governing law",
    body: [
      <p key="a">
        These terms are governed by the laws of the Republic of South Africa. If a disagreement comes up,
        we will first try to sort it out by talking. If that doesn&apos;t work, the courts of South Africa
        have jurisdiction.
      </p>,
    ],
  },
  {
    h: "Changes and contact",
    body: [
      <p key="a">
        We may update these terms from time to time; the date at the top shows the latest version. The
        version in place when you accepted your quote applies to that project. Questions? Email{" "}
        <a href={`mailto:${EMAIL}`} className="text-heading underline underline-offset-2">
          {EMAIL}
        </a>
        .
      </p>,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="9 October 2026"
      intro={
        <p>
          The short version: you get a written quote before anything starts, you pay in stages as the
          work is approved, your data is always yours, and the custom code is yours once it&apos;s paid
          for.
        </p>
      }
      sections={sections}
    />
  );
}
