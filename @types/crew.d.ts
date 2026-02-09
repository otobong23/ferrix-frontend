interface CrewMemberType {
  userID: string;
  username: string;
  level: 1 | 2 | 3; // Restrict to valid levels
  joinedAt?: string; // ISO string (from Date)
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  currentPlan?: string[];
}

interface CrewType {
  userID: string;
  ownerUsername: string;
  ownerReferralCode: string;
  members: {
    level_1: CrewMemberType[];
    level_2: CrewMemberType[];
    level_3: CrewMemberType[];
  }
  totalMembers: number;
  totalCrewDeposits: number;
  totalCrewWithdrawals: number;
  totalCrewTransactions: number;
  lastUpdated: string; // ISO date string
}

type CrewResponse = {
  crews: CrewType,
  limit: number
  page: number
  total: number
  totalPages: number
}