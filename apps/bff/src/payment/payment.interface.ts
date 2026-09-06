import { ApiProperty } from '@nestjs/swagger';

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

class CancellationDetailsDto {
  @ApiProperty({ type: String })
  party: string;
  @ApiProperty({ type: String })
  reason: string;
}

class MetadataDto {
  @ApiProperty({ type: Number })
  gamesCount: number;
}

class ConfirmationDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'redirect',
  })
  type: 'redirect';

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://example.com/success-payment',
  })
  return_url: string;
}

class ResponseConfirmationDto extends ConfirmationDto {
  @ApiProperty({ type: String })
  confirmation_url: string;
}

class AmountDto {
  @ApiProperty({
    type: Number,
    required: true,
    example: 1200.0,
  })
  value: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'RUB',
  })
  currency: string;
}

class CustomerDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'info@example.com',
  })
  email: string;
}

export class ProductItemsDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Пакет из 15 игр example.com',
  })
  description: string;

  @ApiProperty({
    type: AmountDto,
    required: true,
  })
  amount: AmountDto;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  vat_code: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  quantity: number;
}

class ReceiptDto {
  @ApiProperty({
    type: CustomerDto,
    required: true,
    example: CustomerDto,
  })
  customer: CustomerDto;

  @ApiProperty({
    type: [ProductItemsDto],
    required: true,
  })
  items: [ProductItemsDto];
}

export class PaymentDto {
  @ApiProperty({
    type: AmountDto,
    required: true,
  })
  amount: AmountDto;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
  })
  capture: boolean;

  @ApiProperty({
    type: ReceiptDto,
    required: true,
  })
  receipt: ReceiptDto;

  @ApiProperty({
    type: ConfirmationDto,
    required: true,
  })
  confirmation: ConfirmationDto;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Покупка 15 игр example.com',
  })
  description: string;

  @ApiProperty({
    type: MetadataDto,
    required: true,
    example: { gamesCount: 1 },
  })
  metadata: MetadataDto;
}

export class CreatePaymentDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'info@example.com',
  })
  email: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  tariffId: number;
}

export class ResponsePaymentDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({
    type: ConfirmationDto,
  })
  confirmation: ResponseConfirmationDto;

  @ApiProperty({ type: Boolean })
  test: boolean;

  @ApiProperty({ type: Boolean })
  paid: boolean;

  @ApiProperty({ type: AmountDto })
  income_amount: AmountDto;

  @ApiProperty({ type: CancellationDetailsDto })
  cancellation_details: CancellationDetailsDto;

  @ApiProperty({ type: String })
  created_at: string;

  @ApiProperty({
    type: MetadataDto,
    required: true,
    example: { gameCount: 1 },
  })
  metadata: MetadataDto;
}
