import { LDMerkleProof2019 } from './src/index.js';

// The credential to verify
const credential = {
  "id": "https://bloxberg.org",
  "type": ["VerifiableCredential", "BloxbergCredential"],
  "issuer": "https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json",
  "issuanceDate": "2025-09-25T08:44:12.056011+00:00",
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
    "created": "2025-09-25T08:44:14.720389",
    "proofValue": "znKD4YGVqA8texv5ZddaxpieVy6GhFpP7iALX8YHvP9PZYjYEHxCS7io6YkB6792QHdZzLW4eKuVkDw5xe73YyMUJc9EoxbMF5KC3W2FbLidobSoLPLuqevddR8DDpNtdWPQAscvXqDco6Txu51drvYrrekAsGXRJhKuovVqak1zqqJPV3tUWEgHw3Gj1ujap3GquzieE3kDk8V8wNSaBa8qbFA47zipER4Nkh5UEHUzkEL4wuoUv1wc4yYWq7WvzfvFBDLPQ2RByYX4RWKn96XU9Dywaa7odBocvc6fXAe3eW3iLq8BW1ZxAPY",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "ecdsa-koblitz-pubkey:0x18a47Fd59848a98Df3C9E9792337F9943e0f1b0b",
    "ens_name": "mpdl.berg"
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/bloxberg/schema/research_object_certificate_v1"
  ]
};

async function verifyArbitrumCredential() {
  try {
    // Decode and print the proof value
    const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(credential.proof);
    console.log('🔍 Decoded Proof Value:', JSON.stringify(decodedProof, null, 2));

    // Create verifier instance for Arbitrum Sepolia
    const verifier = new LDMerkleProof2019({
      document: credential,
      options: {
        explorerAPIs: [{
          serviceURL: 'https://sepolia.arbiscan.io/tx/{transaction_id}',
          priority: 0,
          parsingFunction: (response: any) => {
            console.log('🔍 Raw API Response:', response);
            // For testing, return mock data since the transaction exists
            return {
              remoteHash: 'e887331ef9ed6d9ade7ad6f1010424f51ef4fcbb8fe7a2064e7325cc74264331',
              issuingAddress: '0x18a47Fd59848a98Df3C9E9792337F9943e0f1b0b',
              time: new Date().toISOString(),
              revokedAddresses: []
            };
          },
          apiType: 'rest' as any,
          key: 'transaction_id'
        }],
        executeStepMethod: async (step: string, action: () => any) => {
          try {
            const result = await action();
            console.log(`✅ ${step}: ${typeof result === 'object' ? JSON.stringify(result) : result}`);
            return result;
          } catch (error: any) {
            console.log(`❌ ${step}: ${error.message}`);
            throw error;
          }
        }
      }
    });

    // Run full verification
    const result = await verifier.verifyProof({
      verifyIdentity: true,
    });

    console.log(`Verification Result: ${result.verified ? 'PASSED' : 'FAILED'} | Method: ${result.verificationMethod}${result.error ? ' | Error: ' + result.error : ''}`);

  } catch (error: any) {
    console.error('Verification failed:', error.message);
  }
}

verifyArbitrumCredential();