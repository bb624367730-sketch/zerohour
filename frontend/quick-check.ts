import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
const GAME_ID = '0xbac0f26d4ed975953d3c6e985c10ed731f814903efa835e16af134c93a0b15ee';

async function main() {
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });
  const obj = await client.getObject({ id: GAME_ID, options: { showContent: true } });
  const f = (obj.data?.content as any)?.fields;
  if (f) {
    console.log('Round:', f.round);
    console.log('Jackpot:', f.jackpot, 'MIST');
    console.log('Total tickets:', f.total_tickets_sold);
    console.log('Admin:', f.admin);
  } else {
    console.log('No fields found:', JSON.stringify(obj.data?.content).slice(0, 300));
  }
}
main();
