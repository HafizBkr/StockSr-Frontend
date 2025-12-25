export interface SubAdmin {
  subadmin_id: number;
  subadmin_name: string;
  subadmin_email: string;
  subadmin_password?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
