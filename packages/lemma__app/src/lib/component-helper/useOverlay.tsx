import { Overlay, OverlayProps } from '@channel.io/bezier-react';
import { ReactNode, useCallback, useState } from 'react';

export default function useOverlay(
  children: ReactNode,
  props?: Omit<OverlayProps, 'show' | 'onHide' | 'children'>,
  showOnMount = false
): [ReactNode, boolean, () => void, () => void] {
  const [show, setShow] = useState(showOnMount);

  const open = useCallback(() => setShow(true), []);
  const hide = useCallback(() => setShow(false), []);

  return [
    <Overlay {...props} show={show} onHide={hide}>
      {children}
    </Overlay>,
    show,
    open,
    hide,
  ];
}
