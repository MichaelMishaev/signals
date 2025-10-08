'use client';

import { useSafeTranslations } from '@/hooks/useSafeTranslations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const GeneralTab = () => {
  const t = useSafeTranslations('faq.questions');

  // Generate FAQ items from translations
  const faqItems = Array.from({ length: 20 }, (_, i) => {
    const key = `q${i + 1}`;
    return {
      id: i + 1,
      question: t(`${key}.question`),
      answer: t(`${key}.answer`),
    };
  });

  return (
    <Accordion
      className="mx-auto w-full max-w-[850px] space-y-4"
      defaultValue="1"
      enableScrollAnimation={true}
      animationDelay={0.1}>
      {faqItems.map((item) => (
        <AccordionItem
          className="dark:bg-background-7 rounded-[20px] bg-white px-6 sm:px-8"
          key={item.id}
          value={item.id.toString()}>
          <AccordionTrigger
            titleClassName="flex-1 text-left sm:text-heading-6 text-tagline-1 font-normal text-secondary dark:text-accent"
            className="flex w-full cursor-pointer items-center justify-between pt-5 pb-5 sm:pt-8 sm:pb-8"
            value={item.id.toString()}
            iconType="arrow">
            {item.question}
          </AccordionTrigger>
          <AccordionContent value={item.id.toString()}>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default GeneralTab;
