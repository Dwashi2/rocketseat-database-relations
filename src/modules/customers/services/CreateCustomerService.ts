import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';
import { runInThisContext } from 'vm';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customerExists = await this.customersRepository.findByEmail(email)

    if (customerExists){
      throw new AppError('this e-mail is already assigned to a customer')
    }

    const customer = await this.customersRepository.create({
      name, email
    })

    return customer
  }
}

export default CreateCustomerService;
