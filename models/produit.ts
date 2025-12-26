/frontend/models/produit.ts
```
```ts
// Modèles TypeScript pour l'entité Produit (StockSR)

export type Produit = {
  produit_id: string;
  nom: string;
  description?: string;
  reference?: string;
  code_barre?: string;
  prix_achat: number;
  prix_vente: number;
  unite: string;
  quantite_stock: number;
  seuil_alerte: number;
  categorie_id: string;
  fournisseur_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  created_by_type: string;
  updated_by_id: string;
  updated_by_type: string;
};

export type ProduitCreate = {
  nom: string;
  prix_achat: number;
  prix_vente: number;
  unite: string;
  quantite_stock: number;
  seuil_alerte: number;
  categorie_id: string;
  fournisseur_id: string;
  description?: string;
  reference?: string;
  code_barre?: string;
};

export type ProduitUpdate = Partial<Omit<ProduitCreate, "categorie_id" | "fournisseur_id">> & {
  categorie_id?: string;
  fournisseur_id?: string;
};
