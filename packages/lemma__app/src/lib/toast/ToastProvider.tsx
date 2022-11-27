import { ToastProvider as BezierToastProvider } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';

const DEFAULT_DISMISS_DURATION_MS = 5000;

export default function ToastProvider({ children }: PropsWithChildren<{}>) {
  return <BezierToastProvider autoDismissTimeout={DEFAULT_DISMISS_DURATION_MS}>{children}</BezierToastProvider>;
}
