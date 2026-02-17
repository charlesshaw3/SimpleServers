import { type MouseEvent, type RefObject, useCallback, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(", ");

type AccessibleDialogOptions = {
  open: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onRequestClose?: () => void;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  restoreFocus?: boolean;
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    if (element.hasAttribute("disabled")) {
      return false;
    }
    if (element.getAttribute("aria-hidden") === "true") {
      return false;
    }
    return element.offsetParent !== null || element === document.activeElement;
  });
}

export function useAccessibleDialog(options: AccessibleDialogOptions): {
  onBackdropClick: (event: MouseEvent<HTMLElement>) => void;
} {
  const {
    open,
    dialogRef,
    initialFocusRef,
    onRequestClose,
    closeOnEscape = true,
    closeOnBackdropClick = true,
    restoreFocus = true
  } = options;

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const timer = window.setTimeout(() => {
      const preferredTarget = initialFocusRef?.current;
      if (preferredTarget && !preferredTarget.hasAttribute("disabled")) {
        preferredTarget.focus();
        return;
      }
      const focusables = getFocusableElements(dialog);
      if (focusables.length > 0) {
        focusables[0].focus();
        return;
      }
      dialog.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && closeOnEscape && onRequestClose) {
        event.preventDefault();
        onRequestClose();
        return;
      }

      const target = event.target as Node | null;
      if (!dialog.contains(target)) {
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusables = getFocusableElements(dialog);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dialogRef, initialFocusRef, onRequestClose, closeOnEscape]);

  useEffect(() => {
    if (open || !restoreFocus) {
      return;
    }
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open, restoreFocus]);

  const onBackdropClick = useCallback(
    (event: MouseEvent<HTMLElement>): void => {
      if (!closeOnBackdropClick || !onRequestClose) {
        return;
      }
      if (event.target === event.currentTarget) {
        onRequestClose();
      }
    },
    [closeOnBackdropClick, onRequestClose]
  );

  return {
    onBackdropClick
  };
}
