import type {
  AutoReply,
  ChatAssistantResponse,
  ChatChannel,
  ChatMessage,
  FaqAssistantResponse,
  FaqItem,
  HelpGuide,
  Review,
  ShortcutsListResponse,
  Ticket,
} from '../types/customer-service.types'

// Static mock seed data kept apart from the request handlers so each file stays small.
// Auto-reply / shortcut / guide TEXT is localized in the UI via i18n keys — these
// fixtures only carry identifiers, toggle state, and the demo content the backend
// will eventually own. Summaries/totals are DERIVED in the handlers (counts never lie).

export const CHANNELS: ChatChannel[] = [
  {
    id: '0190c0a0-0001-7000-8000-000000000001',
    customerName: 'Anvar Toshpulatov',
    lastMessage: 'Assalomu alaykum, buyurtmam qachon yetib keladi?',
    time: '14:32',
    unreadCount: 2,
    starred: false,
    customerSince: '2024',
    orderId: 'TZ-8921',
    orderStatus: 'shipped',
    orderTotalUzs: 540_000,
  },
  {
    id: '0190c0a0-0002-7000-8000-000000000002',
    customerName: 'Malika Sharipova',
    lastMessage: 'Rahmat, mahsulot sifati juda zoʻr ekan!',
    time: 'yesterday',
    unreadCount: 0,
    starred: true,
    customerSince: '2023',
    orderId: 'TZ-7731',
    orderStatus: 'delivered',
    orderTotalUzs: 1_440_000,
  },
  {
    id: '0190c0a0-0003-7000-8000-000000000003',
    customerName: 'Dostonbek Olimov',
    lastMessage: 'Oʻlchami toʻgʻri kelmadi, almashtirsam boʻladimi?',
    time: '2d',
    unreadCount: 0,
    starred: false,
    customerSince: '2025',
    orderId: 'TZ-4412',
    orderStatus: 'pending',
    orderTotalUzs: 222_000,
  },
]

export const MESSAGES: Record<string, ChatMessage[]> = {
  '0190c0a0-0001-7000-8000-000000000001': [
    {
      id: 'm-1-1',
      channelId: '0190c0a0-0001-7000-8000-000000000001',
      sender: 'customer',
      text: 'Xayrli kun! Kecha doʻkoningizdan krossovka buyurtma qilgan edim.',
      time: '14:30',
    },
    {
      id: 'm-1-2',
      channelId: '0190c0a0-0001-7000-8000-000000000001',
      sender: 'seller',
      text: 'Assalomu alaykum! Buyurtmangiz tizimga muvaffaqiyatli qabul qilindi.',
      time: '14:31',
    },
    {
      id: 'm-1-3',
      channelId: '0190c0a0-0001-7000-8000-000000000001',
      sender: 'customer',
      text: 'Assalomu alaykum, buyurtmam qachon yetib keladi?',
      time: '14:32',
    },
  ],
  '0190c0a0-0002-7000-8000-000000000002': [
    {
      id: 'm-2-1',
      channelId: '0190c0a0-0002-7000-8000-000000000002',
      sender: 'seller',
      text: 'Salom Malika, buyurtmangiz topshirildi. Hammasi yaxshimi?',
      time: 'yesterday',
    },
    {
      id: 'm-2-2',
      channelId: '0190c0a0-0002-7000-8000-000000000002',
      sender: 'customer',
      text: 'Rahmat, mahsulot sifati juda zoʻr ekan!',
      time: 'yesterday',
    },
  ],
  '0190c0a0-0003-7000-8000-000000000003': [
    {
      id: 'm-3-1',
      channelId: '0190c0a0-0003-7000-8000-000000000003',
      sender: 'customer',
      text: 'Oʻlchami toʻgʻri kelmadi, almashtirsam boʻladimi?',
      time: '2d',
    },
  ],
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'orders',
    question: 'Mijoz buyurtmani bekor qilsa, komissiya qaytariladimi?',
    answer:
      'Ha, agar mijoz mahsulot doʻkondan chiqishidan oldin buyurtmani bekor qilsa yoki qoidalarga muvofiq qaytarish boʻlsa, platforma komissiyasi balansingizga toʻliq qaytariladi.',
  },
  {
    id: 'faq-2',
    category: 'delivery',
    question: 'Yetkazib berish kechiksa reytingga qanday taʼsir qiladi?',
    answer:
      'Buyurtmalarni belgilangan vaqtdan kech kuryerga topshirish doʻkon ishonchlilik reytingini tushiradi va qidiruv natijalarida pastroq koʻrinishiga sabab boʻladi.',
  },
  {
    id: 'faq-3',
    category: 'finance',
    question: 'Ishlab topilgan mablagʻlarni yechib olish qancha vaqt oladi?',
    answer:
      'Mablagʻ bank hisob raqamiga oʻtkazish soʻrovi yuborilgach, moliyaviy tekshiruv va bank amaliyotlari sababli 1-3 ish kuni ichida hisobingizga tushadi.',
  },
  {
    id: 'faq-4',
    category: 'account',
    question: 'Ikkinchi doʻkonni ochish uchun yangi profil kerakmi?',
    answer:
      'Yoʻq, bitta sotuvchi akkaunti orqali panel ichidan bir nechta turli toifadagi savdo doʻkonlarini yaratish va boshqarish mumkin.',
  },
]

