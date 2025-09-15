import { describe, it, expect } from 'vitest';
import getChain from '../../src/helpers/getChain.js';
import { type DecodedProof } from '../../src/models/Proof';

describe('Arbitrum Chain Detection', () => {
  describe('when given an Arbitrum Sepolia anchor', () => {
    it('should detect Arbitrum Sepolia chain', () => {
      const decodedProof: DecodedProof = {
        path: [],
        merkleRoot: 'test-root',
        targetHash: 'test-hash',
        anchors: ['blink:arb:sepolia:0x1234567890abcdef']
      };

      const chain = getChain(decodedProof);

      expect(chain).toBeDefined();
      expect(chain.name).toBe('Arbitrum Sepolia');
      expect(chain.code).toBe('arbitrumsepolia');
      expect(chain.test).toBe(true);
      expect(chain.blinkCode).toBe('eth');
      expect(chain.signatureValue).toBe('arbitrumSepolia');
    });
  });

  describe('when given an Arbitrum One (mainnet) anchor', () => {
    it('should detect Arbitrum One chain with "one" network', () => {
      const decodedProof: DecodedProof = {
        path: [],
        merkleRoot: 'test-root',
        targetHash: 'test-hash',
        anchors: ['blink:arb:one:0x1234567890abcdef']
      };

      const chain = getChain(decodedProof);

      expect(chain).toBeDefined();
      expect(chain.name).toBe('Arbitrum One');
      expect(chain.code).toBe('arbitrumone');
      expect(chain.test).toBe(false);
      expect(chain.blinkCode).toBe('eth');
      expect(chain.signatureValue).toBe('arbitrumOne');
    });

    it('should detect Arbitrum One chain with "mainnet" network', () => {
      const decodedProof: DecodedProof = {
        path: [],
        merkleRoot: 'test-root',
        targetHash: 'test-hash',
        anchors: ['blink:arb:mainnet:0x1234567890abcdef']
      };

      const chain = getChain(decodedProof);

      expect(chain).toBeDefined();
      expect(chain.name).toBe('Arbitrum One');
      expect(chain.code).toBe('arbitrumone');
      expect(chain.test).toBe(false);
      expect(chain.blinkCode).toBe('eth');
      expect(chain.signatureValue).toBe('arbitrumOne');
    });
  });

  describe('when given an invalid Arbitrum anchor', () => {
    it('should return null for unknown Arbitrum network', () => {
      const decodedProof: DecodedProof = {
        path: [],
        merkleRoot: 'test-root',
        targetHash: 'test-hash',
        anchors: ['blink:arb:unknown:0x1234567890abcdef']
      };

      const chain = getChain(decodedProof);
      expect(chain).toBeUndefined();
    });
  });

  describe('integration with real proof data', () => {
    it('should handle actual Arbitrum Sepolia proof anchor', () => {
      const decodedProof: DecodedProof = {
        path: [],
        merkleRoot: '0a991d8e650c5055e70e1a78cdfe07dfbb31c16ab50f50abcc558dce1695b931',
        targetHash: '0a991d8e650c5055e70e1a78cdfe07dfbb31c16ab50f50abcc558dce1695b931',
        anchors: ['blink:arb:sepolia:0x9d9eb0a55e702eb18b8aa390480ea212ad34b486ef592c9e5c390481559fc8e0']
      };

      const chain = getChain(decodedProof);

      expect(chain).toBeDefined();
      expect(chain.name).toBe('Arbitrum Sepolia');
      expect(chain.code).toBe('arbitrumsepolia');
      expect(chain.transactionTemplates.full).toBe('https://sepolia.arbiscan.io/tx/{transaction_id}');
    });
  });
});