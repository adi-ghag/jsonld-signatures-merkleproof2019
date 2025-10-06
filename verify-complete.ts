import { LDMerkleProof2019 } from './src/index.js';
import { createCachedDocumentLoader } from './src/helpers/contextCache.js';

/**
 * Complete end-to-end verification function for MerkleProof2019 credentials
 * Supports both Bloxberg and Arbitrum Sepolia credentials
 * Production-ready function with no console logging
 */
async function verifyMerkleProof2019Credential(credential: any): Promise<boolean> {
  try {
    // Create verifier instance
    const verifier = new LDMerkleProof2019({
      document: credential
    });

    // Suppress all console output during verification
    const originalLog = console.log;
    const originalError = console.error;
    console.log = () => {};
    console.error = () => {};

    // Perform verification
    const result = await verifier.verifyProof({
      verifyIdentity: true,
      documentLoader: createCachedDocumentLoader()
    });

    // Restore console
    console.log = originalLog;
    console.error = originalError;

    return result.verified;

  } catch (error: any) {
    return false;
  }
}

// Example Bloxberg credential
const bloxbergCredential = {
  "id": "https://bloxberg.org",
  "type": ["VerifiableCredential", "BloxbergCredential"],
  "issuer": "https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json",
  "issuanceDate": "2025-09-15T22:29:38.985566+00:00",
  "credentialSubject": {
    "id": "https://blockexplorer.bloxberg.org/address/0x9858eC18a269EE69ebfD7C38eb297996827DDa98",
    "issuingOrg": {
      "id": "https://bloxberg.org"
    }
  },
  "displayHtml": null,
  "crid": "17bf4b46701313ea8fbaf838c24b8647d39bff0a9d2b45f403cb72ba420bd4bd",
  "cridType": "sha2-256",
  "metadataJson": "{\"authorName\": \"\", \"researchTitle\": \"\", \"email\": \"\"}",
  "proof": {
    "type": "MerkleProof2019",
    "created": "2025-09-15T22:29:45.571212",
    "proofValue": "z7veGu1qoKR3AS5B9H9tKeQTuEYqJExJ4CvW81QWz2RV6UaoKEYQsjM8DszzV8TXhRxfLimqeFo9HnkYF512PZjSYZo75ViibJixnZ99Y9BXcKHbKp9y5CjsV8rjRZEaFBu4GEYUoNMCST4eXHABDC7tbhHZmcK5JTN69hK6KXmJPzdUWMywFA8nUHuFPQZzJWb8LocZ4VFJM9HibnxyVKp584tFi7wRg9EKceUeVuDfEfqNtjAoAQKvZCjMzTeQyj5vm3mM6AUeB8uf5vdKZyfsdDaXwJr7rCrh4A612orm4SykNYqR3L",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "ecdsa-koblitz-pubkey:0xD748BF41264b906093460923169643f45BDbC32e",
    "ens_name": "mpdl.berg"
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/bloxberg/schema/research_object_certificate_v1"
  ]
};

// Example Arbitrum Sepolia credential
const arbitrumCredential = {
  "id": "https://bloxberg.org",
  "type": ["VerifiableCredential", "BloxbergCredential"],
  "issuer": "https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json",
  "issuanceDate": "2025-09-30T09:23:36.173783+00:00",
  "credentialSubject": {
    "id": "https://sepolia.arbiscan.io/address/0x9858eC18a269EE69ebfD7C38eb297996827DDa98",
    "issuingOrg": {
      "id": "https://bloxberg.org"
    }
  },
  "displayHtml": null,
  "crid": "17bf4b46701313ea8fbaf838c24b8647d39bff0a9d2b45f403cb72ba420bd4bd",
  "cridType": "sha2-256",
  "metadataJson": "{\"authorName\": \"\", \"researchTitle\": \"\", \"email\": \"\"}",
  "proof": {
    "type": "MerkleProof2019",
    "created": "2025-09-30T09:23:38.408863",
    "proofValue": "znKD4YGVqA8textuxDbawf7zad8AHzHu8K3wA4mTFfde5cbtypC6AgP2QXu3CfiGbnfP1Q1V7NoDyP8C7t4VGwzzqCH9EBnMx8ywHjfxRKHgDAQacG6DbiRSw61Fvh4tXfmD7bRwvXQ9qQJyZWFLHmnmnBpEDnRnkZogGHWbEPuz6MiKqk8pSHSqRZxRQagD5wgX3Snz6uEQP1JHuJAECugZHKsVrxHpAcwSB5LLZUjwvGhLKT57QiaX9ksjaFmVBbZKqEkq48rKvJdXt5QWyirH2ZCARboTVU5m2vyQHUVGL26kfkqXnunHtJV",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "ecdsa-koblitz-pubkey:0x18a47Fd59848a98Df3C9E9792337F9943e0f1b0b",
    "ens_name": "mpdl.berg"
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/bloxberg/schema/research_object_certificate_v1"
  ]
};

// Run verification
(async () => {
  console.log('Verifying Bloxberg credential...');
  const bloxbergResult = await verifyMerkleProof2019Credential(bloxbergCredential);
  console.log(`Bloxberg: ${bloxbergResult ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\nVerifying Arbitrum Sepolia credential...');
  const arbitrumResult = await verifyMerkleProof2019Credential(arbitrumCredential);
  console.log(`Arbitrum Sepolia: ${arbitrumResult ? '✅ PASS' : '❌ FAIL'}`);
})();
