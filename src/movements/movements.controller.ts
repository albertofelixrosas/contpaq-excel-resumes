import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Movement } from './entities/movement.entity';
import { MovementFilterDto } from './dto/movement-filter.dto';
import { MasiveChangeConceptDto } from './dto/masive-change-concept.dto';

@ApiTags('Movimientos')
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimiento' })
  @ApiResponse({
    status: 201,
    description: 'Movimiento creado exitosamente',
    type: Movement,
  })
  create(@Body() dto: CreateMovementDto) {
    return this.movementsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Movimientos obtenidos correctamente' })
  async getMovements(@Query() filter: MovementFilterDto) {
    return this.movementsService.getMovements(filter);
  }

  @Get('suppliers')
  @ApiQuery({ name: 'company_id', required: true, type: Number })
  async getSuppliers(@Query('company_id') companyId: number) {
    if (!companyId || isNaN(companyId)) {
      throw new BadRequestException(
        'company_id es obligatorio y debe ser un número',
      );
    }
    return this.movementsService.getDistinctSuppliers(companyId);
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Heatmap de movimientos por fecha' })
  @ApiQuery({ name: 'company_id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Datos para heatmap' })
  async getHeatmap(@Query('company_id', ParseIntPipe) companyId: number) {
    return this.movementsService.countMovementsByDate(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Movimiento encontrado',
    type: Movement,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun movimiento con ese ID',
  })
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }

  @Patch('massive-change-concept')
  @ApiOperation({
    summary: 'Actualizar masivamente el concepto de movimientos filtrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimientos actualizados exitosamente',
  })
  async massiveChangeConcept(@Body() dto: MasiveChangeConceptDto) {
    return this.movementsService.massiveChangeConcept(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un movimiento' })
  @ApiResponse({
    status: 200,
    description: 'Movimiento actualizado exitosamente',
    type: Movement,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun movimiento con ese ID',
  })
  update(@Param('id') id: string, @Body() dto: UpdateMovementDto) {
    return this.movementsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un movimiento por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Movimiento eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun movimiento con ese ID',
  })
  remove(@Param('id') id: string) {
    return this.movementsService.remove(+id);
  }
}
