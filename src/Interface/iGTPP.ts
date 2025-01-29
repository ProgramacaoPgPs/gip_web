export interface iPropsInputCheckButton {
    containerClass?: string;
    onAction: (e: boolean) => void;
    inputClass?: string;
    labelClass?: string;
    inputId: string;
    labelText?: string;
    labelIcon?: string;
    labelIconConditional?: [string, string];
    highlight?:boolean;
  }
