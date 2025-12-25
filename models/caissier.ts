export interface Caissier {
  caissier_id: number;
  username: string;
  password?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
