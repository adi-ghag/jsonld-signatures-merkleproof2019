export default {
  '@context': ['https://www.w3.org/2018/credentials/v1', 'https://w3id.org/blockcerts/v3'],
  id: 'urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c',
  type: ['VerifiableCredential', 'BlockcertsCredential'],
  issuer: 'https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json',
  issuanceDate: '2022-08-18T14:04:24Z',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    name: 'Julien Fraichot',
    email: 'julien.fraichot@hyland.com',
    publicKey: 'ecdsa-koblitz-pubkey:1BPQXndcz5Uf3qZQkgnvJC87LUD5n7a2mC'
  },
  display: {
    contentMediaType: 'text/html',
    content: '<div style="background-color:transparent;padding:6px;display:inline-flex;align-items:center;flex-direction:column">Hello world</div>'
  },
  proof: {
    type: 'MerkleProof2019',
    created: '2022-11-02T15:33:11.253724',
    proofValue: 'znKD4YGVqA8texv1PrVrhripRpmtid9LqxNj8TRUKHD5dXobGcBnZcHJMY3oguH9T8YcT9MuqnzQxYYRcReoxc9vm5PhucNBqdFYwZuwNEeFTn9GoJLPqAwQSw2J2atnCuEFAqwMXstnLkSNQrEwpBAGshkH1eMhqSYh4Ut3gVHq85eSKuu2YFHeCHAXN6QW7qfAiiiS4VLSE9E9PPUDdbp3MrDSb52gentZHJiHJHpKggxKs8GYYkqFQmr7rJ8HqVzLmwRRMAYA7TsVopawvFGtXTsbWXg6BK9jCFEPYvD3vNBvW5bVpEGvJgH',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json#key-1'
  }
};
