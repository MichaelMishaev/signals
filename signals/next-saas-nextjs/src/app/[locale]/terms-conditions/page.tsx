import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarTwo from '@/components/shared/header/NavbarTwo';
import PageHero from '@/components/shared/PageHero';
import TermsConditionContent from '@/components/terms-conditions/TermsConditionContent';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'terms' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

const TermsConditions = () => {
  return (
    <Fragment>
      <NavbarTwo
        className="bg-accent/10 dark:bg-background-7/40 backdrop-blur-[25px] max-md:!top-8"
        btnClassName="btn-green hover:btn-white dark:hover:btn-white-dark"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero title="terms.pageTitle" heading="terms.pageHeading" link="/terms-conditions" />
        <TermsConditionContent />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default TermsConditions;
