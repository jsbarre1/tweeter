import { useContext } from "react";
import { ToastActionsContext } from "./ToastContexts";
import { ToastType } from "./Toast";

interface messageActions {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => string;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => string;
  deleteMessage: (_toast: string) => void;
  deleteAllMessages: () => void;
}

export const useMessageActions = (): messageActions => {
  const { displayToast, deleteToast, deleteAllToasts } = useContext(ToastActionsContext);
  return {
    displayInfoMessage: (
      message: string,
      duration: number,
      bootstrapClasses?: string
    ) =>
      displayToast(
        ToastType.Info,
        message,
        duration,
        undefined,
        bootstrapClasses
      ),
    displayErrorMessage: (
      message: string,
      bootstrapClasses?: string
    ) =>
      displayToast(
        ToastType.Error,
        message,
        0,
        undefined,
        bootstrapClasses
      ),
    deleteMessage: deleteToast,
    deleteAllMessages: deleteAllToasts,
  };
};
