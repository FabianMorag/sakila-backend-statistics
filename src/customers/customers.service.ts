import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { findParamsDto } from './dto/findParams';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll(params: findParamsDto) {
    const { limit, page, search } = params;

    const take = limit;
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { first_name: { contains: search, mode: 'insensitive' as const } },
            { last_name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    return this.prisma.customer.findMany({
      take,
      skip,
      where,
    });
  }

  async findOne(id: number) {
    return this.prisma.customer
      .findUniqueOrThrow({
        where: { customer_id: id },
      })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Customer not found',
          },
          HttpStatus.NOT_FOUND,
        );
      });
  }
}
