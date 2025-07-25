export interface MonthDto {
  key: string;
  label: string;
}

export interface MonthlyConceptRowDto {
  concept: string;
  total_general: number;
  ene: number;
  feb: number;
  mar: number;
  abr: number;
  may: number;
  jun: number;
  jul: number;
  ago: number;
  sep: number;
  oct: number;
  nov: number;
  dic: number;
}

export class MonthlyReportDto {
  months: MonthDto[];
  data: MonthlyConceptRowDto[];
}
