import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { findParamsDto } from './dto/findParams';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll(params: findParamsDto) {
    const { limit, page, search, sortBy, sortOrder } = params;

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
    const orderBy = {
      [sortBy]: sortOrder,
    };

    return this.prisma.customer.findMany({
      take,
      skip,
      where,
      orderBy,
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

  topCustomers() {
    return this.prisma.$queryRaw<
      Array<{ last_name: string; first_name: string; total_rentals: number }>
    >`
      SELECT 
        c.first_name,
        c.last_name,
        SUM(amount) as total_spent 
      FROM customer as c 
      INNER JOIN payment p 
      ON c.customer_id = p.customer_id
      GROUP BY c.customer_id
      ORDER BY total_spent DESC
      LIMIT 5
      `;
  }
}
