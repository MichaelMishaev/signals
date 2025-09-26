'use client';

import { useEffect } from 'react';
import { useModalContext } from '@/context/ModalContext';
import EmailCardPopup from '../emailComponent/EmailCardPopup';
import DevEmailDebugBar from './DevEmailDebugBar';

interface EmailGateWrapperProps {
  children: React.ReactNode;
  source?: string;
  title?: string;
  subtitle?: string;
}

export default function EmailGateWrapper({
  children,
  source = 'drill_page',
  title = 'Access Premium Drill Content',
  subtitle = 'Get instant access to our exclusive trading drill materials',
}: EmailGateWrapperProps) {
  const { emailGate } = useModalContext();

  useEffect(() => {
    // Check if we need to show the email gate
    if (!emailGate.isLoading && !emailGate.hasSubmittedEmail) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => {
        emailGate.openEmailGate();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [emailGate.isLoading, emailGate.hasSubmittedEmail, emailGate]);

  const handleEmailSubmit = async (data: { name: string; email: string }) => {
    const result = await emailGate.submitEmail(data.email, data.name, source);

    if (result.success) {
      emailGate.closeEmailGate();
    } else {
      console.error('Failed to submit email:', result.error);
    }
  };

  return (
    <>
      <DevEmailDebugBar />
      <div className={process.env.NODE_ENV === 'development' ? 'pt-10' : ''}>{children}</div>
      <EmailCardPopup
        isOpen={emailGate.isOpen}
        onClose={emailGate.closeEmailGate}
        onSubmit={handleEmailSubmit}
        title={title}
        subtitle={subtitle}
        buttonText="Get Instant Access"
        cancelText="Maybe Later"
        headerColor="bg-gradient-to-r from-primary-500 to-primary-600"
      />
    </>
  );
}
