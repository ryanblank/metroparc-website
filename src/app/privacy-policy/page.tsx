import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Metro Parc privacy policy — how we collect, use, and share your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Simple header */}
      <section className="bg-city-night text-clouds pt-32 pb-16 px-8 text-center">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold">Privacy Policy</h1>
      </section>

      <section className="bg-clouds py-16 px-8">
        <article className="max-w-[800px] mx-auto prose-city-night">
          <div className="space-y-8 text-city-night-light leading-[1.8]">
            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Our Privacy Policy</h2>
              <p>
                This Privacy Policy describes how your personal information is collected, used, and shared when you visit our site (the &quot;Site&quot;).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Personal Information We Collect</h2>
              <p className="mb-4">
                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, which websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as &quot;Device Information&quot;.
              </p>
              <p>We collect Device Information using the following technologies:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>&quot;Cookies&quot; are data files that are placed on your device or computer and often include an anonymous unique identifier.</li>
                <li>&quot;Log files&quot; track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</li>
                <li>&quot;Web beacons,&quot; &quot;tags,&quot; and &quot;pixels&quot; are electronic files used to record information about how you browse the Site.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">How Do We Use Your Personal Information?</h2>
              <p className="mb-4">
                When in line with the preferences you have shared with us, we provide you with information or advertising related to our products or services.
              </p>
              <p>
                We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Sharing Your Personal Information</h2>
              <p>
                We share your Personal Information with third parties to help us use your Personal Information as described above. We use Google Analytics to help us understand how our customers use the Site. Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Do Not Track</h2>
              <p>
                Please note that we do not alter our Site&apos;s data collection and use practices when we see a Do Not Track signal from your browser.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Your Rights</h2>
              <p>
                If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Data Retention</h2>
              <p>
                When you give us your personal information on the Site, we will maintain your Personal Information for our records unless and until you ask us to delete this information. Data that has been removed will be in archives for up to 30 days and then removed automatically.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Minors</h2>
              <p>The Site is not intended for individuals under the age of 16.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Changes</h2>
              <p>
                We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Unsubscribe from Our Mailings and Emails</h2>
              <p>
                If you desire to unsubscribe from our mailings or emails, simply click unsubscribe at the bottom of any email or feel free to contact us using the contact information below.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-city-night mb-3">Contact Us</h2>
              <p>
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us using one of the methods provided on our <a href="/contact" className="text-deep-ocean hover:underline">contact page</a>.
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
