export enum PaymentStatus {
  /** Платеж успешно завершен, деньги будут перечислены на расчетный счет */
  SUCCEEDED = 'succeeded',
  /** Платеж создан и ожидает действий от пользователя */
  PENDING = 'pending',
  /** Платеж оплачен, деньги авторизованы и ожидают списания */
  WAITING_FOR_CAPTURE = 'waiting_for_capture',
  /** Платеж отменен */
  CANCELED = 'canceled',
  /** Ошибка при получении платежа */
  FAIL = 'fail',
}

export interface PaymentsInterface {
  id: number;
  orderId: string;
  status: PaymentStatus;
  createdAt: string;
}
