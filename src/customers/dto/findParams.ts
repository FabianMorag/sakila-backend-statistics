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
  @IsIn(['first_name', 'last_name'])
  sortBy: string = 'first_name';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
