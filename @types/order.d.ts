
interface UserOrderType {
   txid?: string;
   email: string;
   status: 'pending' | 'completed' | 'failed';
   coin: 'USDT';
   address: string;
   displayAmount: string;
   _id: string;
}