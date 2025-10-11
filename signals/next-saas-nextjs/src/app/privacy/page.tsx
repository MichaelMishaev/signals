import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterThree from '@/components/shared/footer/FooterThree';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import PrivacyContent from '@/components/privacy/PrivacyContent';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy - PipGuru',
  description: 'PipGuru.club privacy policy - Learn how we collect, use, and protect your personal information.',
};

const Privacy = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero title="Privacy Policy" heading="Privacy Policy" link="/privacy" />
        <PrivacyContent />
        <CTAV1
          className="dark:bg-background-5 bg-white"
          badgeClass="badge-yellow-v2"
          badgeText="Get Started"
          ctaHeading="Ready to start your trading education journey?"
          description="If you have any questions about our privacy policy, feel free to reach out to our team."
          btnClass="hover:btn-secondary dark:hover:btn-accent"
          ctaBtnText="Contact Us"
        />
      </main>
      <FooterThree />
    </Fragment>
  );
};

export default Privacy;
