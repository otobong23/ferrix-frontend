type TIER_LIST_TYPE = {
   type: string
   title: string,
   image?: StaticImport | string,
   icon?: string
   details: {
      price: string,
      daily_yield: string,
      duration: string,
      roi: string,
      purchase_limit: string
   }
   expiring_date?: string
   createdAt?: string
}

type detailsType = {
    price: string;
    daily_yield: string;
    duration: string;
    roi: string;
    purchase_limit: string;
}

type Tier_List_Props = {
   TIER_LIST: TIER_LIST_TYPE
   handleBUY?: (title: TIER_LIST_TYPE) => void
   bg?: string
   btn_bg?: string
   iconColor?: string
}


type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
   footer?: React.ReactNode;
};