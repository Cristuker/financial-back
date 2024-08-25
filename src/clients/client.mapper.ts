import { ClientDTO } from './dto/client.dto';
import { ClientDBDTO } from './dto/clientdb.dto';

export const clientMapper = (client: ClientDBDTO): ClientDTO => ({
  contract: client.contract,
  cpfCnpj: client.cpfCnpj,
  id: client.id,
  name: client.name,
  phoneNumber: client.phoneNumber,
});
