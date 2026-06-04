import { readFileSync } from 'fs';
import { join } from 'path';
import { sha3_256 } from '@noble/hashes/sha3';

const mod = readFileSync(join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'game.mv'));
console.log('Module size:', mod.length);
console.log('Module sha3_256:', Buffer.from(sha3_256(mod)).toString('hex'));

// Check first 50 bytes in hex
console.log('First 50 bytes:', mod.slice(0, 50).toString('hex'));

// Check address at offset 1927
const addrBytes = mod.slice(1927, 1927 + 32);
console.log('Bytes at 1927:', addrBytes.toString('hex'));

// Also check for 0x0 address
const zeroAddr = '0000000000000000000000000000000000000000000000000000000000000000';
let zeroCount = 0;
for (let i = 0; i < mod.length - 32; i += 1) {
  if (mod.slice(i, i + 32).toString('hex') === zeroAddr) {
    zeroCount++;
  }
}
console.log('Zero address occurrences:', zeroCount);
