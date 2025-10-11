'use client';

import privacy from '@public/images/privacy/privacy.png';
import Image from 'next/image';
import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';
import { useState } from 'react';

interface PrivacySection {
  title: string;
  titleUrdu: string;
  content: string;
  contentUrdu: string;
}

interface ListSection {
  title: string;
  titleUrdu: string;
  description?: string;
  descriptionUrdu?: string;
  items: ListItem[];
}

interface ListItem {
  title?: string;
  titleUrdu?: string;
  content: string;
  contentUrdu: string;
}

const introSection: PrivacySection = {
  title: 'PipGuru Privacy Policy',
  titleUrdu: 'پِپ گُرو رازداری کی پالیسی',
  content:
    'At PipGuru.club, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our trading education services. By accessing or using PipGuru.club, you agree to the terms outlined in this Privacy Policy.',
  contentUrdu:
    'پِپ گُرو ڈاٹ کلب میں، ہم آپ کی رازداری کی حفاظت اور آپ کی ذاتی معلومات کی سیکیورٹی کو یقینی بنانے کے لیے پرعزم ہیں۔ یہ رازداری کی پالیسی بیان کرتی ہے کہ ہم آپ کی معلومات کو کیسے جمع کرتے ہیں، استعمال کرتے ہیں، ظاہر کرتے ہیں، اور محفوظ رکھتے ہیں جب آپ ہماری ویب سائٹ کا دورہ کرتے ہیں اور ہماری ٹریڈنگ تعلیمی خدمات استعمال کرتے ہیں۔ پِپ گُرو ڈاٹ کلب تک رسائی یا استعمال کرتے ہوئے، آپ اس رازداری کی پالیسی میں بیان کردہ شرائط سے اتفاق کرتے ہیں۔',
};

const personalInfoSection: PrivacySection = {
  title: 'Information We Collect',
  titleUrdu: 'معلومات جو ہم جمع کرتے ہیں',
  content:
    'We collect various types of information to provide and improve our trading education services. This includes personal information you provide directly, technical data collected automatically, and information related to your use of our educational platform.',
  contentUrdu:
    'ہم اپنی ٹریڈنگ تعلیمی خدمات فراہم کرنے اور بہتر بنانے کے لیے مختلف قسم کی معلومات جمع کرتے ہیں۔ اس میں ذاتی معلومات شامل ہیں جو آپ براہ راست فراہم کرتے ہیں، تکنیکی ڈیٹا جو خودکار طور پر جمع ہوتا ہے، اور ہمارے تعلیمی پلیٹ فارم کے آپ کے استعمال سے متعلق معلومات۔',
};

