
interface UserOrderType {
   txid?: string;
   email: string;
   status: 'pending' | 'completed' | 'failed';
   coin: 'USDT';
   address: string;
   invoice_url: string;
   ipn_callback_url: string;
   displayAmount: string;
   _id: string;
}