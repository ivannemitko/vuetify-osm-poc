import { defineStore } from 'pinia';

export type SnackbarColor = 'success' | 'info' | 'warning' | 'error'

export const useSnackbarStore = defineStore('snackbar', () => {
  // State
  const isOpen = ref(false);
  const message = ref('');
  const color = ref<SnackbarColor>('success');
  const timeout = ref(3000);

  function show(options: {
    message: string
    color?: SnackbarColor
    timeout?: number
  }) {
    message.value = options.message;
    color.value = options.color || 'success';
    timeout.value = options.timeout || 3000;
    isOpen.value = true;
  }

  return {
    isOpen,
    message,
    color,
    timeout,
    show,
  };
});
