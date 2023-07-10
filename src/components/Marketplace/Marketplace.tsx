import { Button, Input, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { contractMarket } from 'src/configs/contract';
import { MarketNft } from 'src/types';
import { useContractRead } from 'wagmi';
import CreateMarketItem from './CreateMarketItem';
import NFTCard from './NFTCard';

export default function Marketplace() {
  const [opened, { close, open }] = useDisclosure();

  const { data: marketItems } = useContractRead<
    unknown[],
    'fetchMarketItems',
    MarketNft[]
  >({
    ...contractMarket,
    functionName: 'fetchMarketItems',
  });

  return (
    <div className="container flex flex-col gap-4">
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
        {marketItems?.map(({ nftContract, tokenId, price }) => (
          <NFTCard nftAddress={nftContract} tokenId={tokenId} price={price} />
        ))}
      </div>
      <CreateMarketItem opened={opened} onClose={close} />
    </div>
  );
}
