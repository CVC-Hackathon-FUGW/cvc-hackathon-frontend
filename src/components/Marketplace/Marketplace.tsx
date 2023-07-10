import { Button, Input, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import CardNft from './CardNft';
import CreateMarketItem from './CreateMarketItem';
import { useDisclosure } from '@mantine/hooks';

export default function Marketplace() {
  const [opened, { close, open }] = useDisclosure();
  return (
    <div className="container">
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
      <div className="flex flex-wrap gap-16 mt-6">
        <CardNft />
        <CardNft />
        <CardNft />
        <CardNft />
        <CardNft />
        <CardNft />
      </div>
      <CreateMarketItem opened={opened} onClose={close} />
    </div>
  );
}
