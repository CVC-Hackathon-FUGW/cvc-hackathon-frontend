import { Button, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { marketToContract } from 'src/helpers/transform.market-item';
import api from 'src/services/api';
import { Collection } from 'src/types';
import NFTCard from './NFTCard';
import { MarketNft } from './types';
import { useDisclosure } from '@mantine/hooks';
import CreateMarketItem from './CreateMarketItem';

export default function Marketplace() {
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [opened, { close, open }] = useDisclosure();

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
      <CreateMarketItem
        opened={opened}
        onClose={close}
        collection={collection}
      />
      <div className="flex flex-row items-center justify-between mb-4">
        <Title>
          {collectionId
            ? collection?.collection_name
            : 'Browse NFT Marketplace'}
        </Title>
        <Button onClick={open} size="lg" className="w-40">
          List NFT
        </Button>
      </div>
      <Text>
        These are market items of this NFT Collection. You can click on each NFT
        to view more detail. You can list NFT of this collection right here by
        click List NFT button. The default listing price is 0.001 XCR each NFT.
        Our system support you to make NFT offerable and support paypal payment
        method. If you want to use paypal method, please go to profile and
        signup to get Merchant ID, then come here to list your NFT!
      </Text>
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
