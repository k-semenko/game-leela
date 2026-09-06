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

interface ConfirmationInterface {
  type: 'redirect';
  return_url: string;
}

interface ResponseConfirmationInterface extends ConfirmationInterface {
  confirmation_url: string;
}

interface AmountInterface {
  value: number;
  currency: string;
}

export interface ResponsePaymentInterface {
  id: string;

  status: PaymentStatus;

  description: string;

  confirmation: ResponseConfirmationInterface;

  test: boolean;

  paid: boolean;

  income_amount: AmountInterface;

  cancellation_details: {
    party: string;
    reason: string;
  };

  created_at: string;

  metadata: {
    gamesCount: number;
  };
}
