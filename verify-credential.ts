import { LDMerkleProof2019 } from './src/index.js';

// The credential to verify
const credential = {
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

async function verifyCredential() {
  try {
    console.log('🔍 Verifying Bloxberg credential...\n');

    // Create verifier instance with working bloxberg explorer
    const verifier = new LDMerkleProof2019({
      document: credential,
      options: {
        explorerAPIs: [{
          serviceURL: 'https://blockexplorer.bloxberg.org/api?module=transaction&action=gettxinfo',
          priority: 0,
          parsingFunction: (response: any) => {
            console.log('🔍 Custom explorer response:', JSON.stringify(response, null, 2));
            if (response && response.status === '1' && response.result) {
              const tx = response.result;
              return {
                remoteHash: tx.input ? tx.input.slice(-64) : null,
                issuingAddress: tx.from,
                time: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                revokedAddresses: []
              };
            }
            throw new Error(`Transaction not found: ${response?.message || 'Unknown error'}`);
          },
          apiType: 'rest' as any,
          key: 'txhash'
        }]
      }
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
    const result = await verifier.verifyProof({
      verifyIdentity: true,
      documentLoader: () => null
    });

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

  } catch (error) {
    console.error('💥 Verification failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

verifyCredential();