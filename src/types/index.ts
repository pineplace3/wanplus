export type GroundType = "土" | "砂" | "芝";
export type ZoneType =
  | "共用のみ"
  | "小型犬専用あり"
  | "大型犬専用あり"
  | "共用あり";

export interface Address {
  prefecture: string;
  city: string;
  line1?: string;
}

export interface Contact {
  phone?: string;
  website?: string;
  xAccount?: string;
  instagramAccount?: string;
}

export interface CommonFields {
  id: string;
  name: string;
  description: string;
  image: string;
  address: Address;
  hours?: string;
  holidays?: string;
  contact: Contact;
  reviews?: string;
}

export interface DogRun extends CommonFields {
  parking: boolean;
  zone: ZoneType;
  ground: GroundType;
  facilities: {
    water: boolean | "不明";
    footWash: boolean | "不明";
    agility: boolean | "不明";
    lights: boolean | "不明";
  };
  conditions?: string;
  mannersWear?: boolean | "不明";
  fee?: string;
}

export type CompanionArea = "店内OK" | "テラスのみ";
export type DogMenu = "有り" | "無し";
export type SizeLimit = "小型犬のみ" | "大型犬OK";

export interface Cafe extends CommonFields {
  parking: boolean;
  companionArea: CompanionArea;
  dogMenu: DogMenu;
  sizeLimit: SizeLimit;
  services?: string;
  conditions?: string;
  mannersWear?: boolean | "不明";
}

export interface Clinic extends CommonFields {
  afterHours?: "対応あり" | "対応なし";
  petHotel?: boolean;
  trimming?: boolean;
  specialists?: string;
  equipment?: string[];
  associations?: string[];
}

export interface Stay extends CommonFields {
  parking: boolean;
  allowedSize: SizeLimit;
  hasDogRun: boolean;
  dogRunType?: "共有ドッグラン" | "部屋併設ドッグラン";
  companionRange: "客室内のみ" | "レストラン同伴可" | "ロビー歩行可";
  amenities: string[];
  extraFees?: {
    perDog?: string;
    cleaning?: string;
  };
  conditions?: string;
  environment?: string;
  nearbyClinic?: string;
}
