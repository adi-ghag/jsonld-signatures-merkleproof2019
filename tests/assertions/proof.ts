import { DecodedProof } from '../../src/models/Proof';

export const assertionTransactionId = '140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e';

const decodedProof: DecodedProof = {
  anchors: [`blink:btc:testnet:${assertionTransactionId}`],
  merkleRoot: '68df661ae14f926878aabbe5ca33e46376e8bfb397c1364c2f1fa653ecd8b4b6',
  path: [{ left: '78e670a04db3cf419fff5fb1b11a420a34e5eeae14cc68476dcb84883b5cdb64' }],
  targetHash: 'eca54e560dd43cccd900fa4bb9221f144d4c451c24beeddfd82e31db842bced1'
};

export default decodedProof;
