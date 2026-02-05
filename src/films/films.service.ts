import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { findParamsDto } from './dto/findParams';
import { film } from '@prisma/client';
import { Metadata } from './types/metadata';

@Injectable()
export class FilmsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    params: findParamsDto,
  ): Promise<{ data: film[]; meta: Metadata }> {
    const { limit, page, search, genre, sortBy, sortOrder } = params;

    const take = limit;
    const skip = (page - 1) * limit;

    const searchCondition = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const genreCondition = genre
      ? {
          film_category: {
            some: {
              category: {
                name: {
                  equals: genre,
                  mode: 'insensitive' as const,
                },
              },
            },
          },
        }
      : undefined;

    const where =
      searchCondition || genreCondition
        ? {
            AND: [searchCondition, genreCondition].filter(Boolean),
          }
        : undefined;

    const include = {
      film_category: { select: { category: { select: { name: true } } } },
    };

    const orderBy = {
      [sortBy]: sortOrder,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.film.findMany({
        skip,
        take,
        where,
        orderBy,
        include,
      }),
      this.prisma.film.count({ where }),
    ]);

    const meta = {
      total,
      page: page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { data, meta };
  }

  findOne(id: number) {
    return this.prisma.film.findUnique({
      where: { film_id: id },
      include: {
        film_category: { select: { category: { select: { name: true } } } },
        film_actor: { select: { actor: true } },
      },
    });
  }
}
