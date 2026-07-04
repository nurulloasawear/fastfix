// Finance i18n barrel — combines uz/ru/en into `financeMessages` consumed by
// the central i18n orchestrator at src/i18n/index.ts.
// Strings split across i18n/uz.ts · i18n/ru.ts · i18n/en.ts to stay ≤200 lines.
import uz from './i18n/uz'
import ru from './i18n/ru'
import en from './i18n/en'

export const financeMessages = { uz, ru, en }
export type { FinanceMessages } from './i18n/uz'
