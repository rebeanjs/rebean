
export type Modal = Readonly<{
  name: string;
  params: object;
}>;

export type ModalState = {
  modal: Modal | null;
};

export type ModalAwareState = Partial<ModalState> & { [key: string]: any };
