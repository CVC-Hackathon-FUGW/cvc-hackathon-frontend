import { Badge, Card, Group, Image, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { abiNft } from 'src/configs/contract';
import { getNftSrc } from 'src/helpers/get-nft-src';
import { ContractNft, Nft } from 'src/types';
import { xrcRate } from 'src/utils/contains';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';

interface NFTCardProps extends Partial<ContractNft> {
  selectedNft?: Nft;
  onClick?: (nft: Partial<ContractNft>) => void;
}

const NFTCard = (props: NFTCardProps) => {
  const { tokenId, nftContract, selectedNft, onClick, price, ...rest } = props;

  const { data: uri } = useContractRead<unknown[], 'tokenURI', string>({
    address: nftContract,
    abi: abiNft,
    functionName: 'tokenURI',
    args: [tokenId],
    enabled: !!tokenId,
  });

  const { data } = useQuery({
    queryKey: ['nft', uri],
    queryFn: async () => uri && axios.get(uri).then((res) => res.data),
    enabled: !!uri,
    retry: false,
  });

  if (!data) return null;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="cursor-pointer grid gap-1"
      onClick={() => onClick?.({ nftContract: nftContract!, tokenId, ...rest })}
      bg={selectedNft?.tokenId === tokenId ? 'cyan' : undefined}
    >
      <Card.Section>
        <Image src={getNftSrc(data?.image)} alt="Norway" />
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{data?.name}</Text>
        <Badge>#{tokenId?.toString()}</Badge>
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
