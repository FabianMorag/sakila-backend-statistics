import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  topCategories() {
    return this.prisma.$queryRaw<
      Array<{ category_id: number; name: string; total_revenue: number }>
    >`
      SELECT 
        c.name,
        SUM(p.amount) as total_revenue
      FROM category c
      INNER JOIN film_category fc ON c.category_id = fc.category_id
      INNER JOIN film f ON fc.film_id = f.film_id
      INNER JOIN inventory i ON f.film_id = i.film_id
      INNER JOIN rental r ON i.inventory_id = r.inventory_id
      INNER JOIN payment p ON r.rental_id = p.rental_id
      GROUP BY c.category_id, c.name
      ORDER BY total_revenue DESC
      LIMIT 5
    `;
  }

  reveneueOverTime() {
    return this.prisma.$queryRaw<
      Array<{ month: string; total_revenue: number }>
    >`
       SELECT
         DATE_TRUNC('month', p.payment_date) AS month,
         SUM(p.amount) AS total_revenue
       FROM payment p
       GROUP BY month
       ORDER BY month
     `;
  }
}
