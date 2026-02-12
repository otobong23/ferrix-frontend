type withdrawalWallet = {
  walletAddress: string;
  amount: number;
};

interface UserMetaType {
  accessToken: string;
  userID: string;
  email: string;
  sub: string;
  expires_at: number;
}


type UserType = {
  userID: string
  username: string;
  email: string;
  balance: number;
  totalYield: number;
  totalWithdraw: number;
  totalDeposit: number;
  transactionCount: number;
  currentPlan: UserPlan_Type[];
  previousPlan: UserPlan_Type[];
  whatsappNo?: string;
  facebook?: string;
  telegram?: string;
  profileImage?: string;
  referral_code: string;
  referredBy?: string;
  referral_count?: number;
  depositAddress: string;
  usdtWallet: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  walletPassword: string
  withdrawalWallet?: withdrawalWallet;
  withdrawStatus?: 'pending' | 'completed' | 'failed';
  twentyFourHourTimerStart?: string | undefined;
  spinWheelTimerStart: number
  oneTimeBonus: boolean;
  ActivateBot?: boolean;
  vip: number;
  meter: number;
  joinDate?: Date;
};