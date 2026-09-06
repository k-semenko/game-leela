import { ResponsePaymentDto } from './payment.interface';

export enum PaymentEvents {
  SUCCEEDED = 'payment.succeeded',
  WAITING_FOR_CAPTURE = 'payment.waiting_for_capture',
  CANCELED = 'payment.canceled',
  REFUND_SUCCEEDED = 'refund.succeeded',
}

export class PaymentEventDto {
  type: string;
  event: PaymentEvents;
  object: ResponsePaymentDto;
}
