import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilmsService } from './films.service';
import { findParamsDto } from './dto/findParams';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(@Query() params: findParamsDto) {
    return this.filmsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.filmsService.findOne(id);
  }
}
