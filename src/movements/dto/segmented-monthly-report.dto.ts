export interface MonthlyReportRow {
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

export interface SegmentedMonthlyReportDto {
  segment_id: number;
  segment_code: string;
  months: { key: string; label: string }[];
  data: MonthlyReportRow[];
}