export const TICKETS: Ticket[] = [
  {
    id: '0190c0a0-1001-7000-8000-000000001001',
    ref: 'TK-4091',
    customerName: 'Anvar Toshpulatov',
    subject: 'Buyurtma yetib kelmadi va kechikmoqda',
    category: 'delivery',
    priority: 'high',
    status: 'open',
    date: '2026-06-10',
    description:
      'Mahsulot 3 kun oldin yetib kelishi kerak edi, lekin hali ham kuryerdan darak yoʻq. Iltimos, tekshirib bering.',
  },
  {
    id: '0190c0a0-1002-7000-8000-000000001002',
    ref: 'TK-3822',
    customerName: 'Malika Sharipova',
    subject: 'Toʻlov qaytarilishi boʻyicha soʻrov',
    category: 'finance',
    priority: 'medium',
    status: 'pending',
    date: '2026-06-08',
    description:
      'Oʻlcham toʻgʻri kelmagani uchun mahsulotni qaytargandim. Pul qachon kartamga qaytariladi?',
  },
  {
    id: '0190c0a0-1003-7000-8000-000000001003',
    ref: 'TK-3115',
    customerName: 'Dostonbek Olimov',
    subject: 'Kupon kodi ishlamayapti',
    category: 'promotion',
    priority: 'low',
    status: 'resolved',
    date: '2026-06-05',
    description:
      'Yangi foydalanuvchilar uchun berilgan promo-kodni savatchada kiritganimda xatolik beradi.',
  },
  {
    id: '0190c0a0-1004-7000-8000-000000001004',
    ref: 'TK-2994',
    customerName: 'Jasur Baxtiyorov',
    subject: 'Mahsulot tavsifidagi xatolik',
    category: 'product_info',
    priority: 'low',
    status: 'resolved',
    date: '2026-06-01',
    description:
      'Telefon gʻilofi tavsifida iPhone 14 yozilgan, lekin rasmda iPhone 15 turibdi. Aniqlik kiritib bera olasizmi?',
  },
]

export const HELP_GUIDES: HelpGuide[] = [
  { id: 'guide-start', slug: 'start', articleCount: 5 },
  { id: 'guide-finance', slug: 'finance', articleCount: 3 },
  { id: 'guide-safety', slug: 'safety', articleCount: 4 },
]

export const CHAT_ASSISTANT: ChatAssistantResponse = {
  autoReplies: [
    { kind: 'default', message: 'default', enabled: true },
    { kind: 'off_work', message: 'offWork', enabled: true },
  ],
  shortcutGroups: [{ id: 'grp-common', name: 'common', description: 'available', enabled: true }],
}

export const FAQ_ASSISTANT: FaqAssistantResponse = {
  cards: [],
}

// ── Shopee-spec seed data ─────────────────────────────────────────────────────

export const AUTO_REPLIES: AutoReply[] = [
  {
    kind: 'default',
    enabled: true,
    message:
      'Auto-Reply Message: Thank you for your message! Our team is availability limited and weʻll respond to your query within 24-48 hour. We apologise for any inconvenience caused. Thank you for your support!',
  },
  {
    kind: 'off_work',
    enabled: false,
    message:
      'Dear buyer, your message is well received. As it is currently outside our working hours, we are unable to respond to you. We will reply once we are online. Thank you for understanding.',
  },
]

