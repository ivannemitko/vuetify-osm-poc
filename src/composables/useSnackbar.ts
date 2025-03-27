import { useSnackbarStore } from '@/stores/snackbar';

export function useSnackbar() {
  const snackbar = useSnackbarStore();

  function showSuccess(message: string, timeout?: number) {
    snackbar.show({ message, color: 'success', timeout });
  }

  function showError(message: string, timeout?: number) {
    snackbar.show({ message, color: 'error', timeout });
  }

  function showWarning(message: string, timeout?: number) {
    snackbar.show({ message, color: 'warning', timeout });
  }

  function showInfo(message: string, timeout?: number) {
    snackbar.show({ message, color: 'info', timeout });
  }

  return {
    show: snackbar.show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
