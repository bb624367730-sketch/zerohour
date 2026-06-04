import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';

export function useBalance(address?: string) {
  const client = useSuiClient();

  const { data } = useQuery({
    queryKey: ['balance', address],
    queryFn: async () => {
      if (!address) return 0n;
      const bal = await client.getBalance({ owner: address });
      return BigInt(bal.totalBalance);
    },
    enabled: !!address,
    refetchInterval: 8000,
  });

  return data ?? 0n;
}
