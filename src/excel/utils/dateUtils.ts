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
  const result = `${year}-${months.indexOf(monthString)}-${day.padStart(2, '0')}`;
  return result;
};