const deviceInfoItems: ListItem[] = [
  {
    title: 'Personal Identification Information',
    titleUrdu: 'ذاتی شناختی معلومات',
    content:
      'Name, email address, phone number, country of residence, date of birth, and payment information when you register for our courses or subscribe to our services.',
    contentUrdu:
      'نام، ای میل ایڈریس، فون نمبر، رہائش کا ملک، تاریخ پیدائش، اور ادائیگی کی معلومات جب آپ ہمارے کورسز کے لیے رجسٹر کرتے ہیں یا ہماری خدمات کی سبسکرپشن لیتے ہیں۔',
  },
  {
    title: 'Technical and Device Information',
    titleUrdu: 'تکنیکی اور ڈیوائس کی معلومات',
    content:
      'IP address, browser type, operating system, device identifiers, cookies, log files, and usage data to improve your experience and secure our platform.',
    contentUrdu:
      'IP ایڈریس، براؤزر کی قسم، آپریٹنگ سسٹم، ڈیوائس کی شناخت کنندگان، کوکیز، لاگ فائلیں، اور استعمال کا ڈیٹا تاکہ آپ کے تجربے کو بہتر بنایا جا سکے اور ہمارے پلیٹ فارم کو محفوظ بنایا جا سکے۔',
  },
  {
    title: 'Trading and Educational Activity',
    titleUrdu: 'ٹریڈنگ اور تعلیمی سرگرمی',
    content:
      'Course progress, quiz results, trading simulation data, forum participation, webinar attendance, and interaction with educational materials. This data is used solely for educational purposes and improving our services.',
    contentUrdu:
      'کورس کی پیشرفت، کوئز کے نتائج، ٹریڈنگ سمیولیشن ڈیٹا، فورم کی شرکت، ویبینار کی حاضری، اور تعلیمی مواد کے ساتھ تعامل۔ یہ ڈیٹا صرف تعلیمی مقاصد اور ہماری خدمات کو بہتر بنانے کے لیے استعمال ہوتا ہے۔',
  },
  {
    title: 'Communication Data',
    titleUrdu: 'مواصلاتی ڈیٹا',
    content:
      'Messages, feedback, support requests, and any correspondence you have with our team, instructors, or other users through our platform.',
    contentUrdu:
      'پیغامات، تاثرات، سپورٹ کی درخواستیں، اور کوئی بھی خط و کتابت جو آپ ہماری ٹیم، انسٹرکٹرز، یا دیگر صارفین کے ساتھ ہمارے پلیٹ فارم کے ذریعے کرتے ہیں۔',
  },
  {
    title: 'Cookies and Tracking Technologies',
    titleUrdu: 'کوکیز اور ٹریکنگ ٹیکنالوجیز',
    content:
      'We use cookies, web beacons, pixels, and similar technologies to enhance user experience, analyze site traffic, remember preferences, and provide personalized content. You can control cookie settings through your browser.',
    contentUrdu:
      'ہم صارف کے تجربے کو بہتر بنانے، سائٹ ٹریفک کا تجزیہ کرنے، ترجیحات یاد رکھنے، اور ذاتی نوعیت کا مواد فراہم کرنے کے لیے کوکیز، ویب بیکن، پکسلز، اور اسی طرح کی ٹیکنالوجیز استعمال کرتے ہیں۔ آپ اپنے براؤزر کے ذریعے کوکی کی ترتیبات کو کنٹرول کر سکتے ہیں۔',
  },
];

const useInfoSection: ListSection = {
  title: 'How We Use Your Information',
  titleUrdu: 'ہم آپ کی معلومات کیسے استعمال کرتے ہیں',
  description:
    'We use your information for the following legitimate business purposes to provide you with high-quality trading education:',
  descriptionUrdu:
    'ہم آپ کی معلومات کو مندرجہ ذیل جائز کاروباری مقاصد کے لیے استعمال کرتے ہیں تاکہ آپ کو اعلیٰ معیار کی ٹریڈنگ تعلیم فراہم کی جا سکے:',
  items: [
    {
      content: 'Provide access to trading courses, webinars, educational materials, and trading signals',
      contentUrdu: 'ٹریڈنگ کورسز، ویبینارز، تعلیمی مواد، اور ٹریڈنگ سگنلز تک رسائی فراہم کرنا',
    },
    {
      content: 'Process payments, subscriptions, and manage your account',
      contentUrdu: 'ادائیگیوں، سبسکرپشنز کو پروسیس کرنا، اور آپ کے اکاؤنٹ کا انتظام کرنا',
    },
    {
      content:
        'Personalize your learning experience based on your progress, preferences, and trading interests',
      contentUrdu:
        'آپ کی پیشرفت، ترجیحات، اور ٹریڈنگ دلچسپیوں کی بنیاد پر آپ کے سیکھنے کے تجربے کو ذاتی نوعیت کا بنانا',
    },
    {
      content:
        'Send important notifications about course updates, market analysis, trading signals, and platform changes',
      contentUrdu:
        'کورس اپ ڈیٹس، مارکیٹ تجزیہ، ٹریڈنگ سگنلز، اور پلیٹ فارم کی تبدیلیوں کے بارے میں اہم اطلاعات بھیجنا',
    },
    {
      content: 'Respond to your inquiries, provide customer support, and resolve technical issues',
      contentUrdu:
        'آپ کے سوالات کا جواب دینا، کسٹمر سپورٹ فراہم کرنا، اور تکنیکی مسائل حل کرنا',
    },
    {
      content:
        'Conduct research and analytics to improve our courses, content quality, and educational methodology',
      contentUrdu:
        'ہمارے کورسز، مواد کے معیار، اور تعلیمی طریقہ کار کو بہتر بنانے کے لیے تحقیق اور تجزیات کرنا',
    },
    {
      content:
        'Detect and prevent fraud, unauthorized access, security breaches, and other illegal activities',
      contentUrdu:
        'دھوکہ دہی، غیر مجاز رسائی، سیکیورٹی کی خلاف ورزیوں، اور دیگر غیر قانونی سرگرمیوں کا پتہ لگانا اور روکنا',
    },
    {
      content:
        'Comply with legal obligations, regulatory requirements, and enforce our terms of service',
      contentUrdu:
        'قانونی ذمہ داریوں، ریگولیٹری تقاضوں کی تعمیل، اور ہماری سروس کی شرائط کو نافذ کرنا',
    },
    {
      content:
        'Send promotional emails, newsletters, and marketing communications (you can opt-out anytime)',
      contentUrdu:
        'پروموشنل ای میلز، نیوز لیٹرز، اور مارکیٹنگ مواصلات بھیجنا (آپ کسی بھی وقت آپٹ آؤٹ کر سکتے ہیں)',
    },
  ],
};

