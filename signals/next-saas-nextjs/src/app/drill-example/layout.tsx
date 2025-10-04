import { ModalProvider } from '@/context/ModalContext';
import { ReactNode } from 'react';

export default function DrillExampleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ModalProvider>{children}</ModalProvider>;
}