export const SHORTCUTS_DATA: ShortcutsListResponse = {
  showHintsAutomatically: true,
  totalCount: 12,
  maxCount: 25,
  groups: [
    {
      id: 'grp-cs',
      name: 'Customer Service',
      description: '',
      enabled: true,
      shortcuts: [
        {
          id: 'sc-01',
          groupId: 'grp-cs',
          keyword: 'Orderquery',
          messageText:
            'Thank you for reaching out! Can you please provide us with your order number or any other relevant details so that we can assist you with your query?',
          sortOrder: 1,
        },
        {
          id: 'sc-02',
          groupId: 'grp-cs',
          keyword: 'Productinquiry',
          messageText:
            'Thank you for your message! We would be happy to help you with your product inquiry. Please let us know which product you are interested in, and weʻll do our best to provide you with the information you need.',
          sortOrder: 2,
        },
        {
          id: 'sc-03',
          groupId: 'grp-cs',
          keyword: 'Shippinginquiry',
          messageText:
            'Thank you for your message! Please provide us with your order number and weʻll do our best to provide you with an update on your shipping status.',
          sortOrder: 3,
        },
        {
          id: 'sc-04',
          groupId: 'grp-cs',
          keyword: 'Returnrequest',
          messageText:
            'Weʻre sorry to hear that you are not completely satisfied with your order. Can you please provide us with your order number and a brief explanation of the issue you are experiencing? Weʻll review your request and provide you with instructions on how to initiate a return.',
          sortOrder: 4,
        },
        {
          id: 'sc-05',
          groupId: 'grp-cs',
          keyword: 'Technicalsupport',
          messageText:
            'Thank you for contacting us! Please provide us with the details of the technical issue you are experiencing and weʻll do our best to provide you with a solution.',
          sortOrder: 5,
        },
        {
          id: 'sc-06',
          groupId: 'grp-cs',
          keyword: 'Feedbackrequest',
          messageText:
            'We hope youʻre enjoying your purchase! Would you mind taking a moment to provide us with your feedback or a testimonial of your experience with our product or service? We value your opinion and appreciate your support.',
          sortOrder: 6,
        },
        {
          id: 'sc-07',
          groupId: 'grp-cs',
          keyword: 'Productavailability',
          messageText:
            'Thank you for your message! Please let us know which product you are interested in and weʻll do our best to provide you with an update on its availability.',
          sortOrder: 7,
        },
        {
          id: 'sc-08',
          groupId: 'grp-cs',
          keyword: 'Orderconfirmation',
          messageText:
            'Thank you for your order! We have received your request and are working on processing it. Your order number is {order_number}. You will receive a confirmation email shortly with your order details. If you have any questions, feel free to ask us.',
          sortOrder: 8,
        },
        {
          id: 'sc-09',
          groupId: 'grp-cs',
          keyword: 'Deliveryconfirmation',
          messageText:
            'Weʻre happy to confirm that your order has been shipped and is on its way! You should receive an email with the tracking information shortly. If you have any questions or concerns, please feel free to ask us.',
          sortOrder: 9,
        },
        {
          id: 'sc-10',
          groupId: 'grp-cs',
          keyword: 'Orderupdate',
          messageText:
            'We wanted to provide you with an update on your order. There has been a delay in the shipment of your order due to {reason}. We apologise for any inconvenience this may cause and are working to resolve the issue as quickly as possible. If you have any questions, feel free to ask us.',
          sortOrder: 10,
        },
        {
          id: 'sc-11',
          groupId: 'grp-cs',
          keyword: 'Productreviewrequest',
          messageText:
            'We hope youʻre enjoying your purchase! Would you mind taking a moment to provide us with a product review? Your feedback is important to us and will help us improve our products and services.',
          sortOrder: 11,
        },
        {
          id: 'sc-12',
          groupId: 'grp-cs',
          keyword: 'Promooffer',
          messageText:
            'We wanted to let you know about a special promotion weʻre currently running on our products. Use the code {promo_code} at checkout to receive [Discount/Free Shipping/Buy One Get One] on your next order. Donʻt miss out!',
          sortOrder: 12,
        },
      ],
    },
  ],
}

