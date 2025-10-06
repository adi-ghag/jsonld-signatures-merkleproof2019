import { LDMerkleProof2019 } from './src/index.js';
import { createCachedDocumentLoader } from './src/helpers/contextCache.js';

// The credential to verify
const credential = {
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

async function verifyCredential() {
  try {
    console.log('🔍 Verifying Bloxberg credential...\n');

    // Create verifier instance - uses default Bloxberg explorer (Blockscout)
    const verifier = new LDMerkleProof2019({
      document: credential
    });

    // Decode the proof to examine its contents
    const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(credential.proof);

    console.log('📋 Credential Overview:');
    console.log(`- Type: ${credential.type.join(', ')}`);
    console.log(`- Issuer: ${credential.issuer}`);
    console.log(`- Issuance Date: ${credential.issuanceDate}`);
    console.log(`- CRID: ${credential.crid}`);
    console.log(`- Subject ID: ${credential.credentialSubject.id}`);
    console.log();

    console.log('🔐 Proof Details:');
    console.log(`- Type: ${credential.proof.type}`);
    console.log(`- Created: ${credential.proof.created}`);
    console.log(`- Verification Method: ${credential.proof.verificationMethod}`);
    console.log(`- ENS Name: ${credential.proof.ens_name}`);
    console.log();

    console.log('🌳 Decoded Merkle Proof:');
    console.log(`- Target Hash: ${decodedProof.targetHash}`);
    console.log(`- Merkle Root: ${decodedProof.merkleRoot}`);
    console.log(`- Anchors: ${decodedProof.anchors.join(', ')}`);
    console.log(`- Path Length: ${decodedProof.path?.length || 0}`);
    console.log();

    // Identify blockchain
    const chain = verifier.getChain();
    console.log('⛓️ Blockchain Information:');
    console.log(`- Chain: ${chain.name} (${chain.code})`);
    console.log(`- Blink Code: ${chain.blinkCode}`);
    console.log();

    // Get verification processes
    const proofSteps = verifier.getProofVerificationProcess();
    const identitySteps = verifier.getIdentityVerificationProcess();

    console.log('🔄 Verification Process Steps:');
    console.log('Proof Verification:', proofSteps.join(' → '));
    console.log('Identity Verification:', identitySteps.join(' → '));
    console.log();

    // Attempt verification
    console.log('✅ Attempting full verification...');

    // Temporarily suppress error logs from failed explorer attempts
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      // Filter out JSON error messages from failed explorer requests
      const message = args[0];
      if (typeof message === 'string' && message.includes('"error"') && message.includes('Transaction')) {
        return; // Skip this log
      }
      originalLog.apply(console, args);
    };

    const result = await verifier.verifyProof({
      verifyIdentity: true,
      documentLoader: createCachedDocumentLoader()
    });

    // Restore original console.log
    console.log = originalLog;

    console.log('\n📊 Verification Result:');
    console.log(`- Verified: ${result.verified}`);
    console.log(`- Verification Method: ${result.verificationMethod}`);

    if (result.error) {
      console.log(`- Error: ${result.error}`);
    }

    if (result.verified) {
      console.log('\n🎉 Credential is VALID!');
    } else {
      console.log('\n❌ Credential verification FAILED');
      if (result.error) {
        console.log(`Reason: ${result.error}`);
      }
    }

  } catch (error: any) {
    console.error('💥 Verification failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

verifyCredential();