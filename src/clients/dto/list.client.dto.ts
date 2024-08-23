import { ApiProperty } from '@nestjs/swagger';
import { ClientDTO } from './client.dto';

export class ListClientDTO {
  @ApiProperty({ description: 'Client list', type: [ClientDTO] })
  clients: Array<ClientDTO>;
}
