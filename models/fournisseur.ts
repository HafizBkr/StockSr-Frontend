export interface Fournisseur {
  fournisseur_id: string;
  nom: string;
  contact?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by_id: string;
  created_by_type: 'admin' | 'subadmin';
  updated_by_id?: string;
  updated_by_type?: 'admin' | 'subadmin';
}

export interface FournisseurCreate {
  nom: string;
  contact?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  description?: string;
}

export interface FournisseurUpdate {
  nom?: string;
  contact?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  description?: string;
  is_active?: boolean;
}

export interface FournisseurApiResponse {
  fournisseur_id: string;
  nom: string;
  contact?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  created_by_type: 'admin' | 'subadmin';
  updated_by_id?: string;
  updated_by_type?: 'admin' | 'subadmin';
}

// Utilitaires de mapping
export function mapApiResponseToFournisseur(apiResponse: FournisseurApiResponse): Fournisseur {
  return {
    fournisseur_id: apiResponse.fournisseur_id,
    nom: apiResponse.nom,
    contact: apiResponse.contact,
    adresse: apiResponse.adresse,
    email: apiResponse.email,
    telephone: apiResponse.telephone,
    description: apiResponse.description,
    is_active: apiResponse.is_active,
    created_at: new Date(apiResponse.created_at),
    updated_at: new Date(apiResponse.updated_at),
    created_by_id: apiResponse.created_by_id,
    created_by_type: apiResponse.created_by_type,
    updated_by_id: apiResponse.updated_by_id,
    updated_by_type: apiResponse.updated_by_type,
  };
}

export function mapFournisseurToApiCreate(fournisseur: FournisseurCreate): FournisseurCreate {
  return {
    nom: fournisseur.nom,
    contact: fournisseur.contact,
    adresse: fournisseur.adresse,
    email: fournisseur.email,
    telephone: fournisseur.telephone,
    description: fournisseur.description,
  };
}

export function mapFournisseurToApiUpdate(fournisseur: FournisseurUpdate): FournisseurUpdate {
  const update: FournisseurUpdate = {};

  if (fournisseur.nom !== undefined) update.nom = fournisseur.nom;
  if (fournisseur.contact !== undefined) update.contact = fournisseur.contact;
  if (fournisseur.adresse !== undefined) update.adresse = fournisseur.adresse;
  if (fournisseur.email !== undefined) update.email = fournisseur.email;
  if (fournisseur.telephone !== undefined) update.telephone = fournisseur.telephone;
  if (fournisseur.description !== undefined) update.description = fournisseur.description;
  if (fournisseur.is_active !== undefined) update.is_active = fournisseur.is_active;

  return update;
}
