import { readFileSync } from 'fs';
import { join } from 'path';
import { sha3_256 } from '@noble/hashes/sha3';
import { keccak_256 } from '@noble/hashes/sha3';

const gameModule = readFileSync(join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'game.mv'));
const expected = '41f610b632b719fa4645c3f333378e6d28c3a84e40220603c776839029563649';

// Theory 1: dependency addresses as full hex strings (64 chars → 64 bytes ASCII)
const dep1_hex = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'ascii');
const dep2_hex = Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'ascii');
const input1 = Buffer.concat([dep1_hex, dep2_hex, gameModule]);
const hash1 = Buffer.from(sha3_256(input1)).toString('hex');
console.log('Hash (deps as ASCII hex):', hash1);
console.log('Match:', hash1 === expected);

// Theory 2: dependency addresses as 0x-prefixed hex strings
const dep1_hex2 = Buffer.from('0x0000000000000000000000000000000000000000000000000000000000000001', 'ascii');
const dep2_hex2 = Buffer.from('0x0000000000000000000000000000000000000000000000000000000000000002', 'ascii');
const input2 = Buffer.concat([dep1_hex2, dep2_hex2, gameModule]);
const hash2 = Buffer.from(sha3_256(input2)).toString('hex');
console.log('Hash (deps as 0x...):', hash2);
console.log('Match:', hash2 === expected);

// Theory 3: BCS-encoded dependency list first, then BCS-encoded modules list
// For BCS vector<address>: each address is 32 bytes, vector is length-prefixed
// BCS vector<vector<u8>>: each inner vector is length-prefixed, outer is too
// Let's just try concat of (dep_count as uleb128 + deps + modules)
import { bcs } from '@mysten/sui/bcs';
const depsBcs = bcs.vector(bcs.Address).serialize(['0x1', '0x2']);
console.log('BCS deps length:', depsBcs.length);
console.log('BCS deps hex:', Buffer.from(depsBcs).toString('hex'));

const input3 = Buffer.concat([depsBcs, gameModule]);
const hash3 = Buffer.from(sha3_256(input3)).toString('hex');
console.log('Hash (BCS deps + module):', hash3);
console.log('Match:', hash3 === expected);

// Theory 4: modules BCS-encoded first, then deps BCS-encoded
const modsBcs = bcs.vector(bcs.vector(bcs.u8())).serialize([Array.from(gameModule)]);
const input4 = Buffer.concat([modsBcs, depsBcs]);
const hash4 = Buffer.from(sha3_256(input4)).toString('hex');
console.log('Hash (BCS mods + BCS deps):', hash4);
console.log('Match:', hash4 === expected);

// Theory 5: Just the BCS-serialized modules
const hash5 = Buffer.from(sha3_256(modsBcs)).toString('hex');
console.log('Hash (BCS mods only):', hash5);
console.log('Match:', hash5 === expected);

// Theory 6: All dependency modules included (not just addresses)
const moveStdlibDir = join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'dependencies', 'MoveStdlib');
const suiDir = join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'dependencies', 'Sui');

// List all .mv files in each dir and hash them
import { readdirSync } from 'fs';
const stdlibMods = readdirSync(moveStdlibDir).filter(f => f.endsWith('.mv')).sort();
const suiMods = readdirSync(suiDir).filter(f => f.endsWith('.mv')).sort();
console.log(`\nMoveStdlib modules: ${stdlibMods.length}`);
console.log(`Sui modules: ${suiMods.length}`);

// Theory 7: The digest is of the OLD on-chain module
// Let me check if the digest matches the empty string or something simple
const hash7 = Buffer.from(sha3_256(new Uint8Array(0))).toString('hex');
console.log('Hash (empty):', hash7);
console.log('Match:', hash7 === expected);

// Theory 8: Hash is module ++ deps (reverse order: modules first, then deps)
const depsRaw = Buffer.concat([
  Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex'),
  Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex'),
]);
const input8 = Buffer.concat([gameModule, depsRaw]);
const hash8 = Buffer.from(sha3_256(input8)).toString('hex');
console.log('Hash (module ++ deps):', hash8);
console.log('Match:', hash8 === expected);
