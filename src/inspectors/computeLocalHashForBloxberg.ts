import jsonld from 'jsonld';
import sha256 from 'sha256';
import { toUTF8Data } from '../utils/data.js';
import { isObject } from '../utils/object.js';
import VerifierError from '../models/VerifierError.js';
import getText from '../helpers/getText.js';

export function getUnmappedFields (normalized: string): string[] | null {
  const normalizedArray = normalized.split('\n');
  const myRegexp = /<http:\/\/fallback\.org\/(.*)>/;
  const matches = normalizedArray
    .map(normalizedString => myRegexp.exec(normalizedString))
    .filter(match => match != null);
  if (matches.length > 0) {
    const unmappedFields = matches.map(match => match[1]).sort(); // only return name of unmapped key
    return Array.from(new Set(unmappedFields)); // dedup
  }
  return null;
}

export default async function computeLocalHashForBloxberg (
  document: any,
  targetProof = null
): Promise<string> { // TODO: define VC type
  // the previous implementation was using a reference of @context, thus always adding @vocab to @context,
  // thus passing the information down to jsonld regardless of the configuration option. We explicitly do that now,
  // since we want to make sure unmapped fields are detected.
  let theDocument = JSON.parse(JSON.stringify(document));

  if (!theDocument['@context'].find((context: any) => isObject(context) && '@vocab' in context)) {
    theDocument['@context'].push({ '@vocab': 'http://fallback.org/' });
  }

  theDocument = JSON.parse(JSON.stringify(document));

  if (!Array.isArray(theDocument.proof)) {
    // compute the document as it was signed, so without proof
    delete theDocument.proof;
  } else {
    if (!targetProof) {
      throw new VerifierError(
        'computeLocalHashForBloxberg',
        getText('errors', 'noProofSpecified')
      );
    }
    const proofIndex = theDocument.proof.findIndex(proof => proof.proofValue === targetProof.proofValue);
    theDocument.proof = theDocument.proof.slice(0, proofIndex);
  }
  
  const normalizeArgs: any = {
    algorithm: 'URDNA2015',
    format: 'application/nquads',
    safe: false,
    expandContext: theDocument['@context']
  };

  let normalizedDocument: string;

  try {
    normalizedDocument = await (jsonld as any).normalize(theDocument, normalizeArgs);
  } catch (e: any) {
    console.error(e);
    throw new VerifierError('computeLocalHashForBloxberg', getText('errors', 'failedJsonLdNormalization'));
  }

  const unmappedFields: string[] = getUnmappedFields(normalizedDocument);
  if (unmappedFields) {
    throw new VerifierError(
      'computeLocalHashForBloxberg',
      `${getText('errors', 'foundUnmappedFields')}: ${unmappedFields.join(', ')}`
    );
  } else {
    return sha256(toUTF8Data(normalizedDocument));
  }
}
