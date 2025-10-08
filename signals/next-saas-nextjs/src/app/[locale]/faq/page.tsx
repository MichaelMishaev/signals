import Contact from '@/components/faq/Contact';
import FaqTab from '@/components/faq/FaqTab';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarTwo from '@/components/shared/header/NavbarTwo';
import PageHero from '@/components/shared/PageHero';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'faq' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

const FAQ = () => {
  return (
    <Fragment>
      <NavbarTwo
        className="bg-accent/10 dark:bg-background-7/40 backdrop-blur-[25px] max-md:!top-8"
        btnClassName="btn-green hover:btn-white dark:hover:btn-white-dark"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero title="faq.pageTitle" heading="faq.pageHeading" link="/faq" />
        <FaqTab />
        <Contact />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default FAQ;
