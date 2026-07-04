// i18n barrel — combines uz/ru/en into the `productsMessages` export consumed by
// the central i18n orchestrator at src/i18n/index.ts.
// Strings split across i18n/uz.ts · i18n/ru.ts · i18n/en.ts to stay ≤200 lines.
import uz from './i18n/uz'
import ru from './i18n/ru'
import en from './i18n/en'

export const productsMessages = { uz, ru, en }
export type { ProductMessages } from './i18n/uz'
