import { Controller, Logger, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  total: number;
  items?: Array<{ productId: string; quantity: number }>;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger('NotificationService');
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    // Asegurar compatibilidad por si Kafka encapsula el contenido en data.value
    const orderData: OrderCreatedEvent = data?.value ? data.value : data;

    this.logger.log(`📥 Evento recibido [order.created]: Orden #${orderData?.orderId || 'Desconocida'}`);

    this.sendOrderConfirmationEmail(orderData);
  }

  private sendOrderConfirmationEmail(order: OrderCreatedEvent) {
    const itemCount = order?.items?.length ?? 0;
    const userId = order?.userId ?? 'N/A';
    const orderId = order?.orderId ?? 'N/A';
    const total = order?.total ?? 0;

    this.logger.log(`✉️  Enviando email de confirmación a Usuario ${userId}...`);
    this.logger.log(
      `📑 Resumen: Orden ${orderId} por un total de $${total} (${itemCount} items)`,
    );
    this.logger.log(`✅ Email enviado exitosamente para la orden #${orderId}`);
  }
}