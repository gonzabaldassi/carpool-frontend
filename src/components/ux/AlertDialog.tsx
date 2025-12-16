import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { ReactNode } from "react"

type AlertDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  type?: "error" | "success" | "info"
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  children?: ReactNode
  secondaryButton?: { text: string; onClick: () => void },
  singleButton?: boolean
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  type = "error",
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
  secondaryButton,
  singleButton = false
}: AlertDialogProps) {
  if (!isOpen) return null

  const iconMap = {
    error: <AlertCircle className="text-error w-6 h-6" />,
    success: <CheckCircle className="text-success w-6 h-6" />,
    info: <Info className="text-gray-11 w-6 h-6" />,
  }

  const confirmButtonStyle = {
    error: "bg-white hover:bg-gray-6 text-gray-8",
    success: "bg-white hover:bg-gray-6 text-gray-8",
    info: "bg-white hover:bg-gray-6 text-gray-8",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white dark:bg-dark-3 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          {iconMap[type]}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        {children && <div className="mb-4">{children}</div>}
        <div className="flex justify-end gap-2">
          {!singleButton && (
            <button
              onClick={secondaryButton ? secondaryButton.onClick : onClose}
              className="px-4 cursor-pointer py-2 rounded-md border border-gray-300 dark:border-gray-5"
            >
              {secondaryButton ? secondaryButton.text : cancelText}
            </button>
          )}

          <button
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
            className={`px-4 cursor-pointer py-2 rounded-md ${confirmButtonStyle[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
