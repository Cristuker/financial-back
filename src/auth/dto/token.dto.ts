import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty({ description: 'Token to access routes with auth required' })
  access_token: string;
}
