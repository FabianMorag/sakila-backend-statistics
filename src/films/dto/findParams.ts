import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class findParamsDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsOptional()
  @IsIn([
    'film_id',
    'title',
    'release_year',
    'rental_duration',
    'rental_rate',
    'length',
    'replacement_cost',
    'last_update',
  ])
  sortBy: string = 'film_id';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
