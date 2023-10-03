import { Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import BoxCard from 'src/components/Box/BoxCard';
import { MarketNft } from 'src/components/Marketplace/types';
import { marketToContract } from 'src/helpers/transform.market-item';
import api from 'src/services/api';
import { Collection } from 'src/types';

const BoxPage = () => {
  const { boxId } = useParams();
  const navigate = useNavigate();

  const { data: marketItems } = useQuery({
    queryKey: ['fetchMarketItems'],
    queryFn: () => api.get<void, MarketNft[]>('/marketItems'),
    select: (data) => data?.map((item) => marketToContract(item)) || [],
  });

  const { data: collection } = useQuery({
    queryKey: ['fetchMarketItemsAddress', boxId],
    queryFn: () => api.get<void, Collection>(`/marketCollections/${boxId}`),
    enabled: !!boxId,
  });

  const { data: marketItemsAddress } = useQuery({
    queryKey: ['marketItemAddress', collection?.token_address],
    queryFn: () =>
      api.get<void, MarketNft[]>(
        `/marketItems/address/${collection?.token_address}`
      ),
    select: (data) => data?.map((item) => marketToContract(item)) || [],
    enabled: !!collection?.token_address,
  });

  return (
    <div className="container flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between mb-4">
        <Title>Mystery Box</Title>
      </div>
      <Text></Text>
      <div className="flex flex-row items-center justify-center"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {(boxId ? marketItemsAddress : marketItems)?.map(({ ...rest }) => (
          <BoxCard
            key={Number(rest.itemId)}
            {...rest}
            onClick={() => navigate(`${rest.itemId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default BoxPage;