const sharingInfoSection: ListSection = {
  title: 'Sharing and Disclosure of Information',
  titleUrdu: 'معلومات کا اشتراک اور انکشاف',
  description:
    'We respect your privacy and only share your information in the following limited circumstances:',
  descriptionUrdu:
    'ہم آپ کی رازداری کا احترام کرتے ہیں اور صرف مندرجہ ذیل محدود حالات میں آپ کی معلومات شیئر کرتے ہیں:',
  items: [
    {
      content:
        'Service Providers: We work with trusted third-party companies for payment processing (Stripe, PayPal), email services, hosting, analytics (Google Analytics), and customer support. These partners are bound by strict confidentiality agreements.',
      contentUrdu:
        'سروس فراہم کنندگان: ہم ادائیگی کی پروسیسنگ (سٹرائپ، پے پال)، ای میل سروسز، ہوسٹنگ، تجزیات (گوگل اینالیٹکس)، اور کسٹمر سپورٹ کے لیے قابل اعتماد فریق ثالث کمپنیوں کے ساتھ کام کرتے ہیں۔ یہ شراکت دار سخت رازداری کے معاہدوں سے پابند ہیں۔',
    },
    {
      content:
        'Legal Requirements: We may disclose information when required by law, court order, legal process, or to protect our rights, property, safety, or that of our users.',
      contentUrdu:
        'قانونی تقاضے: ہم معلومات کو اس وقت ظاہر کر سکتے ہیں جب قانون، عدالتی حکم، قانونی عمل کی ضرورت ہو، یا اپنے حقوق، املاک، حفاظت، یا اپنے صارفین کی حفاظت کے لیے۔',
    },
    {
      content:
        'Business Transfers: In the event of merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, with continued protection under this policy.',
      contentUrdu:
        'کاروباری منتقلی: انضمام، حصول، یا اثاثوں کی فروخت کی صورت میں، آپ کی معلومات اس لین دین کے حصے کے طور پر منتقل ہو سکتی ہیں، اس پالیسی کے تحت مسلسل تحفظ کے ساتھ۔',
    },
    {
      content:
        'With Your Consent: We will share your information when you explicitly authorize us to do so, such as when participating in partner promotions or third-party integrations.',
      contentUrdu:
        'آپ کی رضامندی کے ساتھ: ہم آپ کی معلومات کو اس وقت شیئر کریں گے جب آپ ہمیں واضح طور پر ایسا کرنے کی اجازت دیتے ہیں، جیسے کہ پارٹنر پروموشنز یا فریق ثالث انضمام میں حصہ لیتے وقت۔',
    },
    {
      content:
        'We DO NOT sell, rent, or trade your personal information to third parties for their marketing purposes.',
      contentUrdu:
        'ہم آپ کی ذاتی معلومات کو فریق ثالث کو ان کی مارکیٹنگ کے مقاصد کے لیے فروخت، کرایہ پر، یا تبادلہ نہیں کرتے۔',
    },
  ],
};

