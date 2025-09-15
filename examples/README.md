# Examples

This directory contains example scripts for testing and using the MerkleProof2019 signature suite.

## Available Examples

### 1. Bloxberg Certificate Verification (`test-bloxberg-certificate.ts`)

A comprehensive example for testing Bloxberg certificate verification.

**Usage:**

```bash
# Test with the built-in example certificate
npm run verify:bloxberg

# Or test with your own certificate file
npx tsx examples/test-bloxberg-certificate.ts path/to/your/certificate.json
```

**Features:**
- ✅ Complete certificate structure validation
- ✅ Proof decoding and analysis
- ✅ Blockchain detection (supports Bloxberg)
- ✅ Transaction information extraction
- ✅ Detailed verification reporting
- ✅ Color-coded output for easy reading

**Example Output:**
```
🔍 Testing Bloxberg Certificate

1. Validating certificate structure...
   ✅ Valid BloxbergCredential structure

2. Creating verifier and decoding proof...
   📄 Certificate Details:
      • ID: https://bloxberg.org
      • Issuer: https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json
      • Issuance Date: 2025-08-26T11:33:07.233557+00:00
      • CRID: 17bf4b46701313ea8fbaf838c24b8647d39bff0a9d2b45f403cb72ba420bd4bd

📋 VALIDATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Certificate Structure
✅ Proof Decoding
✅ Blockchain Detection
✅ Transaction Extraction
❌ Full Verification

Score: 4/5 checks passed
✅ Certificate is valid and properly structured for Bloxberg!
```

## Adding Your Own Examples

To create a new example:

1. Create a new TypeScript file in this directory
2. Import the library: `import { LDMerkleProof2019 } from '../src/index.js';`
3. Add your example logic
4. Optionally add a corresponding npm script in `package.json`

## Common Use Cases

### Basic Certificate Validation
```typescript
import { LDMerkleProof2019 } from '../src/index.js';

const certificate = { /* your certificate JSON */ };
const verifier = new LDMerkleProof2019({ document: certificate });
const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(certificate.proof);
console.log('Decoded proof:', decodedProof);
```

### Chain Detection
```typescript
const chain = verifier.getChain();
console.log('Blockchain:', chain?.name);
```

### Custom Verification with Explorer API
```typescript
const result = await verifier.verifyProof({
  verifyIdentity: false,
  documentLoader: async (url) => {
    // Your custom document loader
    return { document: contextDefinition };
  }
});
```

## Notes

- Examples may show expected failures on hash comparison - this is normal without proper context resolution
- For production use, implement proper JSON-LD context loading
- All examples are written in TypeScript and use TSX for execution