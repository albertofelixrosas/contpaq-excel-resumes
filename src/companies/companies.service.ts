import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  create(dto: CreateCompanyDto) {
    const company = this.repo.create(dto);
    return this.repo.save(company);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const company = await this.repo.findOneBy({ company_id: id });
    if (!company) {
      throw new NotFoundException(
        `No se encontro una empresa con el id "${id}"`,
      );
    }
    return company;
  }

  async findOneByCompanyName(companyName: string) {
    const company = await this.repo.findOneBy({ company_name: companyName });
    if (!company) {
      throw new NotFoundException(
        `No se encontro una empresa con la razón social "${companyName}"`,
      );
    }
    return company;
  }

  async findOrCreateByCompanyName(companyName: string): Promise<Company> {
    let company = await this.repo.findOneBy({ company_name: companyName });

    if (!company) {
      const dto: CreateCompanyDto = {
        company_name: companyName,
        rfc: '',
      };

      company = await this.create(dto);
      return this.repo.save(company);
    }

    return company;
  }

  async update(id: number, dto: UpdateCompanyDto) {
    const company = await this.repo.findOneBy({
      company_id: id,
    });

    if (!company) {
      throw new NotFoundException(
        `No se encontro una empresa con el id "${id}"`,
      );
    }
    const updatedCompany = this.repo.merge(company, dto);
    return this.repo.save(updatedCompany);
  }

  async remove(id: number) {
    const company = await this.repo.findOneBy({ company_id: id });
    if (!company) {
      throw new NotFoundException(
        `No se encontro una empresa con el id "${id}"`,
      );
    }
    return this.repo.delete(id);
  }
}
