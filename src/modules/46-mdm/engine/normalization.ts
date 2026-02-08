/**
 * MDM Normalization Engine
 * Normalizes names, phones, emails, addresses
 */

export interface NormalizationResult {
  original: string;
  normalized: string;
  changes: string[];
}

/**
 * Normalize a person's name
 */
export function normalizeName(name: string): NormalizationResult {
  if (!name) return { original: '', normalized: '', changes: [] };

  const original = name;
  const changes: string[] = [];
  let normalized = name.trim();

  // Remove extra whitespace
  if (/\s{2,}/.test(normalized)) {
    normalized = normalized.replace(/\s+/g, ' ');
    changes.push('Removed extra whitespace');
  }

  // Capitalize first letter of each word
  const capitalized = normalized
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word;
      // Handle particles like "van", "de", "von"
      const particles = ['van', 'de', 'von', 'du', 'la', 'le', 'da'];
      if (particles.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  if (capitalized !== normalized) {
    normalized = capitalized;
    changes.push('Standardized capitalization');
  }

  // Remove common titles/suffixes
  const titles = /^(mr\.?|mrs\.?|ms\.?|dr\.?|prof\.?)\s+/i;
  const suffixes = /\s+(jr\.?|sr\.?|ii|iii|iv|phd|md|esq\.?)$/i;

  if (titles.test(normalized)) {
    normalized = normalized.replace(titles, '');
    changes.push('Removed title prefix');
  }

  if (suffixes.test(normalized)) {
    normalized = normalized.replace(suffixes, '');
    changes.push('Removed suffix');
  }

  return { original, normalized: normalized.trim(), changes };
}

/**
 * Normalize a phone number
 */
export function normalizePhone(phone: string): NormalizationResult {
  if (!phone) return { original: '', normalized: '', changes: [] };

  const original = phone;
  const changes: string[] = [];

  // Remove all non-numeric characters except +
  let normalized = phone.replace(/[^\d+]/g, '');

  if (normalized !== phone) {
    changes.push('Removed formatting characters');
  }

  // Ensure + prefix for international
  if (normalized.length > 10 && !normalized.startsWith('+')) {
    normalized = '+' + normalized;
    changes.push('Added international prefix');
  }

  // Format US numbers
  if (normalized.length === 10) {
    normalized = '+1' + normalized;
    changes.push('Added US country code');
  }

  return { original, normalized, changes };
}

/**
 * Normalize an email address
 */
export function normalizeEmail(email: string): NormalizationResult {
  if (!email) return { original: '', normalized: '', changes: [] };

  const original = email;
  const changes: string[] = [];

  let normalized = email.trim().toLowerCase();

  if (normalized !== email) {
    changes.push('Converted to lowercase');
  }

  // Remove dots from Gmail local part (Gmail ignores dots)
  if (normalized.endsWith('@gmail.com')) {
    const [local, domain] = normalized.split('@');
    const cleanLocal = local.replace(/\./g, '').replace(/\+.*$/, '');
    if (cleanLocal !== local) {
      normalized = `${cleanLocal}@${domain}`;
      changes.push('Normalized Gmail address');
    }
  }

  return { original, normalized, changes };
}

/**
 * Normalize an address
 */
export interface AddressComponents {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export function normalizeAddress(address: AddressComponents): {
  original: AddressComponents;
  normalized: AddressComponents;
  changes: string[];
} {
  if (!address) {
    return { original: {}, normalized: {}, changes: [] };
  }

  const original = { ...address };
  const changes: string[] = [];
  const normalized: AddressComponents = {};

  // Normalize street
  if (address.street1) {
    let street = address.street1.trim();

    // Expand common abbreviations
    const abbrevs: Record<string, string> = {
      'St.': 'Street',
      'St': 'Street',
      'Ave.': 'Avenue',
      'Ave': 'Avenue',
      'Blvd.': 'Boulevard',
      'Blvd': 'Boulevard',
      'Rd.': 'Road',
      'Rd': 'Road',
      'Dr.': 'Drive',
      'Dr': 'Drive',
      'Ln.': 'Lane',
      'Ln': 'Lane',
      'Ct.': 'Court',
      'Ct': 'Court',
      'Pl.': 'Place',
      'Pl': 'Place',
      'Apt.': 'Apartment',
      'Apt': 'Apartment',
      'Ste.': 'Suite',
      'Ste': 'Suite',
    };

    for (const [abbr, full] of Object.entries(abbrevs)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      if (regex.test(street)) {
        street = street.replace(regex, full);
        changes.push(`Expanded ${abbr} to ${full}`);
      }
    }

    normalized.street1 = street;
  }

  if (address.street2) {
    normalized.street2 = address.street2.trim();
  }

  // Normalize city
  if (address.city) {
    normalized.city = address.city
      .trim()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    if (normalized.city !== address.city) {
      changes.push('Standardized city capitalization');
    }
  }

  // Normalize state (US states to 2-letter code)
  if (address.state) {
    const stateAbbrevs: Record<string, string> = {
      'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
      'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
      'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
      'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
      'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
      'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
      'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
      'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
      'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
      'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
      'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
      'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
      'wisconsin': 'WI', 'wyoming': 'WY',
    };

    const stateLower = address.state.toLowerCase().trim();
    if (stateAbbrevs[stateLower]) {
      normalized.state = stateAbbrevs[stateLower];
      changes.push('Converted state to abbreviation');
    } else {
      normalized.state = address.state.toUpperCase().trim();
    }
  }

  // Normalize postal code
  if (address.postalCode) {
    let postal = address.postalCode.replace(/\s+/g, '');
    // US ZIP code format
    if (/^\d{9}$/.test(postal)) {
      postal = `${postal.slice(0, 5)}-${postal.slice(5)}`;
      changes.push('Formatted ZIP+4 code');
    }
    normalized.postalCode = postal;
  }

  // Normalize country
  if (address.country) {
    const countryMap: Record<string, string> = {
      'usa': 'US',
      'united states': 'US',
      'united states of america': 'US',
      'uk': 'GB',
      'united kingdom': 'GB',
      'england': 'GB',
    };

    const countryLower = address.country.toLowerCase().trim();
    if (countryMap[countryLower]) {
      normalized.country = countryMap[countryLower];
      changes.push('Standardized country code');
    } else {
      normalized.country = address.country.toUpperCase().trim();
    }
  }

  return { original, normalized, changes };
}

/**
 * Normalize entity name
 */
export function normalizeEntityName(name: string): NormalizationResult {
  if (!name) return { original: '', normalized: '', changes: [] };

  const original = name;
  const changes: string[] = [];
  let normalized = name.trim();

  // Remove extra whitespace
  if (/\s{2,}/.test(normalized)) {
    normalized = normalized.replace(/\s+/g, ' ');
    changes.push('Removed extra whitespace');
  }

  // Standardize legal suffixes
  const suffixMap: Record<string, string> = {
    'llc': 'LLC',
    'l.l.c.': 'LLC',
    'l.l.c': 'LLC',
    'inc': 'Inc.',
    'inc.': 'Inc.',
    'incorporated': 'Inc.',
    'corp': 'Corp.',
    'corp.': 'Corp.',
    'corporation': 'Corp.',
    'ltd': 'Ltd.',
    'ltd.': 'Ltd.',
    'limited': 'Ltd.',
    'lp': 'LP',
    'l.p.': 'LP',
    'limited partnership': 'LP',
    'llp': 'LLP',
    'l.l.p.': 'LLP',
  };

  for (const [variant, standard] of Object.entries(suffixMap)) {
    const regex = new RegExp(`\\b${variant}\\b$`, 'i');
    if (regex.test(normalized)) {
      normalized = normalized.replace(regex, standard);
      if (standard !== variant) {
        changes.push(`Standardized suffix to ${standard}`);
      }
      break;
    }
  }

  return { original, normalized, changes };
}

/**
 * Apply normalization rules to a record
 */
export function normalizeRecord(
  record: Record<string, unknown>,
  recordType: 'people' | 'entities' | 'accounts' | 'assets'
): {
  normalized: Record<string, unknown>;
  changes: Array<{ field: string; changes: string[] }>;
} {
  const chosen = (record.chosenJson || {}) as Record<string, unknown>;
  const normalized = { ...chosen };
  const allChanges: Array<{ field: string; changes: string[] }> = [];

  if (recordType === 'people') {
    // Normalize names
    for (const field of ['firstName', 'lastName', 'middleName']) {
      if (chosen[field]) {
        const result = normalizeName(String(chosen[field]));
        if (result.changes.length > 0) {
          normalized[field] = result.normalized;
          allChanges.push({ field, changes: result.changes });
        }
      }
    }

    // Normalize email
    if (chosen.email) {
      const result = normalizeEmail(String(chosen.email));
      if (result.changes.length > 0) {
        normalized.email = result.normalized;
        allChanges.push({ field: 'email', changes: result.changes });
      }
    }

    // Normalize phone
    if (chosen.phone) {
      const result = normalizePhone(String(chosen.phone));
      if (result.changes.length > 0) {
        normalized.phone = result.normalized;
        allChanges.push({ field: 'phone', changes: result.changes });
      }
    }

    // Normalize address
    if (chosen.address && typeof chosen.address === 'object') {
      const result = normalizeAddress(chosen.address as AddressComponents);
      if (result.changes.length > 0) {
        normalized.address = result.normalized;
        allChanges.push({ field: 'address', changes: result.changes });
      }
    }
  }

  if (recordType === 'entities') {
    // Normalize entity name
    if (chosen.legalName) {
      const result = normalizeEntityName(String(chosen.legalName));
      if (result.changes.length > 0) {
        normalized.legalName = result.normalized;
        allChanges.push({ field: 'legalName', changes: result.changes });
      }
    }
  }

  return { normalized, changes: allChanges };
}