const securitySection: PrivacySection = {
  title: 'Data Security',
  titleUrdu: 'ڈیٹا سیکیورٹی',
  content:
    'We implement industry-standard security measures to protect your information, including SSL encryption, secure servers, firewalls, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure. We continuously monitor and update our security practices to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.',
  contentUrdu:
    'ہم آپ کی معلومات کی حفاظت کے لیے صنعت کے معیاری سیکیورٹی اقدامات نافذ کرتے ہیں، بشمول SSL انکرپشن، محفوظ سرورز، فائر والز، باقاعدہ سیکیورٹی آڈٹس، اور رسائی کنٹرول۔ تاہم، انٹرنیٹ پر منتقلی کا کوئی طریقہ 100٪ محفوظ نہیں ہے۔ ہم آپ کی ذاتی معلومات کو غیر مجاز رسائی، تبدیلی، انکشاف، یا تباہی سے بچانے کے لیے اپنے سیکیورٹی طریقوں کی مسلسل نگرانی اور تازہ کاری کرتے ہیں۔',
};

const rightsSection: ListSection = {
  title: 'Your Privacy Rights',
  titleUrdu: 'آپ کے رازداری کے حقوق',
  description:
    'Depending on your location, you may have the following rights regarding your personal information:',
  descriptionUrdu:
    'آپ کے مقام کے لحاظ سے، آپ کو اپنی ذاتی معلومات کے حوالے سے مندرجہ ذیل حقوق حاصل ہو سکتے ہیں:',
  items: [
    {
      content: 'Access: Request a copy of the personal information we hold about you',
      contentUrdu: 'رسائی: آپ کے بارے میں ہمارے پاس موجود ذاتی معلومات کی کاپی کی درخواست کریں',
    },
    {
      content: 'Correction: Request correction of inaccurate or incomplete information',
      contentUrdu: 'درستگی: غلط یا نامکمل معلومات کی درستگی کی درخواست کریں',
    },
    {
      content: 'Deletion: Request deletion of your personal information (right to be forgotten)',
      contentUrdu: 'حذف: اپنی ذاتی معلومات کو حذف کرنے کی درخواست کریں (بھلائے جانے کا حق)',
    },
    {
      content: 'Restriction: Request restriction of processing of your information',
      contentUrdu: 'پابندی: اپنی معلومات کی پروسیسنگ کی پابندی کی درخواست کریں',
    },
    {
      content: 'Portability: Request transfer of your information to another service',
      contentUrdu: 'منتقلی: اپنی معلومات کو دوسری سروس میں منتقل کرنے کی درخواست کریں',
    },
    {
      content: 'Opt-out: Unsubscribe from marketing communications at any time',
      contentUrdu: 'آپٹ آؤٹ: کسی بھی وقت مارکیٹنگ مواصلات سے ان سبسکرائب کریں',
    },
    {
      content:
        'Object: Object to processing based on legitimate interests or for direct marketing purposes',
      contentUrdu:
        'اعتراض: جائز مفادات کی بنیاد پر یا براہ راست مارکیٹنگ کے مقاصد کے لیے پروسیسنگ پر اعتراض کریں',
    },
  ],
};

