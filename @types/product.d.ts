
interface DetailsType {
   name: string;
   package_level: string;
   price: number;
   contract_duration_in_days: number;
   daily_rate: number;
   total_revenue: number;
}

interface Product_Type extends DetailsType {
   image: string | StaticImport;
}

interface UserPlan_Type extends DetailsType {
   expiringDate: string;
}