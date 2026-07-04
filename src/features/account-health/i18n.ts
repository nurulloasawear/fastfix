// All strings under the `accountHealth` namespace.
// uz = default (no `as const`). ru/en typed as `typeof uz` for strict parity.

const uz = {
  accountHealth: {
    title: 'Hisob salomatligi',
    breadcrumbHome: 'Bosh sahifa',
    learnMore: 'Batafsil',
    viewDetails: 'Batafsil',
    viewMore: 'Koʻproq >',
    loading: 'Yuklanmoqda...',

    // Health labels
    label: {
      EXCELLENT: 'Ajoyib',
      GOOD: 'Yaxshi',
      FAIR: "Qoniqarli",
      POOR: 'Yomon',
    },
    tagline: "Barcha koʻrsatkichlar maqsadga mos. Yangi xaridorlarni jalb qilish uchun ajoyib natijalarni saqlab qoling!",

    // KPI strip
    kpi: {
      performanceMetric: "Koʻrsatkich",
      adminSided: 'Admin tomonlama',
      myPenalty: 'Mening jarima',
      points: 'Ball',
      ongoingAppeal: 'Davom etayotgan shikoyat',
      cases: 'ta ish',
      view: 'Koʻrish >',
    },

    // My Penalty section
    penalty: {
      title: 'Mening jarimam',
      penaltyPoints: 'Jarima ballari',
      youCanGet: 'Siz olishingiz mumkin ({{max}} ta shunday)',
      warningThreshold: '3 ball toʻplasangiz, yangi jazo olasiz.',
      ongoingPunishment: 'Davom etayotgan jazo',
      noPunishment: 'Ajoyib! Davom etayotgan jazo yoʻq',
      activePunishment: 'Jazo faol',
    },

    // Metrics table
    metrics: {
      title: 'Koʻrsatkichlar tafsilotlari',
      colMetric: "Koʻrsatkich",
      colCurrentPeriod: 'Joriy davr',
      colTarget: 'Maqsad',
      colAppliedTo: 'Tatbiq etiladi',
      colAction: 'Harakat',

      group: {
        fulfilment: 'Bajarish samaradorligi',
        listing: 'Roʻyxat samaradorligi',
        customer_service: 'Mijozlarga xizmat samaradorligi',
      },

      name: {
        nfr: 'Bajarmaslik darajasi (barcha kanallar)',
        late_shipment: "Kech joʻnatish darajasi (barcha kanallar)",
        prep_time: 'Tayyorlov vaqti',
        fast_handover: 'Tez topshirish darajasi',
        on_time_pickup: "Oʻz vaqtida olib ketmaslik darajasi",
        severe_listing: "Jiddiy roʻyxat qoidabuzarliklar",
        preorder_listing: "Oldindan buyurtma roʻyxati %",
        other_listing: "Boshqa roʻyxat qoidabuzarliklar",
        response_rate: 'Javob berish darajasi',
        response_time: "Oʻrtacha javob vaqti",
        chat_satisfaction: 'Chat qoniqishi',
        shop_rating: "Doʻkon reytingi",
      },

      consequence: {
        penalty_points: 'Jarima ballari',
        verified_seller_reset: "Tasdiqlangan sotuvchi tiklash",
        listing_limit: "Roʻyxat cheklovi",
        highlighted: "Ajratib koʻrsatildi",
        none: '—',
      },
    },

    // Issues to Improve
    issues: {
      title: 'Yaxshilash kerak boʻlgan masalalar',
      subtitle: 'Siz yaxshilashingiz mumkin boʻlgan masalalar',
      listingsWithIssues: "Muammoli roʻyxatlar",
      lateOrders: 'Kechikkan buyurtmalar',
      none: 'Muammo yoʻq',
    },

    // Verified Seller widget
    verifiedSeller: {
      title: 'Tasdiqlangan sotuvchi',
      subtitle: "Yanada koʻproq xaridorlarni jalb qilish uchun Tasdiqlangan sotuvchi boʻling",
      viewDetails: 'Tafsilotlarni koʻrish >',
    },

    // NFR detail page
    nfr: {
      title: 'Bajarmaslik darajasi (barcha kanallar)',
      breadcrumb: 'Bajarmaslik darajasi',
      overview: 'Umumiy koʻrinish',
      orderDate: 'Buyurtma sanasi',
      myShop: 'Mening doʻkonim',
      target: 'Maqsad',
      nextWeekPrediction: "Keyingi hafta bashorati",
      weeklyPenaltyPoint: 'Haftalik jarima balli',
      weeklyVerifiedCriteria: "Haftalik Tasdiqlangan mezonlar",
      issueDate: "Berilgan sana",
      impactPeriod: "Taʻsir baholash davri",
      passing: 'Yaxshi',
      failing: 'Muvaffaqiyatsiz',
      diagnosis: 'Metrik tashxis',
      diagnosisPassing: "Hozir yaxshi, qoʻshimcha tavsiya yoʻq",
      salesOfIncomplete: 'Bajarilmagan buyurtmalar savdosi',
      byAmount: 'Miqdor boʻyicha',
      byCount: 'Soni boʻyicha',
      noData: "Maʻlumot yoʻq",
      threshold: 'Chegara',
      trendTitle: 'Bajarmaslik darajasi (barcha kanallar) trendi',
      affectedOrders: "Taʻsirlangan buyurtmalar",
      colOrderId: 'Buyurtma ID',
      colNfrType: 'Bajarmaslik turi',
      colReason: 'Sabab',
      colShippingChannel: "Joʻnatish kanali",
      colAction: 'Harakat',
      emptyOrders: "Taʻsirlangan buyurtmalar yoʻq",
      view: 'Koʻrish',
    },

    // Chat response detail page
    chat: {
      title: 'Chat javob koʻrsatkichlari',
      breadcrumb: 'Chat javob koʻrsatkichlari',
      day: 'Kun',
      myShop: 'Mening doʻkonim',
      target: 'Maqsad',
      previousDay: 'Oldingi kun',
      chatsResponded: 'Javob berilgan chatlar',
      totalChats: 'Jami chatlar',
      responseRate: 'Chat javob darajasi',
      threshold: 'Chegara',
      trendTitle: 'Chat javob darajasi',
      footerNote: "Chat samaradorligingiz savdoga qanday taʻsir qilishini koʻrish uchun Business Insights sahifasidagi",
      footerLink: 'Chat sahifasiga tashrif buyuring.',
    },
  },
}

