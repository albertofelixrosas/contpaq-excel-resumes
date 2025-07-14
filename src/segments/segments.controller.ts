import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Segment } from './entities/segment.entity';

@ApiTags('Segmentos')
@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nueva segmento' })
  @ApiResponse({
    status: 201,
    description: 'Segmento creado exitosamente',
    type: Segment,
  })
  create(@Body() createSegmentDto: CreateSegmentDto) {
    return this.segmentsService.create(createSegmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los segmentos registradas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de segmentos',
    type: [Segment],
  })
  findAll() {
    return this.segmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un segmento por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Segmento encontrado',
    type: Segment,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun segmento con ese ID',
  })
  findOne(@Param('id') id: string) {
    return this.segmentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un segmento' })
  @ApiResponse({
    status: 200,
    description: 'Segmento actualizado exitosamente',
    type: Segment,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun segmento con ese ID',
  })
  update(@Param('id') id: string, @Body() updateSegmentDto: UpdateSegmentDto) {
    return this.segmentsService.update(+id, updateSegmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un segmento por su ID' })
  @ApiResponse({ status: 200, description: 'Segmento eliminado exitosamente' })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun segmento con ese ID',
  })
  remove(@Param('id') id: string) {
    return this.segmentsService.remove(+id);
  }
}
