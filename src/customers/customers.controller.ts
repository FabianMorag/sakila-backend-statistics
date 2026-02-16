import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { findParamsDto } from './dto/findParams';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() params: findParamsDto) {
    return this.customersService.findAll(params);
  }

  @Get('top-customers')
  topCustomers() {
    return this.customersService.topCustomers();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customersService.findOne(id);
  }
}
