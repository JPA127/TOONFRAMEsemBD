import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** botão de confirmar em vermelho (ações que não podem ser desfeitas) */
  destructive?: boolean;
  onConfirm: () => void;
}

// Aviso de confirmação ("Tem certeza?"). Usa AlertDialog: o foco inicial fica em CANCELAR.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "CANCELAR",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/70 z-[60]" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[calc(100%-2rem)] max-w-md bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.25)] p-6">
          <AlertDialog.Title className="text-2xl font-black mb-3">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-gray-700 dark:text-gray-200 mb-6">
            {description}
          </AlertDialog.Description>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="flex-1 bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 px-6 py-3 font-black border-4 border-black dark:border-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className={
                  destructive
                    ? "flex-1 bg-red-600 dark:bg-red-700 text-white px-6 py-3 font-black border-4 border-black dark:border-neutral-400 hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                    : "flex-1 bg-yellow-400 text-black px-6 py-3 font-black border-4 border-black dark:border-neutral-400 hover:bg-yellow-300 transition-colors"
                }
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