const internationalSection: PrivacySection = {
  title: 'International Data Transfers',
  titleUrdu: 'بین الاقوامی ڈیٹا منتقلی',
  content:
    'PipGuru.club operates globally and may transfer and store your information in countries outside your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws, including GDPR (European Union), CCPA (California), and other regional privacy regulations.',
  contentUrdu:
    'پِپ گُرو ڈاٹ کلب عالمی سطح پر کام کرتا ہے اور آپ کی معلومات کو آپ کی رہائش کے ملک سے باہر ممالک میں منتقل اور محفوظ کر سکتا ہے۔ ہم اس بات کو یقینی بناتے ہیں کہ اس رازداری کی پالیسی اور قابل اطلاق ڈیٹا تحفظ کے قوانین، بشمول GDPR (یورپی یونین)، CCPA (کیلیفورنیا)، اور دیگر علاقائی رازداری کے ضوابط کے مطابق آپ کی معلومات کی حفاظت کے لیے مناسب حفاظتی اقدامات موجود ہیں۔',
};

const simpleSections: PrivacySection[] = [
  {
    title: 'Third-Party Links and Services',
    titleUrdu: 'فریق ثالث کے لنکس اور خدمات',
    content:
      'Our website may contain links to third-party websites, broker platforms, trading tools, or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.',
    contentUrdu:
      'ہماری ویب سائٹ میں فریق ثالث کی ویب سائٹس، بروکر پلیٹ فارمز، ٹریڈنگ ٹولز، یا خدمات کے لنکس ہو سکتے ہیں۔ ہم ان بیرونی سائٹس کے رازداری کے طریقوں کے لیے ذمہ دار نہیں ہیں۔ ہم آپ کی حوصلہ افزائی کرتے ہیں کہ آپ کسی بھی ذاتی معلومات فراہم کرنے سے پہلے ان کی رازداری کی پالیسیوں کا جائزہ لیں۔',
  },
  {
    title: 'Children\'s Privacy',
    titleUrdu: 'بچوں کی رازداری',
    content:
      'PipGuru.club is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. Trading and financial education involves risks and is suitable only for adults. If we become aware that we have collected information from a child under 18, we will promptly delete it.',
    contentUrdu:
      'پِپ گُرو ڈاٹ کلب 18 سال سے کم عمر کے افراد کے لیے نہیں ہے۔ ہم جان بوجھ کر بچوں سے ذاتی معلومات جمع نہیں کرتے۔ ٹریڈنگ اور مالیاتی تعلیم میں خطرات شامل ہیں اور صرف بالغوں کے لیے موزوں ہے۔ اگر ہمیں پتہ چلتا ہے کہ ہم نے 18 سال سے کم عمر کے بچے سے معلومات جمع کی ہیں، تو ہم اسے فوری طور پر حذف کر دیں گے۔',
  },
  {
    title: 'Data Retention',
    titleUrdu: 'ڈیٹا برقرار رکھنا',
    content:
      'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When your account is closed or information is no longer needed, we will securely delete or anonymize it, unless we are required by law to retain it longer.',
    contentUrdu:
      'ہم آپ کی ذاتی معلومات کو اتنی دیر تک برقرار رکھتے ہیں جتنا ہماری خدمات فراہم کرنے، قانونی ذمہ داریوں کی تعمیل، تنازعات حل کرنے، اور ہمارے معاہدوں کو نافذ کرنے کے لیے ضروری ہو۔ جب آپ کا اکاؤنٹ بند ہو جاتا ہے یا معلومات کی مزید ضرورت نہیں ہوتی، تو ہم اسے محفوظ طریقے سے حذف یا گمنام کر دیں گے، جب تک کہ ہمیں قانون کی طرف سے اسے زیادہ دیر تک برقرار رکھنے کی ضرورت نہ ہو۔',
  },
  {
    title: 'Do Not Track Signals',
    titleUrdu: 'ٹریک نہ کرنے کے سگنلز',
    content:
      'Currently, our website does not respond to "Do Not Track" (DNT) browser signals. However, you can control cookies and tracking through your browser settings or opt-out of third-party analytics services.',
    contentUrdu:
      'فی الوقت، ہماری ویب سائٹ "ٹریک نہ کریں" (DNT) براؤزر سگنلز کا جواب نہیں دیتی۔ تاہم، آپ اپنے براؤزر کی ترتیبات کے ذریعے کوکیز اور ٹریکنگ کو کنٹرول کر سکتے ہیں یا فریق ثالث کے تجزیاتی خدمات سے آپٹ آؤٹ کر سکتے ہیں۔',
  },
  {
    title: 'Changes to This Privacy Policy',
    titleUrdu: 'اس رازداری کی پالیسی میں تبدیلیاں',
    content:
      'We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. We will notify you of significant changes by email or prominent notice on our website. The "Last Updated" date at the top indicates when this policy was last revised. Your continued use of our services after changes constitutes acceptance of the updated policy.',
    contentUrdu:
      'ہم اپنے طریقوں، قانونی تقاضوں، یا آپریشنل ضروریات میں تبدیلیوں کی عکاسی کے لیے وقتاً فوقتاً اس رازداری کی پالیسی کو تازہ کر سکتے ہیں۔ ہم آپ کو اہم تبدیلیوں کی اطلاع ای میل یا ہماری ویب سائٹ پر نمایاں نوٹس کے ذریعے دیں گے۔ سب سے اوپر "آخری بار تازہ کاری" کی تاریخ اس بات کی نشاندہی کرتی ہے کہ اس پالیسی کو آخری بار کب نظر ثانی کی گئی تھی۔ تبدیلیوں کے بعد ہماری خدمات کا آپ کا مسلسل استعمال تازہ کاری شدہ پالیسی کی قبولیت ہے۔',
  },
  {
    title: 'Educational Purpose Disclaimer',
    titleUrdu: 'تعلیمی مقصد کی دستبرداری',
    content:
      'All information provided through PipGuru.club is for educational and informational purposes only. Trading involves significant risk, and past performance does not guarantee future results. We do not provide financial advice, and nothing on this platform should be construed as such. Always consult with a licensed financial advisor before making trading decisions.',
    contentUrdu:
      'پِپ گُرو ڈاٹ کلب کے ذریعے فراہم کردہ تمام معلومات صرف تعلیمی اور معلوماتی مقاصد کے لیے ہیں۔ ٹریڈنگ میں اہم خطرہ شامل ہے، اور ماضی کی کارکردگی مستقبل کے نتائج کی ضمانت نہیں دیتی۔ ہم مالیاتی مشورہ فراہم نہیں کرتے، اور اس پلیٹ فارم پر کسی بھی چیز کو اس طرح تعبیر نہیں کیا جانا چاہیے۔ ٹریڈنگ کے فیصلے کرنے سے پہلے ہمیشہ لائسنس یافتہ مالیاتی مشیر سے مشورہ کریں۔',
  },
];

