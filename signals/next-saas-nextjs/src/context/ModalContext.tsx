'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useModal } from '@/hooks/useModal';
import { useEmailGate } from '@/hooks/useEmailGate';

interface ModalContextType {
  videoModal: {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    modalRef: React.RefObject<HTMLDialogElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
  };
  drillAccessModal: {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    modalRef: React.RefObject<HTMLDialogElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
  };
  emailGate: {
    isOpen: boolean;
    openEmailGate: () => void;
    closeEmailGate: () => void;
    hasSubmittedEmail: boolean;
    isLoading: boolean;
    submitEmail: (email: string, name: string, source?: string) => Promise<{ success: boolean; error?: unknown }>;
  };
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isEmailGateOpen, setIsEmailGateOpen] = useState(false);
  const { hasSubmittedEmail, isLoading, submitEmail } = useEmailGate();

  const videoModal = useModal({
    closeOnEscape: true,
    closeOnOverlayClick: true,
  });

  const drillAccessModal = useModal({
    closeOnEscape: true,
    closeOnOverlayClick: true,
  });

  const openEmailGate = useCallback(() => setIsEmailGateOpen(true), []);
  const closeEmailGate = useCallback(() => setIsEmailGateOpen(false), []);

  const value: ModalContextType = {
    videoModal,
    drillAccessModal,
    emailGate: {
      isOpen: isEmailGateOpen,
      openEmailGate,
      closeEmailGate,
      hasSubmittedEmail,
      isLoading,
      submitEmail,
    },
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export default ModalProvider;
