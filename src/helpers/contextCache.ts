/**
 * Context Cache Module
 *
 * Provides cached JSON-LD contexts to avoid network requests and handle
 * unreliable redirect chains (e.g., w3id.org/bloxberg)
 */

import jsonld from 'jsonld';

// W3C Verifiable Credentials context v1
const W3C_CREDENTIALS_V1_CONTEXT = {
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "id": "@id",
    "type": "@type",
    "VerifiableCredential": {
      "@id": "https://www.w3.org/2018/credentials#VerifiableCredential",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "cred": "https://www.w3.org/2018/credentials#",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "credentialSchema": {
          "@id": "cred:credentialSchema",
          "@type": "@id",
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "cred": "https://www.w3.org/2018/credentials#",
            "JsonSchemaValidator2018": "cred:JsonSchemaValidator2018"
          }
        },
        "credentialStatus": {"@id": "cred:credentialStatus", "@type": "@id"},
        "credentialSubject": {"@id": "cred:credentialSubject", "@type": "@id"},
        "evidence": {"@id": "cred:evidence", "@type": "@id"},
        "expirationDate": {"@id": "cred:expirationDate", "@type": "xsd:dateTime"},
        "holder": {"@id": "cred:holder", "@type": "@id"},
        "issued": {"@id": "cred:issued", "@type": "xsd:dateTime"},
        "issuer": {"@id": "cred:issuer", "@type": "@id"},
        "issuanceDate": {"@id": "cred:issuanceDate", "@type": "xsd:dateTime"},
        "proof": {"@id": "sec:proof", "@type": "@id", "@container": "@graph"},
        "refreshService": {
          "@id": "cred:refreshService",
          "@type": "@id",
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "cred": "https://www.w3.org/2018/credentials#",
            "ManualRefreshService2018": "cred:ManualRefreshService2018"
          }
        },
        "termsOfUse": {"@id": "cred:termsOfUse", "@type": "@id"},
        "validFrom": {"@id": "cred:validFrom", "@type": "xsd:dateTime"},
        "validUntil": {"@id": "cred:validUntil", "@type": "xsd:dateTime"}
      }
    },
    "VerifiablePresentation": {
      "@id": "https://www.w3.org/2018/credentials#VerifiablePresentation",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "cred": "https://www.w3.org/2018/credentials#",
        "sec": "https://w3id.org/security#",
        "holder": {"@id": "cred:holder", "@type": "@id"},
        "proof": {"@id": "sec:proof", "@type": "@id", "@container": "@graph"},
        "verifiableCredential": {"@id": "cred:verifiableCredential", "@type": "@id", "@container": "@graph"}
      }
    },
    "EcdsaSecp256k1Signature2019": {
      "@id": "https://w3id.org/security#EcdsaSecp256k1Signature2019",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "sec": "https://w3id.org/security#",
            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },
    "EcdsaSecp256r1Signature2019": {
      "@id": "https://w3id.org/security#EcdsaSecp256r1Signature2019",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "sec": "https://w3id.org/security#",
            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },
    "Ed25519Signature2018": {
      "@id": "https://w3id.org/security#Ed25519Signature2018",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "sec": "https://w3id.org/security#",
            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },
    "RsaSignature2018": {
      "@id": "https://w3id.org/security#RsaSignature2018",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "sec": "https://w3id.org/security#",
            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },
    "proof": {"@id": "https://w3id.org/security#proof", "@type": "@id", "@container": "@graph"}
  }
};

// Bloxberg context - fetched from https://tools.bloxberg.org/research_object_certificate_v1
const BLOXBERG_CONTEXT = {
  "@context": {
    "id": "@id",
    "type": "@type",
    "bl": "https://w3id.org/bloxberg#",
    "schema": "http://schema.org/",
    "sec": "https://w3id.org/security#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "MerkleProof2019": "sec:MerkleProof2019",
    "BloxbergCredential": "bl:BloxbergCredential",
    "introductionUrl": {"@id": "bl:introductionUrl", "@type": "@id"},
    "CryptographicKey": "sec:Key",
    "Digest": "sec:Digest",
    "cridType": "sec:digestAlgorithm",
    "crid": "sec:digestValue",
    "domain": "sec:domain",
    "nonce": "sec:nonce",
    "proofValue": "sec:proofValue",
    "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
    "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"},
    "proofPurpose": {"@id": "sec:proofPurpose", "@type": "@vocab"},
    "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"},
    "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
    "challenge": "sec:challenge",
    "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
    "name": {"@id": "schema:name"}
  }
};

// Context cache - maps URLs to their contexts
const contextCache = new Map<string, any>([
  // W3C Credentials context
  ['https://www.w3.org/2018/credentials/v1', W3C_CREDENTIALS_V1_CONTEXT],
  // Bloxberg URLs (all redirect to same context)
  ['https://w3id.org/bloxberg/schema/research_object_certificate_v1', BLOXBERG_CONTEXT],
  ['https://certify.bloxberg.org/research_object_certificate_v1', BLOXBERG_CONTEXT],
  ['https://tools.bloxberg.org/research_object_certificate_v1', BLOXBERG_CONTEXT]
]);

/**
 * Creates a document loader that checks the cache before making network requests
 *
 * @returns Document loader function compatible with jsonld.js
 */
export function createCachedDocumentLoader(): (url: string) => Promise<any> {
  const nodeLoader = jsonld.documentLoaders.node();

  return async (url: string) => {
    // Check cache first
    if (contextCache.has(url)) {
      return {
        contextUrl: null,
        document: contextCache.get(url),
        documentUrl: url
      };
    }

    // Fall back to default loader for uncached URLs
    return nodeLoader(url);
  };
}

/**
 * Add a context to the cache
 *
 * @param url - The URL to cache
 * @param context - The context document
 */
export function addContextToCache(url: string, context: any): void {
  contextCache.set(url, context);
}

/**
 * Remove a context from the cache
 *
 * @param url - The URL to remove
 */
export function removeContextFromCache(url: string): void {
  contextCache.delete(url);
}

/**
 * Clear all cached contexts
 */
export function clearContextCache(): void {
  // Keep essential contexts
  const essentialContexts: Array<[string, any]> = [
    ['https://www.w3.org/2018/credentials/v1', W3C_CREDENTIALS_V1_CONTEXT],
    ['https://w3id.org/bloxberg/schema/research_object_certificate_v1', BLOXBERG_CONTEXT],
    ['https://certify.bloxberg.org/research_object_certificate_v1', BLOXBERG_CONTEXT],
    ['https://tools.bloxberg.org/research_object_certificate_v1', BLOXBERG_CONTEXT]
  ];

  contextCache.clear();
  essentialContexts.forEach(([url, context]) => contextCache.set(url, context));
}

/**
 * Get the cache size
 */
export function getContextCacheSize(): number {
  return contextCache.size;
}

/**
 * Check if a URL is cached
 */
export function isContextCached(url: string): boolean {
  return contextCache.has(url);
}
