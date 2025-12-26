export interface Categorie {
  categorie_id: string;
  nom: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  created_by: string;
  created_by_id: string;
  created_by_type: 'admin' | 'subadmin';
  created_by_username?: string;
  updated_at?: Date;
  updated_by?: string;
  updated_by_id?: string;
  updated_by_type?: 'admin' | 'subadmin';
  updated_by_username?: string;
}
