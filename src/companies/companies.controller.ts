import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Company } from './entities/company.entity';

@ApiTags('Compañías')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva compañía o empresa' })
  @ApiResponse({
    status: 201,
    description: 'Compañía creada exitosamente',
    type: Company,
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las compañías registradas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de compañías',
    type: [Company],
  })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar una compañía por su razón social' })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Razón social exacta de la compañía',
  })
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada',
    type: Company,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ninguna compañía con esa razón social',
  })
  async findByCompanyName(@Query('name') name: string): Promise<Company> {
    const company = await this.companiesService.findOneByCompanyName(name);

    if (!company) {
      throw new NotFoundException(
        `No se encontró una compañía con el nombre "${name}"`,
      );
    }

    return company;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una compañía por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada',
    type: Company,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ninguna compañía con ese ID',
  })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de una compañía' })
  @ApiResponse({
    status: 200,
    description: 'Compañía actualizada exitosamente',
    type: Company,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ninguna compañía con ese ID',
  })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una compañía por su ID' })
  @ApiResponse({ status: 200, description: 'Compañía eliminada exitosamente' })
  @ApiNotFoundResponse({
    description: 'No se encontró ninguna compañía con ese ID',
  })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
