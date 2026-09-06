import { UserInterface } from '../user/user.interface';

export const tgMessageMarkdown = (message: string): string => {
  return message
    .replaceAll('.', '\\.')
    .replaceAll('!', '\\!')
    .replaceAll('-', '\\-')
    .replaceAll('=', '\\=')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
    .replaceAll(',', '\\,');
};

export const tgMessage = {
  newTgRel: (userData: UserInterface) =>
    '*Новая связка пользователя с ТГ*\n' +
    `\nЛогин: *${userData.username}*` +
    `\nФИО: ${userData?.firstName ?? ''} ${userData?.lastName ?? ''}` +
    `\nEmail: *${userData?.email ?? ''}*` +
    `\nIDs: *${userData.tg.telegramId} : ${userData.id}*`,

  helloMessage: (host: string) =>
    '*Доброго времени суток!*' +
    `\n\nЯ бот-помощник сайта ${host} !` +
    '\n\nБуду напоминать Вам о предстоящих играх и присылать отчеты по пройденным!',

  errorMessageOnStart: (host: string) =>
    '*Доброго времени суток!*' +
    `\n\nЯ бот с сайта ${host} !` +
    '\n\nЯ пока только учусь и кажется не смог вас запомнить =(' +
    '\nЕсли Вам не будут приходить уведомления, обратитесь в поддержку',

  startIdentifiedMessage: tgMessageMarkdown(
    '*Доброго времени суток!*\n\nК сожалению, на текущий момент я мало что умею, но усиленно учусь и ' +
      'скоро стану твоим незаменимым помощником! 🥰' +
      '\n\nВсе команды можно посмотреть здесь: /help',
  ),

  startNotIdentifiedMessage: (host: string) =>
    '<b>Доброго времени суток!</b>' +
    '\n\nЯ никак не могу вспомнить знакомы ли мы... 🤔' +
    '\nНе нашел Вас в своей базе, но очень хочу познакомиться 🙃' +
    `\n\nМы можем подружиться через <a href="${host}profile/settings">личный кабинет на сайте</a>.` +
    `\nЕсли у вас нет личного кабинета, можно <a href="${host}auth/signup">зарегистрироваться</a>.`,

  helpMessage:
    '*Помощь*' +
    '\nПока я умею делать очень мало, но я учусь.' +
    '\n\nВот, что я могу сейчас:\n\n',

  noGames:
    '*Не нашел игры...*\n\nВы пока не участвовали в играх и не создали ни одной игры.\n\nСамое время начать! 😊',

  newPaymentMessage: (payment: any) =>
    `<b>Новая оплата!</b>\n\n${payment.description}` +
    `\n\n<b>Поступления:</b> ${payment?.income_amount?.value ?? 0} руб.`,

  newPaymentMessageForUser: (payment: any) =>
    `<b>Новая оплата!</b>\n\n${payment.description}` +
    `\n\nИгры уже засчитаны в профиле`,

  canceledPaymentMessage: (payment: any) =>
    `<b>Оплата не прошла!</b>\n\n${payment.description}` +
    `<\n\n${payment.cancellation_details.party} : ${payment.cancellation_details.reason}`,
};
