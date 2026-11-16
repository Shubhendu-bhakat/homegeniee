import { Link } from "react-router-dom";
import LegalPage from "../components/LegalPage";
import { site } from "../data/site";

const sections = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          {site.name} ("we", "us") is an interior design, modular kitchen, architecture and civil, and home
          improvement company based in Kolkata, serving customers since {site.since}. This policy explains what
          personal information we collect through this website, why, and the choices you have.
        </p>
        <p>
          {site.address.line1}, {site.address.line2}<br />
          Phone: <a href={`tel:${site.phonePrimary}`}>{site.phonePrimaryLabel}</a>
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>We collect only what you choose to give us, and a small amount of technical information.</p>
        <ul>
          <li><strong>Enquiry and consultation forms:</strong> your name, mobile number, email address (optional), location, the service you are interested in, and any message you write.</li>
          <li><strong>Cost estimate sign-in:</strong> your name and mobile number, together with the options you chose in the calculator (service, size, finish and the resulting range).</li>
          <li><strong>Contact page uploads:</strong> if you attach a design or drawing, the file itself.</li>
          <li><strong>Technical data:</strong> the web page you were on when you submitted a form, and basic browser information that every website receives.</li>
        </ul>
        <p>We do not sell products online, so we never ask for card, bank or UPI details on this website.</p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    body: (
      <ul>
        <li>To call, message or email you about your enquiry and to arrange a site visit or consultation.</li>
        <li>To prepare and share the cost estimate and quotation you asked for.</li>
        <li>To understand which services people are interested in, so we can improve the website and our offering.</li>
        <li>To keep records that the law requires, and to prevent spam and misuse of our forms.</li>
      </ul>
    ),
  },
  {
    id: "legal-basis",
    title: "Why we may process it",
    body: (
      <p>
        We process your information because you gave it to us for a specific purpose (your consent, which you can
        withdraw), because we need it to respond to your request or perform a service you asked for, and where the
        law requires or allows it. We handle personal data in line with the Information Technology Act, 2000 and
        the Digital Personal Data Protection Act, 2023.
      </p>
    ),
  },
  {
    id: "storage",
    title: "Where your information is stored",
    body: (
      <>
        <p>
          Form submissions are saved to a secured Google Sheet that only authorised Home Geniee staff can open,
          through a Google Apps Script service. Google acts as our service provider for this storage, and your data
          may therefore be processed on Google's servers, which can be outside India.
        </p>
        <p>
          Your browser also keeps a small amount of data on your own device (see Cookies and local storage below).
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We do not sell or rent your personal information. We share it only with:</p>
        <ul>
          <li>our own designers, engineers and site teams, so they can work on your enquiry;</li>
          <li>service providers that run the website and our records (such as Google for form storage and web hosting);</li>
          <li>authorities, where we are legally required to.</li>
        </ul>
        <p>
          Some features load content from other companies: embedded YouTube videos, Google Fonts, and links that open
          WhatsApp, Facebook, Instagram or YouTube. These services have their own privacy policies and may collect data
          such as your IP address once you load or click them.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>
          The website uses your browser's storage to remember that you signed in for a cost estimate (your name and
          mobile number are kept on your own device) and that you have seen the cookie notice. Embedded videos from
          YouTube may set their own cookies.
        </p>
        <p>
          You can clear this data at any time from your browser settings. Doing so will sign you out of the estimate
          view, and you will be asked again next time.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep enquiry details for as long as needed to respond to you, carry out any project we agree on, and meet
        legal, accounting or warranty obligations. After that we delete or anonymise them. If you ask us to delete
        your details sooner, we will do so unless we must keep them by law.
      </p>
    ),
  },
  {
    id: "security",
    title: "Keeping it safe",
    body: (
      <p>
        We use reasonable technical and organisational measures to protect your information, including encrypted
        connections (HTTPS) and restricted access to our records. No method of transmission or storage is completely
        secure, so we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You may ask us, at any time, to:</p>
        <ul>
          <li>tell you what personal data we hold about you;</li>
          <li>correct or update it;</li>
          <li>delete it, or stop using it for a purpose you no longer agree to;</li>
          <li>withdraw consent you gave earlier;</li>
          <li>nominate someone to exercise these rights on your behalf.</li>
        </ul>
        <p>
          To do any of this, call us on <a href={`tel:${site.phonePrimary}`}>{site.phonePrimaryLabel}</a> or send a
          message from our <Link to="/contact">Contact page</Link>. We will verify who you are and respond within a
          reasonable time.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is meant for adults planning work on their homes. We do not knowingly collect personal data from
        children under 18. If you believe a child has sent us their details, contact us and we will remove them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The "Last updated" date at the top shows when it last changed.
        If we make a significant change, we will say so on this website.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact and grievances",
    body: (
      <p>
        For questions, requests or complaints about your personal data, reach us at {site.address.line1},{" "}
        {site.address.line2}, by phone on <a href={`tel:${site.phonePrimary}`}>{site.phonePrimaryLabel}</a>, or through
        the <Link to="/contact">Contact page</Link>.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Your data, your call"
      title="Privacy Policy"
      updated="16 November 2026"
      intro="We keep this simple: we ask for the least information we need, use it only to help you with your home project, and never sell it."
      sections={sections}
    />
  );
}