// ── Backend-shaped reviews (mirrors GET /sellers/me/reviews) ──────────────────
// snake_case, {uz,ru,en} jsonb title, integer rating, ISO created_at — identical
// to the live Postgres contract so dev (MSW) and prod return the SAME shape.
export interface BackendReviewFixture {
  product_id: string
  product_title: { uz?: string; ru?: string; en?: string }
  author_name: string
  rating: number
  comment: string
  created_at: string
}

export const BACKEND_REVIEWS: BackendReviewFixture[] = [
  {
    product_id: '0190c0a0-2001-7000-8000-000000002001',
    product_title: {
      uz: 'MacBook uchun kristall matte qattiq gʻilof 13/14/16 dyuym',
      ru: 'Кристально-матовый жёсткий чехол для MacBook 13/14/16 дюймов',
      en: 'MacBook crystal matte hardcase 13/14/16 inch',
    },
    author_name: 'parveen',
    rating: 5,
    comment: 'this is sooo worth the money!! I love it so much! def would buy again!',
    created_at: '2026-06-14T03:04:00Z',
  },
  {
    product_id: '0190c0a0-2001-7000-8000-000000002001',
    product_title: {
      uz: 'MacBook uchun kristall matte qattiq gʻilof 13/14/16 dyuym',
      ru: 'Кристально-матовый жёсткий чехол для MacBook 13/14/16 дюймов',
      en: 'MacBook crystal matte hardcase 13/14/16 inch',
    },
    author_name: 'order30e60',
    rating: 5,
    comment: 'Nice',
    created_at: '2026-06-13T11:20:00Z',
  },
  {
    product_id: '0190c0a0-2002-7000-8000-000000002002',
    product_title: {
      uz: 'Telefon uchun himoya gʻilofi',
      ru: 'Защитный чехол для телефона',
      en: 'Protective phone case',
    },
    author_name: 'user.88',
    rating: 4,
    comment: 'Perfect fit, great quality!',
    created_at: '2026-06-12T14:22:00Z',
  },
  {
    product_id: '0190c0a0-2002-7000-8000-000000002002',
    product_title: {
      uz: 'Telefon uchun himoya gʻilofi',
      ru: 'Защитный чехол для телефона',
      en: 'Protective phone case',
    },
    author_name: 'aziz_t',
    rating: 2,
    comment: 'Rangi rasmga oʻxshamaydi, biroz xafa boʻldim.',
    created_at: '2026-06-10T09:15:00Z',
  },
]

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-001',
    orderId: '24606NH30X8WUR3',
    buyerUsername: 'parveen',
    buyerAvatar: '',
    orderDate: '14/06/2026 03:04',
    productThumbnail: '',
    productTitle: '[SG Ready|Stock] MacBook ca se crystal matte hardcasing hard cover casing for 13INCH 14INCH 16INCH M2 Air Pro compatible',
    productVariants: ['Crystal Clear/13" Pro (2016-2022)', 'Crystal Clear/14" Pro (2021-2023)'],
    rating: 5,
    reviewText: 'this is sooo worth the money!! I love it so much! def would buy again!',
    images: [],
    hasReply: false,
    createdAt: '2026-06-14',
  },
  {
    id: 'rev-002',
    orderId: '24601H3P4GNWHR4',
    buyerUsername: 'order30e60',
    buyerAvatar: '',
    orderDate: '14/06/2026 03:04',
    productThumbnail: '',
    productTitle: '[SG Ready|Stock] MacBook ca se crystal matte hardcasing hard cover casing for 13INCH 14INCH 16INCH M2 Air Pro compatible',
    productVariants: ['Crystal Clear/13" Pro (2016-2022)'],
    rating: 5,
    reviewText: 'Nice',
    images: [],
    hasReply: false,
    createdAt: '2026-06-13',
  },
  {
    id: 'rev-003',
    orderId: '246017Y94C7HNPJ',
    buyerUsername: 'user.88',
    buyerAvatar: '',
    orderDate: '13/06/2026 14:22',
    productThumbnail: '',
    productTitle: '[SG Ready|Stock] MacBook ca se crystal matte hardcasing hard cover casing for 13INCH 14INCH 16INCH M2 Air Pro compatible',
    productVariants: ['Crystal Clear/14" Pro (2021-2023)'],
    rating: 5,
    reviewText: 'Perfect fit, great quality!',
    images: [],
    hasReply: false,
    createdAt: '2026-06-12',
  },
]
