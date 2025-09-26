'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface EmailGateData {
  email: string;
  timestamp: number;
  source: string;
}

export const useEmailGate = () => {
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkEmailStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkEmailStatus = async () => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Authenticated users always have access
        setHasSubmittedEmail(true);
        setIsLoading(false);
        return;
      }

      // Check localStorage for anonymous users
      const stored = localStorage.getItem('emailGate');
      if (stored) {
        const data: EmailGateData = JSON.parse(stored);

        // Optional: Check if email is expired (30 days)
        const daysSinceSubmission = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
        if (daysSinceSubmission <= 30) {
          setHasSubmittedEmail(true);
        }
      }
    } catch (error) {
      console.error('Error checking email status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitEmail = async (email: string, name: string, source: string = 'drill_popup') => {
    try {
      // Save to database
      const { error } = await supabase.from('email_captures').insert({ email, source }).select().single();

      if (error && error.code !== '23505') {
        // Ignore unique constraint violation
        throw error;
      }

      // Save to localStorage
      const gateData: EmailGateData = {
        email,
        timestamp: Date.now(),
        source,
      };
      localStorage.setItem('emailGate', JSON.stringify(gateData));

      // Update state
      setHasSubmittedEmail(true);

      return { success: true };
    } catch (error) {
      console.error('Error submitting email:', error);
      return { success: false, error };
    }
  };

  const clearEmailGate = () => {
    localStorage.removeItem('emailGate');
    setHasSubmittedEmail(false);
  };

  return {
    hasSubmittedEmail,
    isLoading,
    submitEmail,
    clearEmailGate,
    checkEmailStatus,
  };
};