const contactSection: PrivacySection = {
  title: 'Contact Us',
  titleUrdu: 'ہم سے رابطہ کریں',
  content:
    'If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us at: <strong>Email: privacy@pipguru.club</strong> | <strong>Website: www.pipguru.club</strong> | We will respond to your inquiry within 30 days.',
  contentUrdu:
    'اگر آپ کو اس رازداری کی پالیسی یا ہم آپ کی ذاتی معلومات کو کیسے سنبھالتے ہیں کے بارے میں کوئی سوالات، خدشات، یا درخواستیں ہیں، تو براہ کرم ہم سے رابطہ کریں: <strong>ای میل: privacy@pipguru.club</strong> | <strong>ویب سائٹ: www.pipguru.club</strong> | ہم 30 دنوں کے اندر آپ کے سوال کا جواب دیں گے۔',
};

const PrivacyContent = () => {
  const [isUrdu, setIsUrdu] = useState(false);

  const toggleLanguage = () => {
    setIsUrdu(!isUrdu);
  };

  return (
    <section className="pb-[100px] pt-[100px]">
      <div className="main-container">
        <div className="space-y-[75px] privacy-policy">
          {/* Language Toggle */}
          <RevealAnimation delay={0.05}>
            <div className="flex justify-end mb-8">
              <button
                onClick={toggleLanguage}
                className="btn btn-primary hover:btn-secondary dark:hover:btn-accent px-6 py-2 rounded-full text-sm font-medium transition-all">
                {isUrdu ? 'Switch to English' : 'اردو میں دیکھیں'}
              </button>
            </div>
          </RevealAnimation>

          {/* Header Section */}
          <div className="space-y-2">
            <RevealAnimation delay={0.1}>
              <h2 className={isUrdu ? 'text-right font-urdu !font-bold !text-4xl' : ''}>
                {isUrdu ? introSection.titleUrdu : introSection.title}
              </h2>
            </RevealAnimation>
            <RevealAnimation delay={0.15}>
              <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                <span className="text-secondary dark:text-accent font-semibold">PipGuru.club</span>{' '}
                {isUrdu ? (
                  <span dangerouslySetInnerHTML={{ __html: introSection.contentUrdu }} />
                ) : (
                  <span>{introSection.content}</span>
                )}
              </p>
            </RevealAnimation>
            <RevealAnimation delay={0.2}>
              <p className={`text-sm text-secondary/70 dark:text-accent/70 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                {isUrdu ? 'آخری بار تازہ کاری: جنوری 2025' : 'Last Updated: January 2025'}
              </p>
            </RevealAnimation>
          </div>

          {/* Information We Collect */}
          <div className="space-y-6">
            <RevealAnimation delay={0.25}>
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? personalInfoSection.titleUrdu : personalInfoSection.title}
                </h4>
                <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                  {isUrdu ? personalInfoSection.contentUrdu : personalInfoSection.content}
                </p>
              </div>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <ul
                className={`space-y-4 text-tagline-1 font-normal text-secondary/80 dark:text-accent/80 ${isUrdu ? 'text-right font-urdu !text-base !leading-[2.5]' : ''}`}>
                {deviceInfoItems.map((item, index) => (
                  <li key={index} className="p-4 rounded-lg bg-background-1 dark:bg-background-8">
                    <strong className={`text-secondary dark:text-accent block mb-2 ${isUrdu ? '!font-bold !text-lg' : ''}`}>
                      {isUrdu ? item.titleUrdu : item.title}
                    </strong>
                    <span className={isUrdu ? '!text-base !leading-[2.5]' : ''}>
                      {isUrdu ? item.contentUrdu : item.content}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealAnimation>
          </div>

          {/* How We Use Information */}
          <RevealAnimation delay={0.35}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? useInfoSection.titleUrdu : useInfoSection.title}
                </h4>
                <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                  {isUrdu ? useInfoSection.descriptionUrdu : useInfoSection.description}
                </p>
              </div>
              <ul
                className={`space-y-2 list-disc list-inside text-tagline-1 font-normal text-secondary/80 dark:text-accent/80 ${isUrdu ? 'text-right font-urdu !text-base !leading-[2.5]' : ''}`}>
                {useInfoSection.items.map((item, index) => (
                  <li key={index}>{isUrdu ? item.contentUrdu : item.content}</li>
                ))}
              </ul>
            </div>
          </RevealAnimation>

          {/* Sharing Information */}
          <RevealAnimation delay={0.4}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? sharingInfoSection.titleUrdu : sharingInfoSection.title}
                </h4>
                <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                  {isUrdu ? sharingInfoSection.descriptionUrdu : sharingInfoSection.description}
                </p>
              </div>
              <ul
                className={`space-y-3 text-tagline-1 font-normal text-secondary/80 dark:text-accent/80 ${isUrdu ? 'text-right font-urdu !text-base !leading-[2.5]' : ''}`}>
                {sharingInfoSection.items.map((item, index) => (
                  <li key={index} className="p-3 rounded-lg bg-background-1 dark:bg-background-8">
                    {isUrdu ? item.contentUrdu : item.content}
                  </li>
                ))}
              </ul>
            </div>
          </RevealAnimation>

          {/* Security */}
          <RevealAnimation delay={0.45}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? securitySection.titleUrdu : securitySection.title}
                </h4>
                <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                  {isUrdu ? securitySection.contentUrdu : securitySection.content}
                </p>
              </div>
            </div>
          </RevealAnimation>

          {/* Your Rights */}
          <RevealAnimation delay={0.5}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? rightsSection.titleUrdu : rightsSection.title}
                </h4>
                <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                  {isUrdu ? rightsSection.descriptionUrdu : rightsSection.description}
                </p>
              </div>
              <ul
                className={`space-y-2 list-disc list-inside text-tagline-1 font-normal text-secondary/80 dark:text-accent/80 ${isUrdu ? 'text-right font-urdu !text-base !leading-[2.5]' : ''}`}>
                {rightsSection.items.map((item, index) => (
                  <li key={index}>{isUrdu ? item.contentUrdu : item.content}</li>
                ))}
              </ul>
            </div>
          </RevealAnimation>

          {/* International Transfers */}
          <RevealAnimation delay={0.55}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? internationalSection.titleUrdu : internationalSection.title}
                </h4>
                <p className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}>
                  {isUrdu ? internationalSection.contentUrdu : internationalSection.content}
                </p>
              </div>
            </div>
          </RevealAnimation>

          {/* Additional Sections */}
          {simpleSections.map((section, index) => (
            <RevealAnimation key={section.title} delay={0.6 + index * 0.05}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                    {isUrdu ? section.titleUrdu : section.title}
                  </h4>
                  <p
                    className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}
                    dangerouslySetInnerHTML={{ __html: isUrdu ? section.contentUrdu : section.content }}
                  />
                </div>
              </div>
            </RevealAnimation>
          ))}

          {/* Contact Section */}
          <RevealAnimation delay={0.9}>
            <div className="space-y-6 p-8 rounded-2xl bg-primary-500/10 dark:bg-accent/10 border-2 border-primary-500/20 dark:border-accent/20">
              <div className="space-y-2">
                <h4 className={isUrdu ? 'text-right font-urdu !font-bold !text-2xl' : ''}>
                  {isUrdu ? contactSection.titleUrdu : contactSection.title}
                </h4>
                <p
                  className={isUrdu ? 'text-right font-urdu !text-lg !leading-[2.5]' : ''}
                  dangerouslySetInnerHTML={{ __html: isUrdu ? contactSection.contentUrdu : contactSection.content }}
                />
              </div>
            </div>
          </RevealAnimation>

          {/* Risk Warning */}
          <RevealAnimation delay={0.95}>
            <div className="p-6 rounded-xl bg-yellow-500/10 border-l-4 border-yellow-500">
              <p className={`text-sm font-medium ${isUrdu ? 'text-right font-urdu !text-base !leading-[2.5]' : ''}`}>
                {isUrdu ? (
                  <>
                    <strong className="text-yellow-600 dark:text-yellow-400">خطرے کی وارننگ:</strong> فاریکس اور CFD
                    ٹریڈنگ میں نقصان کا خطرہ زیادہ ہے اور تمام سرمایہ کاروں کے لیے موزوں نہیں۔ آپ اپنی ابتدائی
                    سرمایہ کاری سے زیادہ کھو سکتے ہیں۔ صرف وہ رقم استعمال کریں جو آپ کھونے کی استطاعت رکھتے ہیں۔
                    براہ کرم یقینی بنائیں کہ آپ اس میں شامل خطرات کو پوری طرح سمجھتے ہیں اور ضرورت پڑنے پر آزاد
                    مشورہ لیں۔
                  </>
                ) : (
                  <>
                    <strong className="text-yellow-600 dark:text-yellow-400">Risk Warning:</strong> Forex and CFD
                    trading carries a high level of risk and may not be suitable for all investors. You can lose more
                    than your initial investment. Only trade with money you can afford to lose. Please ensure you fully
                    understand the risks involved and seek independent advice if necessary.
                  </>
                )}
              </p>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default PrivacyContent;
