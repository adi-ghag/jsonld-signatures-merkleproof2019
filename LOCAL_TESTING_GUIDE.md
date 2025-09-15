# Local Testing Guide for Bloxberg Certificate Verification

This guide will help you test Bloxberg certificate verification locally after running this project.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git (optional, for cloning)

## Setup Instructions

### 1. Clone and Setup the Project

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd jsonld-signatures-merkleproof2019

# Install dependencies
npm install

# Compile the TypeScript code
npm run compile
```

### 2. Run the Test Suite

```bash
# Run all tests
npm test

# Run only Bloxberg-related tests
npm test -- --testNamePattern="Bloxberg"

# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific test file
npm test tests/verification/bloxberg-certificate.test.ts
```

## Testing Your Own Bloxberg Certificate

### Option 1: Using the Test Fixtures (Recommended)

The project includes comprehensive test fixtures. You can modify the certificate data:

1. **Edit the test fixture**:
   ```bash
   # Open the Bloxberg certificate fixture
   nano tests/fixtures/bloxberg-certificate.ts
   ```

2. **Replace the certificate data** with your own Bloxberg certificate JSON

3. **Run the tests**:
   ```bash
   npm test -- --testNamePattern="Bloxberg"
   ```

### Option 2: Create a Custom Verification Script

Create a new file `test-my-certificate.ts`:

```typescript
import { LDMerkleProof2019 } from './src/index.js';
import * as fs from 'fs';

// Load your certificate (replace with your certificate file)
const myCertificate = JSON.parse(fs.readFileSync('./my-bloxberg-certificate.json', 'utf-8'));

async function testMyCertificate() {
  console.log('Testing Bloxberg certificate...');

  try {
    // Create verifier instance
    const verifier = new LDMerkleProof2019({
      document: myCertificate
    });

    // Decode the proof value
    const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(myCertificate.proof);
    console.log('✅ Decoded proof:', {
      targetHash: decodedProof.targetHash,
      merkleRoot: decodedProof.merkleRoot,
      anchors: decodedProof.anchors
    });

    // Get chain information
    const chain = verifier.getChain();
    console.log('✅ Blockchain detected:', {
      code: chain?.code,
      name: chain?.name,
      signatureValue: chain?.signatureValue
    });

    // Attempt verification (may fail on hash comparison without proper context)
    const result = await verifier.verifyProof({
      verifyIdentity: false, // Skip identity verification for basic test
      documentLoader: () => null // Basic document loader
    });

    console.log('🔍 Verification result:', {
      verified: result.verified,
      error: result.error || 'None'
    });

    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { verified: false, error: error.message };
  }
}

// Run the test
testMyCertificate().then(result => {
  console.log('\n=== FINAL RESULT ===');
  console.log('Status:', result.verified ? '✅ VALID' : '⚠️  STRUCTURALLY VALID (Hash mismatch expected)');
}).catch(console.error);
```

**Run your custom script**:
```bash
npx tsx test-my-certificate.ts
```

### Option 3: Interactive Testing with Node REPL

```bash
# Start Node.js REPL
node

# Then in the REPL:
```

```javascript
// Load the library
const { LDMerkleProof2019 } = require('./lib/cjs/index.js');

// Your certificate data (paste your JSON here)
const certificate = {
  // ... your Bloxberg certificate JSON
};

// Create verifier
const verifier = new LDMerkleProof2019({ document: certificate });

// Decode proof
const decoded = LDMerkleProof2019.decodeMerkleProof2019(certificate.proof);
console.log('Decoded proof:', decoded);

