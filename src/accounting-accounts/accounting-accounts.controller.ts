import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AccountingAccountsService } from './accounting-accounts.service';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { UpdateAccountingAccountDto } from './dto/update-accounting-account.dto';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountingAccount } from './entities/accounting-account.entity';
import { GetAccountingAccountsQueryDto } from './dto/get-accounting-account-query.dto';

@ApiTags('Cuentas contables')
@Controller('accounting-accounts')
export class AccountingAccountsController {
  constructor(
    private readonly accountingAccountsService: AccountingAccountsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cuenta contable' })
  @ApiResponse({
    status: 201,
    description: 'Cuenta contable creada exitosamente',
    type: AccountingAccount,
  })
  create(@Body() createAccountingAccountDto: CreateAccountingAccountDto) {
    return this.accountingAccountsService.create(createAccountingAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos las cuentas contables' })
  @ApiResponse({
    status: 200,
    description: 'Listado de cuentas contables',
    type: [AccountingAccount],
  })
  @ApiQuery({
    name: 'company_id',
    required: false,
    type: Number,
    description: 'ID de la empresa para filtrar',
  })
  findAll(@Query() query: GetAccountingAccountsQueryDto) {
    return this.accountingAccountsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cuenta contable por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable encontrada',
    type: AccountingAccount,
  })
  findOne(@Param('id') id: string) {
    return this.accountingAccountsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de una cuenta contable' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable actualizada exitosamente',
    type: AccountingAccount,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningun segmento con ese ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateAccountingAccountDto: UpdateAccountingAccountDto,
  ) {
    return this.accountingAccountsService.update(
      +id,
      updateAccountingAccountDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cuenta contable por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable eliminada exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ninguna cuenta contable con ese ID',
  })
  remove(@Param('id') id: string) {
    return this.accountingAccountsService.remove(+id);
  }
}
