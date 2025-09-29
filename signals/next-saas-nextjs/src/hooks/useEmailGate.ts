'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSession } from 'next-auth/react';

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

interface EmailGateData {
  email: string;
  timestamp: number;
  source: string;
  verified?: boolean;
}

export const useEmailGate = () => {
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const supabase = createClient();
  const { data: session, status } = useSession();

  // Check if Supabase is configured
  const isSupabaseConfigured = Boolean(supabase);

  useEffect(() => {
    checkEmailStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const checkEmailStatus = async () => {
    try {
      // Check if user is verified via email verification cookie
      const verifiedEmail = getCookie('email_verified');
      if (verifiedEmail) {
        // Email verified users always have access
        setHasSubmittedEmail(true);
        setIsLoading(false);

        // Store in localStorage for consistency
        const gateData: EmailGateData = {
          email: verifiedEmail,
          timestamp: Date.now(),
          source: 'email_verified',
          verified: true,
        };
        localStorage.setItem('emailGate', JSON.stringify(gateData));
        return;
      }

      // Check if user is authenticated via NextAuth
      if (status === 'authenticated' && session?.user) {
        // Authenticated users always have access
        setHasSubmittedEmail(true);
        setIsLoading(false);

        // Store in localStorage for consistency
        const gateData: EmailGateData = {
          email: session.user.email || '',
          timestamp: Date.now(),
          source: 'authenticated',
          verified: true,
        };
        localStorage.setItem('emailGate', JSON.stringify(gateData));
        return;
      }

      // If Supabase is configured, check Supabase auth as fallback
      if (isSupabaseConfigured && supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setHasSubmittedEmail(true);
          setIsLoading(false);
          return;
        }
      }

      // Check localStorage for anonymous users or those who submitted email
      const stored = localStorage.getItem('emailGate');
      if (stored) {
        const data: EmailGateData = JSON.parse(stored);

        // Check if email is verified or within grace period
        if (data.verified) {
          setHasSubmittedEmail(true);
        } else {
          // Allow 30-day grace period for unverified emails
          const daysSinceSubmission = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
          if (daysSinceSubmission <= 30) {
            setHasSubmittedEmail(true);
          }
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
          if (data.verified || daysSinceSubmission <= 30) {
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
      // Don't save to localStorage yet - wait for verification
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

      // Send magic link email via our authentication system
      try {
        const response = await fetch('/api/auth/drill-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            source,
            action: 'send-magic-link',
            returnUrl: currentUrl
          }),
        });

        const data = await response.json();

        if (data.success) {
          setEmailVerificationSent(true);
          console.log('Magic link sent to:', email);

          // DO NOT set hasSubmittedEmail = true yet
          // User must verify email first

          return {
            success: true,
            emailSent: true,
            message: 'Check your email for the magic link to verify your access!'
          };
        } else {
          console.warn('Failed to send magic link:', data.error);

          // Handle rate limiting errors with specific messages
          if (response.status === 429) {
            const cooldownMsg = data.cooldownMinutes
              ? `Please try again in ${data.cooldownMinutes} minutes.`
              : 'Please try again later.';

            return {
              success: false,
              error: data.error,
              message: `${data.message} ${cooldownMsg}`,
              rateLimited: true,
              cooldownMinutes: data.cooldownMinutes
            };
          }

          return {
            success: false,
            error: data.error,
            message: data.message || 'Failed to send verification email'
          };
        }
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return {
          success: false,
          error: emailError,
          message: 'Failed to send verification email'
        };
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      return {
        success: false,
        error: error,
        message: 'Failed to submit email. Please try again.'
      };
    }
  };

  const clearEmailGate = () => {
    localStorage.removeItem('emailGate');
    setHasSubmittedEmail(false);
    setEmailVerificationSent(false);
  };

  const resendVerificationEmail = async () => {
    const stored = localStorage.getItem('emailGate');
    if (!stored) return { success: false, error: 'No email found' };

    try {
      const data: EmailGateData = JSON.parse(stored);

      const response = await fetch('/api/auth/drill-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          action: 'resend-verification'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailVerificationSent(true);
        return { success: true, message: 'Verification email resent!' };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      return { success: false, error: 'Failed to resend verification email' };
    }
  };

  return {
    hasSubmittedEmail,
    isLoading,
    submitEmail,
    clearEmailGate,
    checkEmailStatus,
    emailVerificationSent,
    resendVerificationEmail,
    isAuthenticated: status === 'authenticated',
  };
};