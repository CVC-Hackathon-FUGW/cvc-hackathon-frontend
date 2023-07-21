import { Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { marketToContract } from 'src/helpers/transform.market-item';
import api from 'src/services/api';
import { Collection } from 'src/types';
import NFTCard from './NFTCard';
import { MarketNft } from './types';

export default function Marketplace() {
  const navigate = useNavigate();

  const { collectionId } = useParams();
  console.log(collectionId);

  const { data: marketItems } = useQuery({
    queryKey: ['fetchMarketItems'],
    queryFn: () => api.get<void, MarketNft[]>('/marketItems'),
    select: (data) => data?.map((item) => marketToContract(item)) || [],
  });

  const { data: collection } = useQuery({
    queryKey: ['fetchMarketItemsAddress', collectionId],
    queryFn: () =>
      api.get<void, Collection>(`/marketCollections/${collectionId}`),
    enabled: !!collectionId,
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
      <div className="flex justify-center mb-4">
        <Title>MARKETPLACE</Title>
      </div>
      <div className="flex flex-row items-center justify-center"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {(collectionId ? marketItemsAddress : marketItems)?.map(
          ({ nftContract, ...rest }) => (
            <NFTCard
              key={Number(rest.itemId)}
              nftContract={nftContract}
              {...rest}
              onClick={({ itemId }) =>
                collectionId
                  ? navigate(`../marketplace/${itemId}/details`)
                  : navigate(`${itemId}/details`)
              }
            />
          )
        )}
      </div>
    </div>
  );
}
