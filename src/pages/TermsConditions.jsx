import { Link } from "react-router-dom";
import LegalPage from "../components/LegalPage";
import { site } from "../data/site";

const sections = [
  {
    id: "agreement",
    title: "Agreeing to these terms",
    body: (
      <p>
        These terms apply to your use of the {site.name} website. By using it, you agree to them. If you do not agree,
        please do not use the website. Our work for you on a project is covered by the quotation and written agreement
        we sign with you; these terms do not replace that agreement.
      </p>
    ),
  },
  {
    id: "services",
    title: "Our services",
    body: (
      <p>
        We provide interior design, modular kitchens, wall decor, false ceilings, furniture, architecture and civil
        work, aluminium and uPVC windows, green scape, shade work, home makeover and renovation services. The
        website describes these services for information. Descriptions, images, videos and 3D models are illustrative:
        the finished work depends on your site, the materials you choose and what we agree in writing.
      </p>
    ),
  },
  {
    id: "estimates",
    title: "Cost estimates and quotations",
    body: (
      <>
        <ul>
          <li>The cost calculator gives an <strong>indicative range</strong> from the options you select. It is not an offer, quotation or contract.</li>
          <li>A firm price is given only after we understand your requirements and visit your site, and it is binding only once confirmed in a written quotation.</li>
          <li>Final prices can change with site conditions, the scope of work, material choices, taxes and market prices.</li>
        </ul>
        <p>Products shown with "Price on enquiry" are priced when you contact us.</p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Enquiries and orders",
    body: (
      <p>
        This website has no online checkout. Pressing "Enquire on WhatsApp", "Book consultation" or submitting a form
        sends us an enquiry, and it does not create a sale. An order exists only when we confirm it in writing and
        you pay any agreed advance. Custom and made-to-measure items are produced to your specification and may not
        be cancellable once work starts.
      </p>
    ),
  },
  {
    id: "payments",
    title: "Payments and timelines",
    body: (
      <p>
        Payment terms, milestones and delivery or completion dates are set out in your quotation or agreement.
        Timelines are our best estimate and may move because of approvals, site access, weather, change requests or
        supply delays outside our control. We will tell you promptly if that happens.
      </p>
    ),
  },
  {
    id: "warranty",
    title: "Warranty",
    body: (
      <p>
        Warranty cover (for example, "up to 10 years" on selected work) applies to the items, scope and period stated
        in your written agreement. It does not cover normal wear and tear, misuse, damage from water, fire, pests or
        structural movement, or repairs and changes made by anyone other than us.
      </p>
    ),
  },
  {
    id: "your-content",
    title: "What you send us",
    body: (
      <p>
        When you share a design, drawing, photo or message, you confirm that you have the right to share it and that
        it does not break anyone else's rights or any law. You allow us to use it to respond to your request and
        carry out your project. Please do not upload anything harmful, unlawful or unrelated.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Ownership of website content",
    body: (
      <p>
        The text, designs, drawings, logos, photographs, videos, 3D models and layout of this website belong to{" "}
        {site.name} or its licensors and are protected by law. You may view and share pages for personal,
        non-commercial use. You may not copy, republish, sell or build on our content without our written
        permission. Drawings and designs we prepare for your project remain our work until the agreed fees are paid
        in full.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Using the website properly",
    body: (
      <ul>
        <li>Give accurate information in forms and use your own contact details.</li>
        <li>Do not misuse the website: no scraping, automated submissions, attempts to break or overload it, or to access it without permission.</li>
        <li>Do not use it to send spam or to impersonate another person or business.</li>
      </ul>
    ),
  },
  {
    id: "third-party",
    title: "Other websites",
    body: (
      <p>
        The website links to services we do not control, such as WhatsApp, YouTube, Facebook and Instagram. We are
        not responsible for their content, availability or privacy practices.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limits of our responsibility",
    body: (
      <p>
        We work to keep the website accurate and available, but it is provided "as is". We do not promise it will be
        uninterrupted or error-free. To the extent the law allows, we are not liable for indirect or consequential
        loss from using the website, or for relying on the indicative estimates or illustrations on it. Nothing here
        limits liability that cannot be limited by law, or your rights under the agreement for work we carry out.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Your personal information",
    body: (
      <p>
        How we collect and use personal information is explained in our <Link to="/privacy-policy">Privacy Policy</Link>,
        which forms part of these terms.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may change these terms from time to time. The updated version applies from the "Last updated" date on this
        page, and continuing to use the website means you accept it.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <p>
        These terms are governed by the laws of India. We would like to resolve any concern directly first. If we
        cannot, the courts at Kolkata, West Bengal have exclusive jurisdiction.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        {site.name}, {site.address.line1}, {site.address.line2}. Phone:{" "}
        <a href={`tel:${site.phonePrimary}`}>{site.phonePrimaryLabel}</a>, or use the <Link to="/contact">Contact page</Link>.
      </p>
    ),
  },
];

export default function TermsConditions() {
  return (
    <LegalPage
      eyebrow="The ground rules"
      title="Terms and Conditions"
      updated="16 November 2026"
      intro="Plain terms for using this website and for how estimates, enquiries and orders work with us."
      sections={sections}
    />
  );
}
