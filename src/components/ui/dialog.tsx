"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Lenis from "lenis";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

function useDialog() {
  return useContext(DialogContext);
}

export function Dialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const { onOpenChange } = useDialog();

  if (asChild) {
    return (
      <span onClick={() => onOpenChange(true)} className="contents">
        {children}
      </span>
    );
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
}

export function DialogOverlay() {
  const { onOpenChange } = useDialog();
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      onClick={() => onOpenChange(false)}
    />
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, onOpenChange } = useDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Lenis smooth scroll on the outer dialog wrapper
  useEffect(() => {
    if (!open || !wrapperRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: wrapperRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      prevent: (node: HTMLElement) => node.tagName === "TEXTAREA",
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [open]);

  // Focus trap — focus content on open
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div ref={wrapperRef} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-4 sm:py-8">
      <DialogOverlay />
      <div
        ref={contentRef}
        tabIndex={-1}
        className={cn(
          "relative z-50 w-[95vw] max-w-5xl rounded-xl border border-neutral-200 bg-background shadow-xl outline-none animate-in fade-in-0 zoom-in-95 dark:border-neutral-800",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogClose({
  className,
}: {
  className?: string;
}) {
  const { onOpenChange } = useDialog();
  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className={cn(
        "rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
        className
      )}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}
