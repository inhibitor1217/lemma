import { ReactNode } from 'react';

export namespace Toast {
  export type ID = string;
  export type Type = 'info' | 'success' | 'error';
  export type Content = ReactNode;
}

export interface ToastService {
  show(type: Toast.Type, content: Toast.Content): Toast.ID;
  info(content: Toast.Content): Toast.ID;
  success(content: Toast.Content): Toast.ID;
  error(content: Toast.Content): Toast.ID;

  dismiss(id: Toast.ID): void;
}
