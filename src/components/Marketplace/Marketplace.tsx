import { Button, Input, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { marketToContract } from 'src/helpers/transform.market-item';
import api from 'src/services/api';
import CreateMarketItem from './CreateMarketItem';
import NFTCard from './NFTCard';
import { MarketNft } from './types';
import { Collection } from 'src/types';

export default function Marketplace() {
  const [opened, { close, open }] = useDisclosure();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  // const { data: marketItems } = useContractRead<
  //   unknown[],
  //   'fetchMarketItems',
  //   MarketNft[]
  // >({
  //   ...contractMarket,
  //   functionName: 'fetchMarketItems',
  // });
  const { data: marketItems } = useQuery({
    queryKey: ['fetchMarketItems'],
    queryFn: () => api.get<void, MarketNft[]>('/marketItems'),
    select: (data) => data.map((item) => marketToContract(item)) || [],
  });
  
  let dataRender = marketItems
  if (collectionId) {
    const { data: collection } = useQuery({
      queryKey: ['fetchMarketItemsAddress'],
      queryFn: () => api.get<void, Collection>(`/marketCollections/${collectionId}`),
    });

    const { data: marketItemsAddress } = useQuery({
      queryKey: ['marketItemAddress', collection?.token_address],
      queryFn: () => api.get<void, MarketNft[]>(`/marketItems/address/${collection?.token_address}`),
      select: (data) => data.map((item) => marketToContract(item)) || [],
    })
    dataRender = marketItemsAddress
  }

  return (
    <div className="container flex flex-col gap-4 pl-20 pr-20">
      <div className="flex justify-center mb-4">
        <Title>MARKETPLACE</Title>
      </div>
      <div className="flex flex-row items-center justify-between">
        <Input
          icon={<IconSearch />}
          variant="filled"
          size="sm"
          placeholder="search collectibles by name..."
          w={500}
        />
        <Button onClick={open}>List NFT</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dataRender?.map(({ nftContract, ...rest }) => (
          <NFTCard
            key={Number(rest.itemId)}
            nftContract={nftContract}
            {...rest}
            onClick={({ itemId }) => collectionId? navigate(`../marketplace/${itemId}/details`):navigate(`${itemId}/details`)}
          />
        ))}
      </div>
      <CreateMarketItem opened={opened} onClose={close} />
    </div>
  );
}
