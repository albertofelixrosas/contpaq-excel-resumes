import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Concept } from './entities/concept.entity';
import { GetConceptQueryDto } from './dto/get-concept-query.dto';

@ApiTags('Conceptos')
@Controller('concepts')
export class ConceptsController {
  constructor(private readonly service: ConceptsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo concepto' })
  @ApiBody({ type: CreateConceptDto })
  @ApiResponse({
    status: 201,
    description: 'Concepto creado exitosamente',
    type: Concept,
  })
  create(@Body() dto: CreateConceptDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los conceptos' })
  @ApiResponse({
    status: 200,
    description: 'Listado de conceptos',
    type: [Concept],
  })
  @ApiQuery({
    name: 'company_id',
    required: false,
    type: Number,
    description: 'ID de la empresa para filtrar los conceptos',
  })
  findAll(@Query() query: GetConceptQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un concepto por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del concepto' })
  @ApiResponse({
    status: 200,
    description: 'Concepto encontrado',
    type: Concept,
  })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un concepto existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del concepto' })
  @ApiBody({ type: UpdateConceptDto })
  @ApiResponse({
    status: 200,
    description: 'Concepto actualizado',
    type: Concept,
  })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateConceptDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un concepto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del concepto' })
  @ApiResponse({ status: 200, description: 'Concepto eliminado' })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