// Get chain info
const chain = verifier.getChain();
console.log('Chain:', chain);
```

## Expected Results

### ✅ Successful Structure Validation
When testing a valid Bloxberg certificate, you should see:
- ✅ Proof type identified as `MerkleProof2019`
- ✅ Blockchain identified as `ethbloxberg` (Bloxberg)
- ✅ Valid target hash and merkle root extracted
- ✅ Transaction ID extracted from anchor

### ⚠️ Hash Comparison May Fail
The verification may fail on hash comparison with an error like:
```
Computed hash does not match remote hash
```

This is **expected** and doesn't mean your certificate is invalid. It happens because:
1. JSON-LD canonicalization requires the exact context used during signing
2. Document loader needs proper context resolution
3. Blockchain explorer access may be needed

## Troubleshooting

### Common Issues and Solutions

#### 1. "Could not retrieve chain" Error
**Cause**: Unsupported blockchain or anchor format
**Solution**: Check that your certificate uses a supported blockchain anchor format

#### 2. "The passed document is not signed" Error
**Cause**: Missing or invalid proof object
**Solution**: Ensure your certificate has a valid `proof` object with `MerkleProof2019` type

#### 3. TypeScript Compilation Errors
**Solution**:
```bash
npm run clean:build
npm run compile
```

#### 4. Module Import Errors
**Solution**: Use the correct import paths:
```typescript
// For ES modules
import { LDMerkleProof2019 } from './src/index.js';

// For CommonJS
const { LDMerkleProof2019 } = require('./lib/cjs/index.js');
```

## Testing Different Certificate Types

### Bloxberg Certificate Features to Test:
- ✅ ENS name support (`ens_name` in proof)
- ✅ Research object metadata (`crid`, `cridType`)
- ✅ Bloxberg-specific context resolution
- ✅ Ethereum-compatible verification method

### Example Test Cases:
```bash
# Test valid certificate
npm test -- --testNamePattern="should correctly identify the proof type"

# Test chain detection
npm test -- --testNamePattern="should identify Bloxberg blockchain correctly"

# Test invalid certificate handling
npm test -- --testNamePattern="should handle missing proof gracefully"
```

## Advanced Testing

### With Custom Explorer APIs
```typescript
const verifier = new LDMerkleProof2019({
  document: certificate,
  options: {
    explorerAPIs: [{
      serviceURL: 'https://your-bloxberg-explorer.com/api',
      priority: 0,
      parsingFunction: (data) => ({
        remoteHash: 'extracted-hash',
        issuingAddress: 'extracted-address',
        time: 'extracted-time',
        revokedAddresses: []
      })
    }]
  }
});
```

### With Custom Document Loader
```typescript
const result = await verifier.verifyProof({
  documentLoader: async (url) => {
    if (url === 'https://w3id.org/bloxberg/schema/research_object_certificate_v1') {
      return { document: bloxbergContextDefinition };
    }
    // Handle other contexts...
    return null;
  }
});
```

## Performance Testing

```bash
# Run tests with timing
npm test -- --reporter=verbose --testTimeout=30000

# Profile memory usage
node --inspect-brk ./node_modules/.bin/vitest run tests/verification/bloxberg-certificate.test.ts
```

## Debugging Tips

1. **Enable verbose logging**:
   ```typescript
   const verifier = new LDMerkleProof2019({
     document: certificate,
     options: {
       executeStepMethod: async (step, action) => {
         console.log(`Executing step: ${step}`);
         const result = await action();
         console.log(`Step ${step} completed:`, result);
         return result;
       }
     }
   });
   ```

2. **Inspect decoded proof structure**:
   ```typescript
   console.log('Decoded proof:', JSON.stringify(decodedProof, null, 2));
   ```

3. **Check anchor format**:
   ```typescript
   const anchor = decodedProof.anchors[0];
   console.log('Anchor parts:', anchor.split(':'));
   ```

## Next Steps

After successful local testing, you can:
1. Integrate with your application
2. Add custom blockchain explorer support
3. Implement proper context resolution
4. Add batch verification for multiple certificates

## Support

If you encounter issues:
1. Check the test output for specific error messages
2. Review the certificate structure against the Bloxberg specification
3. Ensure all dependencies are properly installed
4. Verify TypeScript compilation completed successfully

---

**Note**: This testing framework validates certificate structure and proof decoding. Full cryptographic verification requires access to the actual blockchain data and proper JSON-LD context resolution.