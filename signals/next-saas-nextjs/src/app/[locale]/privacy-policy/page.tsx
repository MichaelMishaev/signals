import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarTwo from '@/components/shared/header/NavbarTwo';
import PrivacyContent from '@/components/privacy/PrivacyContent';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  // Fallback metadata if translations aren't available
  const defaultTitle = locale === 'ur' ? 'رازداری کی پالیسی - پِپ گُرو' : 'Privacy Policy - PipGuru';
  const defaultDescription = locale === 'ur'
    ? 'پِپ گُرو کی رازداری کی پالیسی - جانیں کہ ہم آپ کی ذاتی معلومات کو کیسے جمع، استعمال، اور محفوظ کرتے ہیں۔'
    : 'PipGuru.club privacy policy - Learn how we collect, use, and protect your personal information.';

  try {
    const t = await getTranslations({ locale, namespace: 'privacy' });
    return {
      title: t('meta.title'),
      description: t('meta.description'),
    };
  } catch (error) {
    // If translations fail, use default values
    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }
}

const PrivacyPolicy = () => {
  return (
    <Fragment>
      <NavbarTwo
        className="bg-accent/10 dark:bg-background-7/40 backdrop-blur-[25px] max-md:!top-8"
        btnClassName="btn-green hover:btn-white dark:hover:btn-white-dark"
        hideMenu={true}
        hideLangSwitch={true}
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PrivacyContent />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default PrivacyPolicy;
