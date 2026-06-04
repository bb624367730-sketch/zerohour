import { readFileSync } from 'fs';
import { join } from 'path';
import { sha3_256 } from '@noble/hashes/sha3';
import { keccak_256 } from '@noble/hashes/sha3';

const mod = readFileSync(join('..', 'move', 'build', 'fomo3d_sui', 'bytecode_modules', 'game.mv'));
const expected = '41f610b632b719fa4645c3f333378e6d28c3a84e40220603c776839029563649';

// BCS encoding helpers
function uleb128(value: number): number[] {
  const result: number[] = [];
  let v = value;
  do {
    let byte = v & 0x7f;
    v >>>= 7;
    if (v !== 0) byte |= 0x80;
    result.push(byte);
  } while (v > 0);
  return result;
}

// BCS vector<address>: uleb128(count) ++ addr1 (32 bytes) ++ addr2 (32 bytes) ++ ...
const dep1 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
const dep2 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex');
const depsBcs = Buffer.from([2, ...dep1, ...dep2]);

// BCS vector<vector<u8>>: uleb128(count) ++ for each: uleb128(len) ++ bytes
const modLen = uleb128(mod.length);
const modsBcs = Buffer.from([1, ...modLen, ...mod]);

console.log('depsBcs length:', depsBcs.length);
console.log('modsBcs length:', modsBcs.length);

// Test 1: sha3_256(modsBcs ++ depsBcs)
const test1 = Buffer.from(sha3_256(Buffer.concat([modsBcs, depsBcs]))).toString('hex');
console.log('sha3_256(modsBcs ++ depsBcs):', test1);
console.log('Match:', test1 === expected);

// Test 2: sha3_256(depsBcs ++ modsBcs)
const test2 = Buffer.from(sha3_256(Buffer.concat([depsBcs, modsBcs]))).toString('hex');
console.log('sha3_256(depsBcs ++ modsBcs):', test2);
console.log('Match:', test2 === expected);

// Test 3: sha3_256(deps_raw ++ mods_raw) - without count prefixes
const depsRaw = Buffer.concat([dep1, dep2]);
const test3 = Buffer.from(sha3_256(Buffer.concat([depsRaw, mod]))).toString('hex');
console.log('sha3_256(deps_raw ++ mod_raw):', test3);
console.log('Match:', test3 === expected);

// Test 4: sha3_256(deps_raw ++ modsBcs)
const test4 = Buffer.from(sha3_256(Buffer.concat([depsRaw, modsBcs]))).toString('hex');
console.log('sha3_256(deps_raw ++ modsBcs):', test4);
console.log('Match:', test4 === expected);

// Test 5: sha3_256(only modsBcs)
const test5 = Buffer.from(sha3_256(modsBcs)).toString('hex');
console.log('sha3_256(only modsBcs):', test5);
console.log('Match:', test5 === expected);

// Test 6: sha3_256(dep_count_prefixed_deps ++ mod_count_prefixed_modules)
// where deps is prefixed with count and each dep is 32 raw bytes
// and modules is prefixed with count and each module is prefixed with length
const depsVec = Buffer.from([2, ...dep1, ...dep2]);
const modsVec = Buffer.from([1, ...uleb128(mod.length), ...mod]);
const test6 = Buffer.from(sha3_256(Buffer.concat([depsVec, modsVec]))).toString('hex');
console.log('sha3_256(vec_deps ++ vec_mods):', test6);
console.log('Match:', test6 === expected);

// Test 7: keccak of deps_raw ++ mod_raw
const test7 = Buffer.from(keccak_256(Buffer.concat([depsRaw, mod]))).toString('hex');
console.log('keccak_256(deps_raw ++ mod_raw):', test7);
console.log('Match:', test7 === expected);

// Test 8: What if dependencies are SORTED by their string representation?
// 0x1 = "0x0000000000000000000000000000000000000000000000000000000000000001"
// 0x2 = "0x0000000000000000000000000000000000000000000000000000000000000002"
// Both start with 0x00... so sorting doesn't change order
// What if modules and deps are sorted BY LENGTH first, then by content?
// dep1 (32) < dep2 (32) < module (5245) - same order
// Still the same

// Test 9: Maybe the digest uses the SHA3-256 of each element separately,
// then sorts the hashes, then hashes the concatenation?
const dep1Hash = sha3_256(dep1);
const dep2Hash = sha3_256(dep2);
const modHash = sha3_256(mod);
const sortedHashes = [dep1Hash, dep2Hash, modHash].sort((a, b) => {
  for (let i = 0; i < 32; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
});
const hashesConcat = new Uint8Array(96);
hashesConcat.set(sortedHashes[0], 0);
hashesConcat.set(sortedHashes[1], 32);
hashesConcat.set(sortedHashes[2], 64);
const test9 = Buffer.from(sha3_256(hashesConcat)).toString('hex');
console.log('sha3_256(sorted hashes):', test9);
console.log('Match:', test9 === expected);
