import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ResponsiveDialogProps {
  ariaLabel: string;
  ariaDescribedBy?: string;
  children: React.ReactNode;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  dismissible?: boolean;
  role?: 'dialog' | 'alertdialog';
  overlayClassName?: string;
  panelClassName?: string;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  ariaLabel,
  ariaDescribedBy,
  children,
  onClose,
  closeOnBackdrop = false,
  dismissible = true,
  role = 'dialog',
  overlayClassName = '',
  panelClassName = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const backgroundElements = Array.from(document.body.children)
      .filter((element) => element !== overlayRef.current)
      .map((element) => ({
        element: element as HTMLElement,
        inert: (element as HTMLElement).inert,
        ariaHidden: element.getAttribute('aria-hidden'),
      }));

    backgroundElements.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });

    const focusPanel = window.requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? panelRef.current)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible && onCloseRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = (Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ) as HTMLElement[]).filter(
        (element) =>
          !element.hidden &&
          element.getAttribute('aria-hidden') !== 'true' &&
          element.getClientRects().length > 0,
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusPanel);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [dismissible]);

  return createPortal(
    <div
      ref={overlayRef}
      className={`responsive-dialog-overlay ${overlayClassName}`}
      onMouseDown={(event) => {
        if (closeOnBackdrop && dismissible && onClose && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={`responsive-dialog-panel ${panelClassName}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
