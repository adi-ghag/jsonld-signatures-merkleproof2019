import { LDMerkleProof2019 } from './lib/cjs/index.js';
import getTransactionId from './lib/cjs/helpers/getTransactionId.js';

// The provided Arbitrum credential proof
const proof = {
  type: "MerkleProof2019",
  created: "2025-09-15T15:52:28.807020",
  proofValue: "znKD4YGVqA8textphDoFQ3He5RpJdaQJjS1BY9wERPpiY3NDzNgBX8PN9u1dfT8FSfz9BQ1D1tzmNUB9g6693qT9qw2XHKCrNASnmggd3FM5DTjWf3CoSRRMLri2PXEkXbLMb3599ktXyU663srNmQhxJXQtV2dMSjiRALet94KQTDFKf5TDQc1Z17t5PDC8mCA9P5fgRnw2xeHq7fxzjnbLHhEb1ztc2j8KAFGRnjESzw7RXYenisWMAkKKX2yNtjgYg8F6k66Hct7cmJjsxrygKLSzKQKyBknobRXjpJ2dE4RPKts1788G6po",
  proofPurpose: "assertionMethod",
  verificationMethod: "ecdsa-koblitz-pubkey:0x18a47Fd59848a98Df3C9E9792337F9943e0f1b0b",
  ens_name: "mpdl.berg"
};

/* eslint-disable no-undef */
console.log('Testing transaction ID extraction from Arbitrum proof...');

try {
  // Decode the proof
  const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(proof);
  console.log('Decoded proof:', JSON.stringify(decodedProof, null, 2));

  // Extract transaction ID
  const transactionId = getTransactionId(decodedProof);
  console.log('\nExtracted transaction ID:', transactionId);

  // The expected transaction ID from the anchor
  const expectedTxId = '0x9d9eb0a55e702eb18b8aa390480ea212ad34b486ef592c9e5c390481559fc8e0';
  console.log('Expected transaction ID:', expectedTxId);

  if (transactionId === expectedTxId) {
    console.log('✅ SUCCESS: Transaction ID extraction works correctly!');
  } else {
    console.log('❌ MISMATCH: Transaction IDs do not match');
  }

  // Test the chain detection as well
  const suite = new LDMerkleProof2019({
    proof: proof
  });

  console.log('\nChain information:', suite.getChain());

} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}
/* eslint-enable no-undef */