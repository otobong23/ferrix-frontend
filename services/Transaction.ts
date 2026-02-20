import authFetch from "@/utils/api";


export async function withdrawAPI(details: {
   amount: number;
   walletAddress?: string;
}) {
   const res = await authFetch.post("/transaction/withdraw", details)
   return res.data
}

export async function createOrderAPI(details: {
   amount: number;
}): Promise<{message: string, order: UserOrderType}> // promise of the deposit address
{
   const res = await authFetch.post("/transaction/create", details)
   return res.data
}

export async function createDepositTransactionAPI(details: {
   orderID: string;
}): Promise<{message: string, transaction: TransactionType}> // promise of the deposit address
{
   const res = await authFetch.post("/transaction/create-deposit-transaction", details)
   return res.data
}

export async function getTransactionsAPI({ limit, page }: {
   limit: number;
   page: number;
}): Promise<transactionResponseType> {
   const res = await authFetch.get(`/transaction?limit=${limit}&page=${page}`)
   return res.data
}

export async function getPlanAPI(details: {
   amount: number;
   plan: string
}) {
   const res = await authFetch.post("/transaction/getPlan", details)
   return res.data
}

export async function mineAPI(details: {
   amount: number;
}): Promise<number> {
   const res = await authFetch.post("/transaction/mine", details)
   return res.data
}

export async function resolve_accountAPI(details: {
   account_number: string;
   account_bank: string;
}) {
   const res = await authFetch.post("/transaction/resolve_account", details)
   return res.data
}

export async function spinWheelAPI() {
   const res = await authFetch.get("/transaction/spin-wheel")
   return res.data
}

export async function getCheckInTransactionsAPI({ limit, page }: {
   limit: number;
   page: number;
}): Promise<transactionResponseType> {
   const res = await authFetch.get(`/transaction/check-in-transaction?limit=${limit}&page=${page}`)
   return res.data
}