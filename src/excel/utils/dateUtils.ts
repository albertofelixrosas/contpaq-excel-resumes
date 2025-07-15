export const convertToISODate = (date: string) => {
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  const parts = date.split('/');
  const [day, monthString, year] = parts;

  // Example: 2025-07-31
  const month = `${months.indexOf(monthString) + 1}`;
  const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return result;
};

export const excelCommonDateRegex =
  /^([0-2]?\d|3[01])\/(Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic)\/\d{4}\s?$/;
