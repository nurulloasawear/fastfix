import type { FinanceMessages } from './uz'

const en: FinanceMessages = {
  finance: {
    nav: { income: 'My Income', balance: 'My Balance', bankAccounts: 'Bank Accounts', settings: 'Payment Settings' },
    incomeOverview: {
      title: 'Income Overview',
      banner: 'No adjustment will be included in the numbers below. Please download income report / income statement to check related adjustment details.',
      pending: 'Pending', released: 'Released', total: 'Total',
      thisWeek: 'This Week', thisMonth: 'This Month',
      myBankAccount: 'My Bank Account:', myBalance: 'My Balance',
    },
    incomeDetails: {
      title: 'Income Details', tabPending: 'Pending', tabReleased: 'Released',
      thisWeek: 'This Week', thisMonth: 'This Month', export: 'Export', searchOrder: 'Search Order',
      col: { order: 'Order', releasedOn: 'Payout Released on', status: 'Status', paymentMethod: 'Payment Method', releasedAmount: 'Released Amount' },
      status: { pending: 'Pending', released: 'Released', on_hold: 'On Hold', cancelled: 'Cancelled' },
      method: { atmos: 'Atmos', payme: 'Payme', ozb_wallet: 'OZB Wallet' },
      empty: 'No Data',
    },
    sidebar: { statementsTitle: 'Income Statements', taxInvoicesTitle: 'My Tax Invoices', more: 'More', noStatements: 'No statements yet', noInvoices: 'No invoices yet', viewBalance: 'View My Balance' },
    statements: {
      title: 'Income Statements', subtitle: 'Only statements from the last 24 months are retained. Please download a PDF copy of the statements for your own record.',
      downloadAll: 'Download All',
      col: { statement: 'Statements', totalPayout: 'Total Payout Released', date: 'Date', action: 'Action' },
      download: 'Download', downloaded: 'Downloaded',
      latestTitle: 'Latest Reports', latestBanner: 'Here are the reports you have not downloaded.',
      latestColName: 'Report name', latestColAction: 'Options',
      latestFooter: 'View all in:', myReports: 'My Reports', empty: 'No statements yet',
    },
    walletCard: {
      title: 'Balance Overview', walletBalance: 'Wallet Balance',
      autoWithdrawOn: 'Auto-withdrawal: ON', autoWithdrawOff: 'Auto-withdrawal: OFF',
      withdraw: 'Withdraw', myBankAccount: 'My Bank Account', more: 'More >', default: 'Default', noAccount: 'No account linked',
      accountStatus: { verified: 'Verified', checked: 'Checked', pending: 'Pending', error: 'Error' },
    },
    txFilters: {
      moneyFlow: 'Money Flow', shopType: 'Shop Type', txType: 'Transaction Type', local: 'Local',
      flow: { all: 'All', money_in: 'Money In', money_out: 'Money Out' },
      type: { order_income: 'Order Income', adjustment: 'Adjustment', refund: 'Refund from Order', withdrawal: 'Withdrawals', platform_fee: 'Platform Fee' },
      reset: 'Reset', apply: 'Apply',
    },
    txTable: {
      count: '{{count}} Transactions (Total Amount: {{amount}})', searchPlaceholder: 'Search Order ID', export: 'Export',
      recentTitle: 'Recent Transactions',
      col: { dateTime: 'Date/Time', description: 'Description', txId: 'Transaction ID', amount: 'Amount', status: 'Status' },
      txStatus: { completed: 'Completed', pending: 'Pending', failed: 'Failed' },
      empty: 'No Transaction History',
    },
    txDetail: {
      breadcrumbHome: 'Home', breadcrumbBalance: 'My Balance', breadcrumb: 'Transaction Details',
      incomeTitle: 'Income from Order #{orderId}', walletBalance: 'Wallet Balance:',
      createTime: 'Create Time', buyer: 'Buyer', orderId: 'Order ID',
      notFound: 'Transaction not found',
      status: { completed: 'Completed', pending: 'Pending', failed: 'Failed' },
      typeLabel: { order_income: 'Order Income', adjustment: 'Adjustment', refund: 'Refund from Order', withdrawal: 'Withdrawals', platform_fee: 'Platform Fee' },
    },
    payAccount: {
      title: 'Add Bank Account', addCard: 'Add Bank Account',
      emptyTitle: 'No bank account linked', emptyDesc: 'Link a bank account to enable withdrawals',
      status: { verified: 'Verified', checked: 'Checked', pending: 'Pending', error: 'Error' },
      default: 'Default', setDefault: 'Set as Default', remove: 'Remove', removeConfirm: 'Remove this card?',
    },
    income: {
      title: 'My Income', subtitle: 'All funds received by the store and income analytics', totalShown: 'Total income shown',
      method: { all: 'All', card: 'Card', cash: 'Cash', invoice: 'Invoice' },
      col: { source: 'Income source', orderId: 'Order ID', method: 'Payment type', date: 'Date', amount: 'Amount' },
      empty: 'No income found',
    },
    balance: {
      title: 'My Balance', subtitle: 'Track funds collected from sales and withdraw to your account',
      available: 'Available to withdraw', availableNote: '● Fee-free withdrawal active',
      hold: 'In processing (Hold)', holdNote: 'Awaiting buyer confirmation',
      withdrawnThisMonth: 'Withdrawn this month', lastWithdraw: 'Last withdrawal: {{date}}', lastWithdrawNever: 'No withdrawals yet',
      formTitle: 'Transfer funds to account', selectAccount: 'Select account', amount: 'Withdrawal amount (UZS)', amountPlaceholder: 'e.g. 5 000 000',
      submit: 'Confirm transfer', submitting: 'Sending…', success: '{{amount}} successfully sent to {{bank}}!',
      errInvalid: 'Enter a valid amount', errInsufficient: 'Insufficient balance', noAccounts: 'Add a bank account first',
    },
    accounts: {
      title: 'Bank Accounts', subtitle: 'Your registered official bank accounts for withdrawals', add: '+ Add new account',
      primary: 'Primary', makePrimary: 'Make primary', delete: 'Delete', deleteConfirm: 'Delete this bank account?',
      mfo: 'MFO: {{mfo}}', empty: 'No accounts added yet', modalTitle: 'New bank account',
      bankName: 'Bank name', bankNamePlaceholder: 'e.g. Asakabank JSC',
      accountName: 'Account holder (LLC or full name)', accountNamePlaceholder: 'e.g. OZB GLOBAL SOLUTIONS',
      accountNumber: 'Account number (20 digits)', accountNumberPlaceholder: '20208000...',
      mfoCode: 'MFO code (5 digits)', mfoPlaceholder: '00440', cancel: 'Cancel', save: 'Link account', saving: 'Saving…',
    },
    settings: {
      title: 'Payment Settings', subtitle: 'Rules for automatic transfers and financial notifications',
      autoWithdraw: 'Automatic fund transfer', autoWithdrawNote: 'Auto-send to bank account when balance reaches a set amount',
      period: 'Transfer frequency', periodDaily: 'Every night (23:59)', periodWeekly: 'Every week (on Mondays)', periodMonthly: 'On the last day of each month',
      notify: 'Transaction notifications', notifyNote: 'SMS to your phone number on every balance change',
      save: 'Save rules', saving: 'Saving…', success: 'Settings saved successfully!',
    },
  },
}

export default en
