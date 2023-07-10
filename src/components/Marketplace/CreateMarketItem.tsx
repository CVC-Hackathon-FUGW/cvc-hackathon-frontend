import { Carousel } from '@mantine/carousel';
import { Badge, Card, Group, Image, Modal, Text, rem } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { abiNft, borrowPrice, contractMarket } from 'src/configs/contract';
import useNftDetector from 'src/hooks/useNftDetector';
import { Address, useAccount, useContractRead, useWalletClient } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';

interface CreateMarketItemProps {
  opened: boolean;
  onClose: () => void;
}

const listNftAddress: Address[] = [
  '0xFB4b0A946AFbFb4267bB05B4e73e26481cEa983B',
];

const CreateMarketItem = (props: CreateMarketItemProps) => {
  const { opened, onClose } = props;

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = getPublicClient();

  const handleListNft = async ({
    nftContract = '',
    tokenId = 0,
    price = 0,
    isVisaAccepted = false,
    isOfferable = false,
  }) => {
    try {
      const { request } = await publicClient.simulateContract({
        ...contractMarket,
        functionName: 'CreateMarketItem',
        value: borrowPrice,
        args: [
          nftContract,
          BigInt(tokenId),
          BigInt(price),
          isVisaAccepted,
          isOfferable,
        ],
        account: address,
      });

      await walletClient?.writeContract(request);
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal {...props} size={'xl'} centered>
      {listNftAddress.map((nftAddress) => (
        <NFTCollection
          key={nftAddress}
          nftAddress={opened ? nftAddress : undefined}
        />
      ))}
    </Modal>
  );
};

export default CreateMarketItem;

const NFTCollection = ({ nftAddress }: { nftAddress?: Address }) => {
  const nftIds = useNftDetector(nftAddress);

  return (
    <Carousel
      slideSize="33%"
      breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: rem(2) }]}
      slideGap="xl"
      align="start"
    >
      {nftIds?.map((tokenId) => (
        <Carousel.Slide key={tokenId.toString()}>
          <NFTCard nftAddress={nftAddress} tokenId={tokenId} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

const NFTCard = ({
  nftAddress,
  tokenId,
}: {
  nftAddress?: Address;
  tokenId: bigint;
}) => {
  const { data: uri } = useContractRead<unknown[], 'TokenURI', string>({
    address: nftAddress,
    abi: abiNft,
    functionName: 'tokenURI' as any,
    args: [tokenId],
    enabled: !!tokenId,
  });
  console.log('uri', uri);

  const { data } = useQuery({
    queryKey: ['nft', uri],
    queryFn: async () => uri && axios.get(uri).then((res) => res.data),
    enabled: !!uri,
  });

  if (!data) return null;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="cursor-pointer"
    >
      <Card.Section>
        <Image
          src={data?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          alt="Norway"
        />
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{data?.name}</Text>
        <Badge>#{tokenId.toString()}</Badge>
      </Group>
      <Text>{data?.description}</Text>
    </Card>
  );
};
