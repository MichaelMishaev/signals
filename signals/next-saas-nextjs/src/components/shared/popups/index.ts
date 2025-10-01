/**
 * Trading Popups System
 *
 * 10 Responsive popup designs for trading platform
 * Live Signal Toast with email confirmation flow
 *
 * Usage:
 * import { TradingPopup, usePopup, LiveSignalToast, useLiveSignalToast } from '@/components/shared/popups';
 *
 * // For general popups
 * const { isOpen, showPopup, hidePopup, PopupComponent } = usePopup({
 *   variant: 'profit-alert',
 *   showDelay: 0,
 *   autoDismiss: 0,
 *   frequency: 'always',
 * });
 *
 * // For Live Signal Toast with email confirmation
 * const { showToast, hideToast, confirmEmail, toastData } = useLiveSignalToast();
 */

export { TradingPopup, usePopup, type PopupVariant } from './TradingPopups';
export { LiveSignalToast, useLiveSignalToast } from './LiveSignalToast';
export { EmailConfirmationFlow } from './EmailConfirmationFlow';
export { StartTradingFlow } from './StartTradingFlow';
export { RandomPopupGenerator, useRandomPopup } from './RandomPopupGenerator';
export { default } from './TradingPopups';