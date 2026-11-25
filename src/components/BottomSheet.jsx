import { useEffect, useId, useRef } from "react";

import { CloseIcon } from "./Icons";

/**
 * BottomSheet is a modal panel built on the native <dialog> element.
 *
 * Phones: slides up from the bottom edge, full width.
 * Tablets/desktop: shown as a centred dialog.
 *
 * <dialog> gives us focus trapping, Escape-to-close and a backdrop for free.
 */
function BottomSheet({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();

    document.documentElement.classList.toggle("sheet-open", open);
  }, [open]);

  // Never leave the page scroll-locked if the sheet unmounts while open.
  useEffect(() => () => document.documentElement.classList.remove("sheet-open"), []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click that lands on the <dialog> itself (not its content) is a backdrop click.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="sheet fixed inset-x-0 top-auto bottom-0 m-0 max-h-[92dvh] w-full max-w-none rounded-t-[2rem] border border-b-0 border-line bg-[#101026] p-0 text-white shadow-2xl sm:inset-0 sm:m-auto sm:max-h-[88dvh] sm:max-w-lg sm:rounded-[2rem] sm:border-b"
    >
      <div className="max-h-[92dvh] overflow-y-auto overscroll-contain sm:max-h-[88dvh]">
        <div className="sticky top-0 z-10 bg-[#101026]/95 px-5 pt-3 pb-3 backdrop-blur sm:px-6 sm:pt-5">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden="true" />

          <div className="flex items-center justify-between gap-4">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-muted transition hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">{open && children}</div>
      </div>
    </dialog>
  );
}

export default BottomSheet;