type AccountHealthMessages = typeof uz

const ru: { accountHealth: AccountHealthMessages['accountHealth'] } = {
  accountHealth: {
    title: 'Здоровье аккаунта',
    breadcrumbHome: 'Главная',
    learnMore: 'Подробнее',
    viewDetails: 'Подробнее',
    viewMore: 'Ещё >',
    loading: 'Загрузка...',

    label: {
      EXCELLENT: 'Отлично',
      GOOD: 'Хорошо',
      FAIR: 'Удовлетворительно',
      POOR: 'Плохо',
    },
    tagline: 'Все показатели в норме. Поддерживайте отличные результаты, чтобы привлекать новых покупателей!',

    kpi: {
      performanceMetric: 'Показатель',
      adminSided: 'На стороне админа',
      myPenalty: 'Мой штраф',
      points: 'Баллов',
      ongoingAppeal: 'Текущие апелляции',
      cases: 'дел',
      view: 'Смотреть >',
    },

    penalty: {
      title: 'Мой штраф',
      penaltyPoints: 'Штрафные баллы',
      youCanGet: 'Вы можете получить ({{max}} макс.)',
      warningThreshold: 'При достижении 3 баллов вы получите новое наказание.',
      ongoingPunishment: 'Текущее наказание',
      noPunishment: 'Отлично! Нет активных наказаний',
      activePunishment: 'Наказание активно',
    },

    metrics: {
      title: 'Детали показателей',
      colMetric: 'Показатель',
      colCurrentPeriod: 'Текущий период',
      colTarget: 'Цель',
      colAppliedTo: 'Применяется к',
      colAction: 'Действие',

      group: {
        fulfilment: 'Эффективность выполнения',
        listing: 'Эффективность листингов',
        customer_service: 'Эффективность обслуживания',
      },

      name: {
        nfr: 'Коэффициент невыполнения (все каналы)',
        late_shipment: 'Коэффициент поздней отправки (все каналы)',
        prep_time: 'Время подготовки',
        fast_handover: 'Коэффициент быстрой передачи',
        on_time_pickup: 'Коэффициент несвоевременного получения',
        severe_listing: 'Серьёзные нарушения листинга',
        preorder_listing: 'Предзаказ % листинга',
        other_listing: 'Другие нарушения листинга',
        response_rate: 'Коэффициент ответов',
        response_time: 'Среднее время ответа',
        chat_satisfaction: 'Удовлетворённость чатом',
        shop_rating: 'Рейтинг магазина',
      },

      consequence: {
        penalty_points: 'Штрафные баллы',
        verified_seller_reset: 'Сброс проверенного продавца',
        listing_limit: 'Лимит листингов',
        highlighted: 'Выделено',
        none: '—',
      },
    },

    issues: {
      title: 'Проблемы для улучшения',
      subtitle: 'Проблемы, которые вы можете улучшить',
      listingsWithIssues: 'Листинги с проблемами',
      lateOrders: 'Просроченные заказы',
      none: 'Нет проблем',
    },

    verifiedSeller: {
      title: 'Проверенный продавец',
      subtitle: 'Станьте проверенным продавцом, чтобы привлечь больше покупателей',
      viewDetails: 'Посмотреть детали >',
    },

    nfr: {
      title: 'Коэффициент невыполнения (все каналы)',
      breadcrumb: 'Коэффициент невыполнения',
      overview: 'Обзор',
      orderDate: 'Дата заказа',
      myShop: 'Мой магазин',
      target: 'Цель',
      nextWeekPrediction: 'Прогноз на следующую неделю',
      weeklyPenaltyPoint: 'Еженедельный штрафной балл',
      weeklyVerifiedCriteria: 'Еженедельные критерии проверки',
      issueDate: 'Дата выдачи',
      impactPeriod: 'Период оценки влияния',
      passing: 'Хорошо',
      failing: 'Не выполнено',
      diagnosis: 'Диагностика показателя',
      diagnosisPassing: 'Сейчас всё хорошо, нет дополнительных предложений',
      salesOfIncomplete: 'Продажи незавершённых заказов',
      byAmount: 'По сумме',
      byCount: 'По количеству',
      noData: 'Нет данных',
      threshold: 'Порог',
      trendTitle: 'Тренд коэффициента невыполнения (все каналы)',
      affectedOrders: 'Затронутые заказы',
      colOrderId: 'ID заказа',
      colNfrType: 'Тип невыполнения',
      colReason: 'Причина',
      colShippingChannel: 'Канал доставки',
      colAction: 'Действие',
      emptyOrders: 'Нет затронутых заказов',
      view: 'Смотреть',
    },

    chat: {
      title: 'Показатели ответов в чате',
      breadcrumb: 'Показатели ответов в чате',
      day: 'День',
      myShop: 'Мой магазин',
      target: 'Цель',
      previousDay: 'Предыдущий день',
      chatsResponded: 'Отвеченных чатов',
      totalChats: 'Всего чатов',
      responseRate: 'Коэффициент ответов в чате',
      threshold: 'Порог',
      trendTitle: 'Коэффициент ответов в чате',
      footerNote: 'Чтобы увидеть, как показатели чата влияют на продажи, посетите',
      footerLink: 'Страницу чата в Business Insights.',
    },
  },
}

