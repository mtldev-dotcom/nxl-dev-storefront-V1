"use client"

import * as ReactAria from "react-aria-components"
import { twJoin, twMerge } from "tailwind-merge"

export const UiModalOverlay: React.FC<ReactAria.ModalOverlayProps> = ({
  isDismissable = true,
  className,
  ...props
}) => (
  <ReactAria.ModalOverlay
    {...props}
    isDismissable={isDismissable}
    className={twMerge(
      "fixed inset-0 flex min-h-full items-center justify-center bg-black-10% z-50 data-[entering]:animate-in data-[entering]:fade-in data-[entering]:duration-200 data-[entering]:ease-out data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:duration-100 data-[exiting]:ease-in p-4",
      className as string
    )}
  />
)

export type UiModalOwnProps = {
  animateFrom?: "center" | "right" | "bottom" | "left"
}

export const getModalClassNames = ({
  animateFrom = "center",
}: UiModalOwnProps): string => {
  const animateFromClasses = {
    center: "data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95",
    right:
      "data-[entering]:slide-in-from-right-10 data-[exiting]:slide-out-to-right-10 right-0 left-auto absolute",
    bottom:
      "data-[entering]:slide-in-from-bottom-10 data-[exiting]:slide-out-to-bottom-10 bottom-0 absolute",
    left: "data-[entering]:slide-in-from-left-10 data-[exiting]:slide-out-to-left-10 left-0 right-auto absolute",
  }

  return twJoin(
    "bg-white max-sm:px-4 p-6 rounded-xs max-h-full overflow-y-scroll max-w-154 w-full shadow-modal data-[entering]:animate-in data-[entering]:ease-out data-[entering]:duration-200 data-[exiting]:animate-out data-[exiting]:ease-in data-[exiting]:duration-100",
    animateFromClasses[animateFrom]
  )
}

// For accessibility: If a Dialog does not contain a <Heading slot="title">, it must have an aria-label or aria-labelledby attribute.
// This ensures screen readers can announce the dialog's purpose. We provide a default aria-label if none is given.
// We use 'any' for props here to allow spreading aria-label and other a11y props.
export const UiModal: React.FC<any> = ({ animateFrom = "center", className, ...props }) => {
  // If aria-label is not provided, set a default for accessibility
  const modalProps = {
    ...props,
    ...(props["aria-label"] ? {} : { "aria-label": "Dialog" })
  }
  return (
    <ReactAria.Modal
      {...modalProps}
      className={twMerge(
        getModalClassNames({ animateFrom }),
        className as string
      )}
    />
  )
}
