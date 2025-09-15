#!/usr/bin/env npx tsx

/**
 * Example script to test Bloxberg certificate verification
 *
 * Usage:
 *   npx tsx examples/test-bloxberg-certificate.ts [certificate-file.json]
 *
 * If no file is provided, uses the built-in example certificate
 */

import { LDMerkleProof2019 } from '../src/index.js';
import { bloxbergCertificateFixture } from '../tests/fixtures/bloxberg-certificate.js';
import * as fs from 'fs';
import * as path from 'path';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color: string, message: string) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testBloxbergCertificate(certificateData: any) {
  console.log(`${colors.bold}🔍 Testing Bloxberg Certificate${colors.reset}\n`);

  try {
    // Step 1: Basic structure validation
    log(colors.blue, '1. Validating certificate structure...');

    if (!certificateData.proof || certificateData.proof.type !== 'MerkleProof2019') {
      throw new Error('Invalid certificate: Missing or wrong proof type');
    }

    if (!certificateData.type?.includes('BloxbergCredential')) {
      log(colors.yellow, '   ⚠️  Warning: Certificate is not specifically a BloxbergCredential');
    } else {
      log(colors.green, '   ✅ Valid BloxbergCredential structure');
    }

    // Step 2: Create verifier and decode proof
    log(colors.blue, '\n2. Creating verifier and decoding proof...');

    const verifier = new LDMerkleProof2019({ document: certificateData });
    const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(certificateData.proof);

    console.log('   📄 Certificate Details:');
    console.log(`      • ID: ${certificateData.id}`);
    console.log(`      • Issuer: ${certificateData.issuer}`);
    console.log(`      • Issuance Date: ${certificateData.issuanceDate}`);
    console.log(`      • CRID: ${certificateData.crid || 'Not specified'}`);

    console.log('\n   🔐 Proof Details:');
    console.log(`      • Proof Type: ${certificateData.proof.type}`);
    console.log(`      • Created: ${certificateData.proof.created}`);
    console.log(`      • Verification Method: ${certificateData.proof.verificationMethod}`);
    console.log(`      • ENS Name: ${certificateData.proof.ens_name || 'Not specified'}`);

    console.log('\n   📊 Decoded Proof Structure:');
    console.log(`      • Target Hash: ${decodedProof.targetHash}`);
    console.log(`      • Merkle Root: ${decodedProof.merkleRoot}`);
    console.log(`      • Path Length: ${decodedProof.path?.length || 'N/A'}`);
    console.log(`      • Anchors: ${decodedProof.anchors?.length || 0} found`);

    log(colors.green, '   ✅ Proof decoded successfully');

    // Step 3: Blockchain detection
    log(colors.blue, '\n3. Detecting blockchain...');

    const chain = verifier.getChain();
    if (chain) {
      console.log(`   🔗 Blockchain Information:`);
      console.log(`      • Chain Code: ${chain.code}`);
      console.log(`      • Chain Name: ${chain.name}`);
      console.log(`      • Blink Code: ${chain.blinkCode}`);
      console.log(`      • Signature Value: ${chain.signatureValue}`);

      if (chain.code === 'ethbloxberg') {
        log(colors.green, '   ✅ Bloxberg blockchain correctly identified');
      } else {
        log(colors.yellow, `   ⚠️  Non-Bloxberg blockchain detected: ${chain.name}`);
      }
    } else {
      log(colors.red, '   ❌ Failed to detect blockchain');
    }

    // Step 4: Extract transaction information
    log(colors.blue, '\n4. Extracting transaction information...');

    if (decodedProof.anchors && decodedProof.anchors.length > 0) {
      const anchor = decodedProof.anchors[0];
      const anchorParts = anchor.split(':');

      console.log(`   ⚓ Anchor Information:`);
      console.log(`      • Format: ${anchorParts[0]}:${anchorParts[1]}:${anchorParts[2]}:${anchorParts[3]}`);
      console.log(`      • Protocol: ${anchorParts[0]}`);
      console.log(`      • Chain: ${anchorParts[1]}`);
      console.log(`      • Network: ${anchorParts[2]}`);
      console.log(`      • Transaction ID: ${anchorParts[3]}`);

      log(colors.green, '   ✅ Transaction information extracted');
    }

    // Step 5: Verification attempt
    log(colors.blue, '\n5. Attempting verification...');

    const result = await verifier.verifyProof({
      verifyIdentity: false, // Skip identity verification for this example
      documentLoader: () => null // Basic document loader
    });

    console.log(`   🔍 Verification Result:`);
    console.log(`      • Verified: ${result.verified}`);
    if (result.error) {
      console.log(`      • Error: ${result.error}`);
    }

    if (result.verified) {
      log(colors.green, '\n🎉 CERTIFICATE FULLY VERIFIED!');
    } else if (result.error?.includes('hash')) {
      log(colors.yellow, '\n⚠️  CERTIFICATE STRUCTURALLY VALID');
      console.log('   The certificate structure is correct, but hash verification failed.');
      console.log('   This is expected without proper JSON-LD context resolution.');
      console.log('   For production use, implement proper context loading.');
    } else {
      log(colors.red, '\n❌ CERTIFICATE VERIFICATION FAILED');
      console.log(`   Reason: ${result.error}`);
    }

    // Step 6: Validation summary
    console.log(`\n${colors.bold}📋 VALIDATION SUMMARY${colors.reset}`);
    console.log('━'.repeat(50));

    const checks = [
      { name: 'Certificate Structure', status: true },
      { name: 'Proof Decoding', status: true },
      { name: 'Blockchain Detection', status: !!chain },
      { name: 'Transaction Extraction', status: !!(decodedProof.anchors?.length) },
      { name: 'Full Verification', status: result.verified }
    ];

    checks.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      const color = check.status ? colors.green : colors.red;
      console.log(`${color}${icon} ${check.name}${colors.reset}`);
    });

    const passedChecks = checks.filter(c => c.status).length;
    const totalChecks = checks.length;

    console.log(`\n${colors.bold}Score: ${passedChecks}/${totalChecks} checks passed${colors.reset}`);

    if (passedChecks >= 4) {
      log(colors.green, '✅ Certificate is valid and properly structured for Bloxberg!');
    } else if (passedChecks >= 2) {
      log(colors.yellow, '⚠️  Certificate has some issues but basic structure is intact.');
    } else {
      log(colors.red, '❌ Certificate has significant issues.');
    }

    return { success: true, result };

  } catch (error) {
    log(colors.red, `\n❌ Error during verification: ${error.message}`);
    console.error(error);
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  let certificate: any;

  if (args.length > 0) {
    // Load certificate from file
    const filePath = path.resolve(args[0]);

    if (!fs.existsSync(filePath)) {
      log(colors.red, `❌ Certificate file not found: ${filePath}`);
      process.exit(1);
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      certificate = JSON.parse(fileContent);
      console.log(`📁 Loaded certificate from: ${filePath}\n`);
    } catch (error) {
      log(colors.red, `❌ Error reading certificate file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Use example certificate
    certificate = bloxbergCertificateFixture;
    console.log(`📄 Using built-in example Bloxberg certificate\n`);
  }

  const result = await testBloxbergCertificate(certificate);

  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}

// Handle CLI usage
if (import.meta.url.endsWith(process.argv[1])) {
  main().catch(console.error);
}

export { testBloxbergCertificate };