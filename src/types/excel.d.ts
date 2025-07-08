export interface Resume {
  records: Record[];
  // falta el periodo del resumen
}

export interface Record {
  title: string;
  rows: Row[];
}

export interface Row {
  date: string;
  type: 'Egresos' | 'Diario';
  number: number;
  concept: string;
  reference: string;
  debits: number;
  credits: number;
  balance: number;
}
