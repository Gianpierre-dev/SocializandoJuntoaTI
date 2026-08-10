import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  verificarSalud(): { estado: string; marca: string } {
    return { estado: 'ok', marca: new Date().toISOString() };
  }
}
