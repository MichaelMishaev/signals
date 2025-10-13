import Contact from '@/components/faq/Contact';
import FaqTab from '@/components/faq/FaqTab';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarTwo from '@/components/shared/header/NavbarTwo';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

const FAQ = () => {
  return (
    <Fragment>
      <main className="bg-background-3 dark:bg-background-7">
        <FaqTab />
        <Contact />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default FAQ;
