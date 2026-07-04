import type { FinanceMessages } from './uz'

const ru: FinanceMessages = {
  finance: {
    nav: { income: 'Мои доходы', balance: 'Мой баланс', bankAccounts: 'Банковские счета', settings: 'Настройки выплат' },
    incomeOverview: {
      title: 'Обзор дохода', banner: 'Корректировки не включены. Загрузите отчёт для деталей.',
      pending: 'Ожидаемые', released: 'Выплачено', total: 'Итого',
      thisWeek: 'Эта неделя', thisMonth: 'Этот месяц',
      myBankAccount: 'Мой банковский счёт:', myBalance: 'Мой баланс',
    },
    incomeDetails: {
      title: 'Детали дохода', tabPending: 'Ожидаемые', tabReleased: 'Выплачено',
      thisWeek: 'Эта неделя', thisMonth: 'Этот месяц', export: 'Экспорт', searchOrder: 'Поиск заказа',
      col: { order: 'Заказ', releasedOn: 'Дата выплаты', status: 'Статус', paymentMethod: 'Метод оплаты', releasedAmount: 'Выплаченная сумма' },
      status: { pending: 'Ожидается', released: 'Выплачено', on_hold: 'Удержано', cancelled: 'Отменено' },
      method: { atmos: 'Atmos', payme: 'Payme', ozb_wallet: 'OZB Кошелёк' },
      empty: 'Нет данных',
    },
    sidebar: { statementsTitle: 'Отчёты о доходах', taxInvoicesTitle: 'Налоговые счета', more: 'Ещё', noStatements: 'Нет отчётов', noInvoices: 'Нет налоговых счетов', viewBalance: 'Мой баланс' },
    statements: {
      title: 'Отчёты о доходах', subtitle: 'Хранятся только отчёты за последние 24 месяца. Скачайте PDF для своих записей.',
      downloadAll: 'Скачать всё',
      col: { statement: 'Отчёт', totalPayout: 'Итого выплат', date: 'Дата', action: 'Действие' },
      download: 'Скачать', downloaded: 'Скачано',
      latestTitle: 'Последние отчёты', latestBanner: 'Вот отчёты, которые вы не скачали.',
      latestColName: 'Имя файла', latestColAction: 'Действие',
      latestFooter: 'Все отчёты:', myReports: 'Мои отчёты', empty: 'Нет отчётов',
    },
    walletCard: {
      title: 'Обзор баланса', walletBalance: 'Баланс кошелька',
      autoWithdrawOn: 'Авто-вывод: ВКЛ', autoWithdrawOff: 'Авто-вывод: ВЫКЛ',
      withdraw: 'Вывести', myBankAccount: 'Мой банковский счёт', more: 'Ещё', default: 'Основной', noAccount: 'Счёт не привязан',
      accountStatus: { verified: 'Подтверждён', checked: 'Проверен', pending: 'Ожидается', error: 'Ошибка' },
    },
    txFilters: {
      moneyFlow: 'Поток средств', shopType: 'Тип магазина', txType: 'Тип транзакции', local: 'Местный',
      flow: { all: 'Все', money_in: 'Приход', money_out: 'Расход' },
      type: { order_income: 'Доход с заказа', adjustment: 'Корректировка', refund: 'Возврат', withdrawal: 'Вывод', platform_fee: 'Комиссия платформы' },
      reset: 'Сбросить', apply: 'Применить',
    },
    txTable: {
      count: '{{count}} транзакций (Итого: {{amount}})', searchPlaceholder: 'Поиск по ID заказа', export: 'Экспорт',
      recentTitle: 'Последние транзакции',
      col: { dateTime: 'Дата/Время', description: 'Описание', txId: 'ID транзакции', amount: 'Сумма', status: 'Статус' },
      txStatus: { completed: 'Выполнено', pending: 'Ожидается', failed: 'Ошибка' },
      empty: 'История транзакций пуста',
    },
    txDetail: {
      breadcrumbHome: 'Главная', breadcrumbBalance: 'Мой баланс', breadcrumb: 'Детали транзакции',
      incomeTitle: 'Доход с заказа #{orderId}', walletBalance: 'Баланс кошелька:',
      createTime: 'Время создания', buyer: 'Покупатель', orderId: 'ID заказа',
      notFound: 'Транзакция не найдена',
      status: { completed: 'Выполнено', pending: 'Ожидается', failed: 'Ошибка' },
      typeLabel: { order_income: 'Доход с заказа', adjustment: 'Корректировка', refund: 'Возврат', withdrawal: 'Вывод', platform_fee: 'Комиссия' },
    },
    payAccount: {
      title: 'Добавить банковский счёт', addCard: 'Добавить счёт',
      emptyTitle: 'Счёт не привязан', emptyDesc: 'Привяжите банковский счёт для вывода средств',
      status: { verified: 'Подтверждён', checked: 'Проверен', pending: 'Ожидается', error: 'Ошибка' },
      default: 'Основной', setDefault: 'Сделать основным', remove: 'Удалить', removeConfirm: 'Удалить эту карту?',
    },
    income: {
      title: 'Мои доходы', subtitle: 'Все поступления магазина и анализ доходов', totalShown: 'Итого показанных поступлений',
      method: { all: 'Все', card: 'Карта', cash: 'Наличные', invoice: 'Счёт' },
      col: { source: 'Источник дохода', orderId: 'ID заказа', method: 'Тип оплаты', date: 'Дата', amount: 'Сумма' },
      empty: 'Доходы не найдены',
    },
    balance: {
      title: 'Мой баланс', subtitle: 'Отслеживайте накопленные с продаж средства и выводите на счёт',
      available: 'Доступно к выводу', availableNote: '● Вывод без комиссии активен',
      hold: 'В обработке (Hold)', holdNote: 'Ожидается подтверждение покупателя',
      withdrawnThisMonth: 'Выведено за этот месяц', lastWithdraw: 'Последний вывод: {{date}}', lastWithdrawNever: 'Выводов ещё не было',
      formTitle: 'Перевод средств на счёт', selectAccount: 'Выберите счёт', amount: 'Сумма вывода (сум)', amountPlaceholder: 'Например: 5 000 000',
      submit: 'Подтвердить перевод', submitting: 'Отправка…', success: '{{amount}} успешно отправлено на счёт {{bank}}!',
      errInvalid: 'Введите корректную сумму', errInsufficient: 'Недостаточно средств на балансе', noAccounts: 'Сначала добавьте банковский счёт',
    },
    accounts: {
      title: 'Банковские счета', subtitle: 'Ваши официальные банковские счета для вывода средств', add: '+ Добавить новый счёт',
      primary: 'Основной', makePrimary: 'Сделать основным', delete: 'Удалить', deleteConfirm: 'Удалить этот банковский счёт?',
      mfo: 'МФО: {{mfo}}', empty: 'Счета ещё не добавлены', modalTitle: 'Новый банковский счёт',
      bankName: 'Название банка', bankNamePlaceholder: 'Например: Асакабанк АО',
      accountName: 'Владелец счёта (ООО или Ф.И.О)', accountNamePlaceholder: 'Например: OZB GLOBAL SOLUTIONS',
      accountNumber: 'Номер счёта (20 цифр)', accountNumberPlaceholder: '20208000...',
      mfoCode: 'Код МФО (5 цифр)', mfoPlaceholder: '00440', cancel: 'Отмена', save: 'Привязать счёт', saving: 'Сохранение…',
    },
    settings: {
      title: 'Настройки выплат', subtitle: 'Правила автоматических переводов и финансовых уведомлений',
      autoWithdraw: 'Автоматический перевод средств', autoWithdrawNote: 'Автоотправка на счёт при достижении заданной суммы',
      period: 'Периодичность перевода', periodDaily: 'Каждую ночь (23:59)', periodWeekly: 'Каждую неделю (по понедельникам)', periodMonthly: 'В последний день месяца',
      notify: 'Уведомления о транзакциях', notifyNote: 'SMS при каждом изменении баланса',
      save: 'Сохранить правила', saving: 'Сохранение…', success: 'Настройки успешно сохранены!',
    },
  },
}

export default ru
