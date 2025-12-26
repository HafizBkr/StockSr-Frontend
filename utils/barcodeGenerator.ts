/**
 * Utilitaire pour générer des codes-barres uniques
 */

// Cache pour stocker les codes-barres existants (à adapter selon votre implémentation)
let existingBarcodes: Set<string> = new Set();

/**
 * Génère un code-barre EAN-13 valide
 */
function generateEAN13(): string {
  // Préfixe pour votre entreprise (3 premiers chiffres)
  // Vous pouvez utiliser 200-299 pour les codes internes
  const companyPrefix = '200';

  // Générer 9 chiffres aléatoires pour le produit
  let productCode = '';
  for (let i = 0; i < 9; i++) {
    productCode += Math.floor(Math.random() * 10);
  }

  // Construire les 12 premiers chiffres
  const baseCode = companyPrefix + productCode;

  // Calculer la clé de contrôle (13ème chiffre)
  const checkDigit = calculateEAN13CheckDigit(baseCode);

  return baseCode + checkDigit;
}

/**
 * Calcule la clé de contrôle pour un code EAN-13
 */
function calculateEAN13CheckDigit(code: string): string {
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i]);
    // Multiplier par 1 pour les positions impaires, par 3 pour les positions paires
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }

  // La clé de contrôle est le complément à 10 du reste de la division par 10
  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit.toString();
}

/**
 * Génère un code-barre simple (numérique)
 */
function generateSimpleBarcode(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return timestamp + random;
}

/**
 * Génère un code-barre alphanumérique
 */
function generateAlphanumericBarcode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Vérifie si un code-barre est déjà utilisé
 */
export async function isBarcodeUsed(barcode: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/produits/check-barcode`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code_barre: barcode }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.exists || false;
    }

    // Si l'API n'existe pas encore, utiliser le cache local
    return existingBarcodes.has(barcode);
  } catch (error) {
    console.warn('Erreur lors de la vérification du code-barre, utilisation du cache local:', error);
    return existingBarcodes.has(barcode);
  }
}

/**
 * Ajoute un code-barre au cache des codes existants
 */
export function addBarcodeToCache(barcode: string): void {
  existingBarcodes.add(barcode);
}

/**
 * Met à jour le cache avec une liste de codes-barres existants
 */
export function updateBarcodeCache(barcodes: string[]): void {
  existingBarcodes = new Set(barcodes);
}

/**
 * Type de code-barre à générer
 */
export type BarcodeType = 'ean13' | 'simple' | 'alphanumeric';

/**
 * Génère un code-barre unique selon le type spécifié
 */
export async function generateUniqueBarcode(
  type: BarcodeType = 'ean13',
  token: string,
  maxAttempts: number = 10
): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    let barcode: string;

    switch (type) {
      case 'ean13':
        barcode = generateEAN13();
        break;
      case 'simple':
        barcode = generateSimpleBarcode();
        break;
      case 'alphanumeric':
        barcode = generateAlphanumericBarcode();
        break;
      default:
        barcode = generateEAN13();
    }

    // Vérifier si le code-barre est unique
    const isUsed = await isBarcodeUsed(barcode, token);

    if (!isUsed) {
      // Ajouter au cache pour éviter les doublons futurs
      addBarcodeToCache(barcode);
      return barcode;
    }

    attempts++;
  }

  throw new Error(`Impossible de générer un code-barre unique après ${maxAttempts} tentatives`);
}

/**
 * Valide un code-barre EAN-13
 */
export function validateEAN13(barcode: string): boolean {
  // Vérifier que c'est bien 13 chiffres
  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }

  // Vérifier la clé de contrôle
  const baseCode = barcode.substring(0, 12);
  const expectedCheckDigit = calculateEAN13CheckDigit(baseCode);
  const actualCheckDigit = barcode[12];

  return expectedCheckDigit === actualCheckDigit;
}

/**
 * Formate un code-barre pour l'affichage
 */
export function formatBarcode(barcode: string, type: BarcodeType = 'ean13'): string {
  if (type === 'ean13' && barcode.length === 13) {
    // Format: 1 234567 890123
    return `${barcode[0]} ${barcode.substring(1, 7)} ${barcode.substring(7, 13)}`;
  }

  return barcode;
}

/**
 * Génère un code-barre pour un nouveau produit avec préfixe de catégorie
 */
export async function generateProductBarcode(
  categoryId: string,
  token: string,
  type: BarcodeType = 'ean13'
): Promise<string> {
  // Mapper les catégories à des préfixes (optionnel)
  const categoryPrefixes: Record<string, string> = {
    '1': '201', // Téléphones
    '2': '202', // Accessoires
    '3': '203', // Informatique
  };

  if (type === 'ean13') {
    const prefix = categoryPrefixes[categoryId] || '200';

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Générer 9 chiffres aléatoires
      let productCode = '';
      for (let i = 0; i < 9; i++) {
        productCode += Math.floor(Math.random() * 10);
      }

      const baseCode = prefix + productCode;
      const checkDigit = calculateEAN13CheckDigit(baseCode);
      const barcode = baseCode + checkDigit;

      const isUsed = await isBarcodeUsed(barcode, token);

      if (!isUsed) {
        addBarcodeToCache(barcode);
        return barcode;
      }

      attempts++;
    }
  }

  // Fallback vers la génération standard
  return generateUniqueBarcode(type, token);
}
