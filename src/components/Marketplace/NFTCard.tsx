import { Badge, Card, Group, Image, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { abiNft } from 'src/configs/contract';
import { Nft } from 'src/types';
import { xrcRate } from 'src/utils/contains';
import { Address, formatEther } from 'viem';
import { useContractRead } from 'wagmi';

const NFTCard = ({
  tokenId,
  nftAddress,
  selectedNft,
  setSelectedNft,
  price,
}: {
  tokenId: bigint;
  nftAddress?: Address;
  selectedNft?: Nft;
  setSelectedNft?: (nft: Nft) => void;
  price?: bigint;
}) => {
  const { data: uri } = useContractRead<unknown[], 'TokenURI', string>({
    address: nftAddress,
    abi: abiNft,
    functionName: 'tokenURI' as any,
    args: [tokenId],
    enabled: !!tokenId,
  });

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
      onClick={() => setSelectedNft?.({ nftContract: nftAddress!, tokenId })}
      bg={selectedNft?.tokenId === tokenId ? 'cyan' : undefined}
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
      {price ? (
        <Group position="apart" mt="xs">
          <Text weight={500}>Price</Text>
          <Group position="right">
            <Text weight={500}>XRC {formatEther(price || 0n)}</Text>
            <Text color="dimmed">
              ≈ $ {(Number(formatEther(price)) * xrcRate).toFixed(3)}
            </Text>
          </Group>
        </Group>
      ) : null}
      <Text size={'xs'} color={'dimmed'} className="italic">
        {data?.description}
      </Text>
    </Card>
  );
};

export default NFTCard;
