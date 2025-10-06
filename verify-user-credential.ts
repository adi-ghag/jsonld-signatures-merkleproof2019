import { LDMerkleProof2019 } from './src/index.js';
import { createCachedDocumentLoader } from './src/helpers/contextCache.js';
import * as fs from 'fs';

async function verifyCredential(credentialPath: string): Promise<void> {
  try {
    // Read credential from file
    const credential = JSON.parse(fs.readFileSync(credentialPath, 'utf-8'));

    console.log('Verifying credential from:', credentialPath);
    console.log('Chain:', credential.credentialSubject.id.includes('arbiscan') ? 'Arbitrum Sepolia' : 'Bloxberg');
    console.log('Verification Method:', credential.proof.verificationMethod);
    console.log('Created:', credential.proof.created);
    console.log();

    // Create verifier instance
    const verifier = new LDMerkleProof2019({
      document: credential
    });

    // Perform verification
    const result = await verifier.verifyProof({
      verifyIdentity: true,
      documentLoader: createCachedDocumentLoader()
    });

    console.log('Verification Result:', result.verified ? '✅ PASS' : '❌ FAIL');

    if (result.verified) {
      console.log('\n✓ Credential is valid');
      console.log('✓ Merkle proof verified');
      console.log('✓ Blockchain anchor confirmed');
    } else {
      console.log('\n✗ Verification failed');
      if (result.error) {
        console.log('Error:', result.error);
      }
    }

  } catch (error: any) {
    console.error('Verification error:', error.message);
    process.exit(1);
  }
}

// Run verification on user's credential
verifyCredential('./test-bloxberg-credential.json');
