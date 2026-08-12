import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-service',
        brokers: brokers,
      },
      consumer: {
        groupId: 'notification-group', // Grupo único para mantener el tracking de offsets
      },
    },
  });
  const port = process.env.PORT || 3005;
  await app.listen();
  console.log('📬 Notification Service escuchando eventos de Kafka...');
}
bootstrap();