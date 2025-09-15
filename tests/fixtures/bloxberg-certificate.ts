// Bloxberg certificate test fixture and utilities

export const bloxbergCertificateFixture = {
  "id": "https://bloxberg.org",
  "type": ["VerifiableCredential", "BloxbergCredential"],
  "issuer": "https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json",
  "issuanceDate": "2025-08-26T11:33:07.233557+00:00",
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
    "created": "2025-08-26T11:33:25.211352",
    "proofValue": "z2LuLBVSfnVzaQtxnpxUAEKyDUCFLUV2X62bqodhQyE9YjNCbH65jsyJM34RvDvRiVunD72Y5BbUGSuQN6qiHtuC2AZhEMxWaHt7GGULRTmNHadfRbZC4Wv6JQFZwgZPQoByEuTzGFz5zhbJae5Rbv3qLpfAqeqtJZs1gu844gbyeEGNPmVioERLGvHn8Uc22qyVZDsE5xiMSvNugxpBuh2K868P1xQPqQf6aafbz8jgCtcfH3LXGSCLapYSafA1BoBUHTf8AfmztdYpk1yDGnncjk7TaCePDXwJd3CNTAJiV5NpnmZ44uyJ7uz9LztZ7nFXStmsecgMR2P3Pz71mGTZogcqr1G48HEkDi5ADqvNPv2kTqZE1AAZigTbuGYUqxNb75oMwfxbFhV5dPfhgX",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "ecdsa-koblitz-pubkey:0xD748BF41264b906093460923169643f45BDbC32e",
    "ens_name": "mpdl.berg"
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/bloxberg/schema/research_object_certificate_v1"
  ]
};

// Expected decoded proof structure from the Bloxberg certificate
export const expectedDecodedProof = {
  targetHash: 'b7caee5080ebd2bd5e24a5a28f8cb12d90331c056f10c7421a56bfa46aec26a0',
  merkleRoot: 'cbec52fb5cd238c2d7b6b00d3b1ed731bb365a9b5d3ebca1291bb06bfa4808da',
  anchors: ['blink:eth:bloxberg:0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d']
};

// Transaction ID extracted from the anchor
export const bloxbergTransactionId = '0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d';

// Mock transaction data for testing
export const mockBloxbergTransactionData = {
  remoteHash: 'cbec52fb5cd238c2d7b6b00d3b1ed731bb365a9b5d3ebca1291bb06bfa4808da',
  issuingAddress: '0xD748BF41264b906093460923169643f45BDbC32e',
  time: '2025-08-26T11:33:25.000000',
  revokedAddresses: []
};

// Bloxberg blockchain configuration expectations
export const expectedBloxbergChain = {
  code: 'ethbloxberg',
  name: 'bloxberg',
  blinkCode: 'eth',
  signatureValue: 'ethbloxberg'
};

// Utility function to create a copy of the certificate for mutation testing
export function createBloxbergCertificateCopy(): typeof bloxbergCertificateFixture {
  return JSON.parse(JSON.stringify(bloxbergCertificateFixture));
}

// Utility function to create an invalid certificate (missing proof)
export function createInvalidBloxbergCertificate(): Partial<typeof bloxbergCertificateFixture> {
  const invalid = createBloxbergCertificateCopy();
  delete (invalid as any).proof;
  return invalid;
}

// Utility to validate Bloxberg certificate structure
export function validateBloxbergCertificateStructure(certificate: any): {
  valid: boolean;
  errors: string[]
} {
  const errors: string[] = [];

  if (!certificate['@context']) {
    errors.push('Missing @context');
  } else if (!certificate['@context'].includes('https://www.w3.org/2018/credentials/v1')) {
    errors.push('Missing required VC context');
  }

  if (!certificate.type || !Array.isArray(certificate.type)) {
    errors.push('Missing or invalid type array');
  } else {
    if (!certificate.type.includes('VerifiableCredential')) {
      errors.push('Missing VerifiableCredential type');
    }
    if (!certificate.type.includes('BloxbergCredential')) {
      errors.push('Missing BloxbergCredential type');
    }
  }

  if (!certificate.issuer) {
    errors.push('Missing issuer');
  }

  if (!certificate.issuanceDate) {
    errors.push('Missing issuanceDate');
  }

  if (!certificate.credentialSubject) {
    errors.push('Missing credentialSubject');
  }

  if (!certificate.proof) {
    errors.push('Missing proof');
  } else {
    if (certificate.proof.type !== 'MerkleProof2019') {
      errors.push('Invalid proof type');
    }
    if (!certificate.proof.proofValue) {
      errors.push('Missing proofValue');
    }
    if (!certificate.proof.verificationMethod) {
      errors.push('Missing verificationMethod');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}