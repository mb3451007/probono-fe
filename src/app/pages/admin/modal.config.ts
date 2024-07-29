export interface ModalConfig {
  modalTitle: string;
  table: any;
  id: any;
  type: any;
  record: any;
  dismissButtonLabel?: string;
  closeButtonLabel?: string;
  loadEntries: boolean;
  shouldClose?(): Promise<boolean> | boolean;
  shouldDismiss?(): Promise<boolean> | boolean;
  onClose?(): Promise<boolean> | boolean;
  onDismiss?(): Promise<boolean> | boolean;
  disableCloseButton?(): boolean;
  disableDismissButton?(): boolean;
  hideCloseButton?(): boolean;
  hideDismissButton?(): boolean;
  animation?: boolean;
  centered?: boolean;
  container?: string;
}
