import * as React from "react"
import { ToastProvider, ToastViewport } from "./toast"
import { useToast } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastTitle, ToastDescription, ToastAction } from "./toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <ToastViewport />
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </ToastProvider>
  )
}
