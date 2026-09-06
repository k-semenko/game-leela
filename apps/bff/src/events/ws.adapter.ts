import { IoAdapter } from '@nestjs/platform-socket.io';
import * as process from 'process';

export class WsAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    port = Number(process.env.WS_PORT);
    options.cors = { origin: process.env.WS_ORIGIN };

    return super.createIOServer(port, options);
  }
}
