import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Flowrate",
  description: "What information Flowrate collects through this website, why, who processes it, and your rights under POPIA.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | Flowrate", url: "/privacy" },
};

const EMAIL = "andrew@flowrate.agency";
const ul = "list-disc pl-5 space-y-1.5";
const link = "text-heading underline underline-offset-2";
const b = "text-heading font-semibold";

const sections: LegalSection[] = [
  {
    h: "Who is responsible",
    body: [
      <p key="a">
        Flowrate is responsible for the personal information collected through this website. Andrew
        Murray is our Information Officer and the person to contact about anything in this policy:{" "}
        <a href={`mailto:${EMAIL}`} className={link}>{EMAIL}</a>.
      </p>,
    ],
  },
  {
    h: "What we collect",
    body: [
      <ul key="a" className={ul}>
        <li>
          <strong className={b}>The enquiry form:</strong> your name, email address, and if you choose to
          give them, your business name, phone number and what you tell us about the job.
        </li>
        <li>
          <strong className={b}>The chat assistant:</strong> the messages you type into the chat.
        </li>
        <li>
          <strong className={b}>Booking a call:</strong> the details you enter on our booking page, which
          is run by Calendly.
        </li>
        <li>
          <strong className={b}>Visiting the site:</strong> technical information your browser sends,
          such as your IP address and device type. We use it to keep the site secure, stop spam and see,
          in total, how the site is used. We don&apos;t use advertising or tracking cookies.
        </li>
      </ul>,
    ],
  },
  {
    h: "Why we use it",
    body: [
      <ul key="a" className={ul}>
        <li>To reply to your enquiry and prepare for a call you booked.</li>
        <li>To answer your questions in the chat.</li>
        <li>To deliver and support work you ask us to do.</li>
        <li>To keep the site working, secure and free of spam.</li>
      </ul>,
      <p key="b">
        We use your information because you asked us to get in touch or to take steps towards working
        together, or because we have a legitimate interest in running a secure website. We never sell
        your information and we don&apos;t add you to mailing lists.
      </p>,
    ],
  },
  {
    h: "Who processes it for us",
    body: [
      <p key="a">We use a small number of service providers to run the site:</p>,
      <ul key="b" className={ul}>
        <li><strong className={b}>Vercel</strong> hosts the website.</li>
        <li>
          <strong className={b}>Cloudflare</strong> protects and speeds up the site, and provides
          cookie-free visit statistics.
        </li>
        <li>
          <strong className={b}>Anthropic</strong> provides the AI model that writes the chat
          assistant&apos;s replies. Your chat messages are sent to it to produce an answer.
        </li>
        <li><strong className={b}>Resend</strong> delivers enquiry form messages to our inbox.</li>
        <li><strong className={b}>Calendly</strong> runs our booking page.</li>
      </ul>,
      <p key="c">
        These providers only process your information to provide their service, under their own privacy
        terms. Some are based outside South Africa, so your information may be processed in other
        countries. We only use providers that are bound to protect personal information to a standard
        comparable to POPIA.
      </p>,
    ],
  },
  {
    h: "How long we keep it",
    body: [
      <p key="a">
        We don&apos;t store chat conversations ourselves; they are processed to produce a reply, and our AI
        provider keeps them only for a limited period under its own terms. Enquiry emails are kept for up
        to 24 months after our last contact, unless we start working together. If we work together, we
        keep project and billing records for as long as the law requires.
      </p>,
    ],
  },
  {
    h: "On your device",
    body: [
      <p key="a">
        The site stores two small settings in your browser: your light or dark theme choice, and whether
        you have already seen the chat greeting this visit. They never leave your device and you can
        clear them at any time.
      </p>,
    ],
  },
  {
    h: "Keeping it safe",
    body: [
      <p key="a">
        Information is sent over encrypted connections, and only the people who need it to reply to you
        can see it. Please don&apos;t share sensitive personal information in the chat; email us instead
        if you prefer.
      </p>,
    ],
  },
  {
    h: "Your rights",
    body: [
      <p key="a">
        Under the Protection of Personal Information Act (POPIA) you can ask to see the information we hold
        about you, have it corrected or deleted, or object to how we use it. Email{" "}
        <a href={`mailto:${EMAIL}`} className={link}>{EMAIL}</a> and we will respond within a reasonable
        time.
      </p>,
      <p key="b">
        If you are unhappy with how we have handled your information, you can complain to the Information
        Regulator of South Africa at{" "}
        <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className={link}>
          inforegulator.org.za
        </a>
        .
      </p>,
    ],
  },
  {
    h: "Changes to this policy",
    body: [
      <p key="a">If we change how we handle personal information, we will update this page and the date at the top.</p>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="9 October 2026"
      intro={
        <p>
          The short version: we only collect what you send us, we use it to reply to you and to run the
          site, we never sell it, and you can ask us to delete it at any time.
        </p>
      }
      sections={sections}
    />
  );
}
