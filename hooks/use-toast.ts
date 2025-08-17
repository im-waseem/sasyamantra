'use client';

import * as React from 'react';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // reduced to a more practical delay

// Toast type
export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Action types
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  | { type: ActionType['UPDATE_TOAST']; toast: Partial<ToasterToast> & { id: string } }
  | { type: ActionType['DISMISS_TOAST']; toastId?: string }
  | { type: ActionType['REMOVE_TOAST']; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

// Memory state & listeners
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Reducer without side effects
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          action.toastId === undefined || t.id === action.toastId
            ? { ...t, open: false }
            : t
        ),
      };

    case 'REMOVE_TOAST':
      if (!action.toastId) return { ...state, toasts: [] };
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };

    default:
      return state;
  }
};

// Central dispatch
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// Generate unique ID
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Add to remove queue
function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

// Main toast function
function toast(props: Omit<ToasterToast, 'id'>) {
  const id = genId();

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  const update = (updateProps: Partial<ToasterToast>) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...updateProps, id } });

  dispatch({
    type: 'ADD_TOAST',
    toast: { ...props, id, open: true, onOpenChange: (open) => !open && dismiss() },
  });

  addToRemoveQueue(id);

  return { id, dismiss, update };
}

// Hook for components
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
