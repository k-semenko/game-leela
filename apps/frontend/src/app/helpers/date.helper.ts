import * as moment from 'moment';

export const formattedDate = (format?: string | null, date?: string) => {
  format = format ?? 'DD.MM.YYYY HH:mm';

  if (date) {
    return moment(date).format(format);
  } else {
    return moment().format(format);
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
