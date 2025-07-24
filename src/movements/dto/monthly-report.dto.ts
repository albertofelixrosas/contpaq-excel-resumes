export interface MonthlyColumnDto {
  key: string; // Ej: "month_1"
  label: string; // Ej: "ENE 2025"
}

export interface MonthlyConceptRowDto {
  concept: string;
  total_general: number;
  [key: `month_${number}`]: number;
}

export class MonthlyReportDto {
  months: MonthlyColumnDto[];
  data: MonthlyConceptRowDto[];
}
