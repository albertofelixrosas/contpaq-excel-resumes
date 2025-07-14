import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Movement } from './entities/movement.entity';

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
  @ApiOperation({ summary: 'Obtener todos los movimientos registrados' })
  @ApiResponse({
    status: 200,
    description: 'Listado de movimiento',
    type: [Movement],
  })
  findAll() {
    return this.movementsService.findAll();
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
