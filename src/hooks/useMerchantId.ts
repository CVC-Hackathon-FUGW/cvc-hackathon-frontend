import { useQuery } from '@tanstack/react-query';
import api from 'src/services/api';
import { useAccount } from 'wagmi';

const useMerchantId = () => {
  const { address } = useAccount();

  const { data: merchantId } = useQuery({
    queryKey: ['merchantId', address],
    queryFn: () =>
      api.get<void, { merchant_id: string }>(`/sellers/address/${address}`),
    enabled: !!address,
    select: (data) => data?.merchant_id,
  });

  return merchantId;
};

export default useMerchantId;
