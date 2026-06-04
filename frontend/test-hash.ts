import { readFileSync } from 'fs';
import { join } from 'path';
import { sha3_256 } from '@noble/hashes/sha3';
import { keccak_256 } from '@noble/hashes/sha3';

const gameModule = readFileSync(join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'game.mv'));

// Expected by chain: 41f610b632b719fa4645c3f333378e6d28c3a84e40220603c776839029563649
const expected = '41f610b632b719fa4645c3f333378e6d28c3a84e40220603c776839029563649';

// Build input: 0x1 (32 bytes) ++ 0x2 (32 bytes) ++ module bytes
const dep1 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
const dep2 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex');
const input = Buffer.concat([dep1, dep2, gameModule]);

console.log('Module size:', gameModule.length);

// Try SHA3-256 (NIST)
const sha3 = Buffer.from(sha3_256(input)).toString('hex');
console.log('SHA3-256:', sha3);
console.log('Expected: ', expected);
console.log('Match (SHA3):', sha3 === expected);

// Try Keccak-256
const keccak = Buffer.from(keccak_256(input)).toString('hex');
console.log('Keccak-256:', keccak);
console.log('Match (Keccak):', keccak === expected);

// Try other order: modules first, then dependencies
const input2 = Buffer.concat([gameModule, dep1, dep2]);
const sha3_2 = Buffer.from(sha3_256(input2)).toString('hex');
console.log('SHA3 (mods first):', sha3_2);
console.log('Match:', sha3_2 === expected);

// Try without dependencies
const sha3_3 = Buffer.from(sha3_256(gameModule)).toString('hex');
console.log('SHA3 (no deps):', sha3_3);
console.log('Match:', sha3_3 === expected);

// Try deps only
const sha3_4 = Buffer.from(sha3_256(Buffer.concat([dep1, dep2]))).toString('hex');
console.log('SHA3 (deps only):', sha3_4);
console.log('Match:', sha3_4 === expected);

// Hash of input from both upgrade attempts (old module)
// Try reading the old game module from the earlier build
// Also try BLAKE2b-256 (which Sui uses for some hashing)
import { blake2b } from '@noble/hashes/blake2b';
const blake = Buffer.from(blake2b(input, { dkLen: 32 })).toString('hex');
console.log('BLAKE2b-256:', blake);
console.log('Match (BLAKE2b):', blake === expected);
