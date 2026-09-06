/** Interface representing the state of a dice move */
export interface DiceModalInterface {
  /** Indicates if the move is in preview mode */
  preview: boolean;

  /** Indicates if the exit dialog is shown */
  exitDialog: boolean;

  /** Indicates if the loader should be shown */
  showLoader: boolean;

  /** Indicates if the next step is automatic */
  nextStepAuto: boolean;

  /** The cell number for the next step */
  nextStepCell: number;

  /** Indicates if the end of the field is reached */
  fieldEnd: boolean;

  /** Indicates that user get six on start */
  sixOnStart: boolean;
}
