import { readFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const gameModule = readFileSync(join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'game.mv'));
const expected = '41f610b632b719fa4645c3f333378e6d28c3a84e40220603c776839029563649';

// Try SHA-256 (SHA2)
const sha256 = createHash('sha256').update(gameModule).digest('hex');
console.log('SHA2-256 (module only):', sha256);
console.log('Match:', sha256 === expected);

// Try with deps first
const dep1 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
const dep2 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex');
const input = Buffer.concat([dep1, dep2, gameModule]);
const sha256full = createHash('sha256').update(input).digest('hex');
console.log('SHA2-256 (deps + module):', sha256full);
console.log('Match:', sha256full === expected);

// Try SHA2-256 on just deps
const sha256deps = createHash('sha256').update(Buffer.concat([dep1, dep2])).digest('hex');
console.log('SHA2-256 (deps only):', sha256deps);
console.log('Match:', sha256deps === expected);

// What about the digest as a 32-byte value? Let's see if it matches any known hash
// Maybe it's the hash of the module name + module bytes
const nameBytes = Buffer.from('game', 'utf8');
const nameInput = Buffer.concat([nameBytes, gameModule]);
const sha256name = createHash('sha256').update(nameInput).digest('hex');
console.log('SHA2-256 (name + module):', sha256name);
console.log('Match:', sha256name === expected);

// What about the hash of the BCS-encoded module (with length prefix)?
const bcsLen = Buffer.alloc(4);
bcsLen.writeUInt32LE(gameModule.length, 0);
const bcsModule = Buffer.concat([bcsLen, gameModule]);
const sha256bcs = createHash('sha256').update(bcsModule).digest('hex');
console.log('SHA2-256 (bcs-length + module):', sha256bcs);
console.log('Match:', sha256bcs === expected);

// Try just the first 32 bytes of various inputs
// Maybe there's a truncated version
// Also try ULEB128 length prefix
function uleb128(n: number): Buffer {
  const result: number[] = [];
  do {
    let byte = n & 0x7f;
    n >>>= 7;
    if (n !== 0) byte |= 0x80;
    result.push(byte);
  } while (n > 0);
  return Buffer.from(result);
}
const ulebLen = uleb128(gameModule.length);
console.log('ULEB128 length:', ulebLen.toString('hex'));
const bcsMod2 = Buffer.concat([ulebLen, gameModule]);
const sha256bcs2 = createHash('sha256').update(bcsMod2).digest('hex');
console.log('SHA2-256 (uleb128+module):', sha256bcs2);
console.log('Match:', sha256bcs2 === expected);
