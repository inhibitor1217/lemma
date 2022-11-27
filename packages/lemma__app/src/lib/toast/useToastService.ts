import { ToastPreset, useToast as useBezierReactToast } from '@channel.io/bezier-react';
import { createElement, Fragment, useCallback, useMemo } from 'react';
import { Toast, ToastService } from './toast';

const BEZIER_TOAST_PRESET_MAPPINGS: Record<Toast.Type, ToastPreset> = {
  info: ToastPreset.Default,
  success: ToastPreset.Success,
  error: ToastPreset.Error,
};

export function useToastService(): ToastService {
  const toast = useBezierReactToast();

  const show = useCallback(
    (type: Toast.Type, content: Toast.Content): Toast.ID => {
      return toast.addToast(content ?? createElement(Fragment), { preset: BEZIER_TOAST_PRESET_MAPPINGS[type] });
    },
    [toast]
  );

  const info = useCallback((content: Toast.Content): Toast.ID => show('info', content), [show]);
  const success = useCallback((content: Toast.Content): Toast.ID => show('success', content), [show]);
  const error = useCallback((content: Toast.Content): Toast.ID => show('error', content), [show]);

  const dismiss = useCallback((id: Toast.ID): void => toast.removeToast(id), [toast]);

  return useMemo(
    () => ({
      show,
      info,
      success,
      error,
      dismiss,
    }),
    [show, info, success, error, dismiss]
  );
}
