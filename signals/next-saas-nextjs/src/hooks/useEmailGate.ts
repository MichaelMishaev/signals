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

  // Check if Supabase is configured
  const isSupabaseConfigured = Boolean(supabase);

  useEffect(() => {
    checkEmailStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkEmailStatus = async () => {
    try {
      // If Supabase is not configured, skip auth check
      if (isSupabaseConfigured && supabase) {
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
      // On error, check localStorage fallback
      const stored = localStorage.getItem('emailGate');
      if (stored) {
        try {
          const data: EmailGateData = JSON.parse(stored);
          const daysSinceSubmission = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
          if (daysSinceSubmission <= 30) {
            setHasSubmittedEmail(true);
          }
        } catch (parseError) {
          console.error('Error parsing stored email data:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitEmail = async (email: string, name: string, source: string = 'drill_popup') => {
    try {
      // Only attempt database save if Supabase is configured
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('email_captures').insert({ email, source }).select().single();

        if (error && error.code !== '23505') {
          // Ignore unique constraint violation, throw others
          console.warn('Database save failed, using localStorage only:', error.message);
        }
      }

      // Always save to localStorage as fallback
      const gateData: EmailGateData = {
        email,
        timestamp: Date.now(),
        source,
      };
      localStorage.setItem('emailGate', JSON.stringify(gateData));

      // Update state
      setHasSubmittedEmail(true);

      console.log(`Email captured: ${email} (${isSupabaseConfigured ? 'DB + Local' : 'Local only'})`);
      return { success: true };
    } catch (error) {
      console.error('Error submitting email:', error);

      // On any error, still save to localStorage to prevent popup loop
      try {
        const gateData: EmailGateData = {
          email,
          timestamp: Date.now(),
          source,
        };
        localStorage.setItem('emailGate', JSON.stringify(gateData));
        setHasSubmittedEmail(true);

        console.log('Email saved to localStorage only due to error');
        return { success: true };
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
        return { success: false, error: storageError };
      }
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