const en: { accountHealth: AccountHealthMessages['accountHealth'] } = {
  accountHealth: {
    title: 'Account Health',
    breadcrumbHome: 'Home',
    learnMore: 'Learn More',
    viewDetails: 'View Details',
    viewMore: 'More >',
    loading: 'Loading...',

    label: {
      EXCELLENT: 'Excellent',
      GOOD: 'Good',
      FAIR: 'Fair',
      POOR: 'Poor',
    },
    tagline: "All metrics are on track. Maintain your excellent performance to attract more buyers!",

    kpi: {
      performanceMetric: 'Performance Metric',
      adminSided: 'Admin Sided',
      myPenalty: 'My Penalty',
      points: 'Points',
      ongoingAppeal: 'Ongoing Appeal',
      cases: 'Cases',
      view: 'View >',
    },

    penalty: {
      title: 'My Penalty',
      penaltyPoints: 'Penalty Points',
      youCanGet: 'You can get ({{max}} max)',
      warningThreshold: 'When you reach 3 Points, you will receive new punishment.',
      ongoingPunishment: 'Ongoing Punishment',
      noPunishment: 'Excellent! No ongoing punishment',
      activePunishment: 'Active punishment',
    },

    metrics: {
      title: 'Metrics Details',
      colMetric: 'Metric',
      colCurrentPeriod: 'Current Period',
      colTarget: 'Target',
      colAppliedTo: 'Applied to',
      colAction: 'Action',

      group: {
        fulfilment: 'Fulfilment Performance',
        listing: 'Listing Performance',
        customer_service: 'Customer Service Performance',
      },

      name: {
        nfr: 'Non-fulfilment Rate (All Channels)',
        late_shipment: 'Late Shipment Rate (All Channels)',
        prep_time: 'Preparation Time',
        fast_handover: 'Fast Handover Rate',
        on_time_pickup: 'On-time Pickup Failure Rate',
        severe_listing: 'Severe Listing Violations',
        preorder_listing: 'Pre-order Listing %',
        other_listing: 'Other Listing Violations',
        response_rate: 'Response Rate',
        response_time: 'Average Response Time',
        chat_satisfaction: 'Chat Satisfaction',
        shop_rating: 'Shop Rating',
      },

      consequence: {
        penalty_points: 'Penalty Points',
        verified_seller_reset: 'Verified Seller Reset',
        listing_limit: 'Listing Limit',
        highlighted: 'Highlighted',
        none: '—',
      },
    },

    issues: {
      title: 'Issues to Improve',
      subtitle: 'There are issues you can improve on',
      listingsWithIssues: 'Listings with Issues',
      lateOrders: 'Late Orders',
      none: 'No issues',
    },

    verifiedSeller: {
      title: 'Verified Seller',
      subtitle: 'Perform better to fulfil more criteria to join Verified Seller',
      viewDetails: 'View Details >',
    },

    nfr: {
      title: 'Non-fulfilment Rate (All Channels)',
      breadcrumb: 'Non-fulfilment Rate (All Channels)',
      overview: 'Overview',
      orderDate: 'Order Date',
      myShop: 'My Shop',
      target: 'Target',
      nextWeekPrediction: 'Next Week Prediction',
      weeklyPenaltyPoint: 'Weekly Penalty Point',
      weeklyVerifiedCriteria: 'Weekly PS/Verified Criteria',
      issueDate: 'Issue date',
      impactPeriod: 'Impact evaluation period',
      passing: 'Passing',
      failing: 'Failing',
      diagnosis: 'Metric Diagnosis',
      diagnosisPassing: 'You are good now, no further suggestion',
      salesOfIncomplete: 'Sales of Incomplete Orders',
      byAmount: 'By Amount',
      byCount: 'By Count',
      noData: 'No Data',
      threshold: 'Threshold',
      trendTitle: 'Non-fulfilment Rate (All Channels) Trend',
      affectedOrders: 'Affected Orders',
      colOrderId: 'Order ID',
      colNfrType: 'Non-fulfilment type',
      colReason: 'Reason',
      colShippingChannel: 'Shipping Channel',
      colAction: 'Action',
      emptyOrders: 'No affected orders',
      view: 'View',
    },

    chat: {
      title: 'Chat Response Metrics',
      breadcrumb: 'Chat Response Metrics',
      day: 'Day',
      myShop: 'My Shop',
      target: 'Target',
      previousDay: 'Previous Day',
      chatsResponded: 'Chats Responded',
      totalChats: 'Total Chats',
      responseRate: 'Chat Response Rate',
      threshold: 'Threshold',
      trendTitle: 'Chat Response Rate',
      footerNote: 'To see how your chat performance affects sales, visit the Chat page in',
      footerLink: 'Business Insights.',
    },
  },
}

export const accountHealthMessages = { uz, ru, en }
