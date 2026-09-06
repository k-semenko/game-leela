import { AbstractControl, Validators } from '@angular/forms';

export const generateString = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const setClipboard = async (text: string) => {
  const type = 'text/plain';
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  return await navigator.clipboard.write(data);
};

export const passwordValidator = (
  field: AbstractControl,
): Validators | null => {
  if (field.value === field.parent?.value.password) {
    return null;
  } else {
    return {
      other: 'Пароли не совпадают',
    };
  }
};
