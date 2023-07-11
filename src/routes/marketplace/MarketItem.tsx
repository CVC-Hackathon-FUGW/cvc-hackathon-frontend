import { Avatar, Button, Image, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { abiNft, contractMarket } from 'src/configs/contract';
import { getNftSrc } from 'src/helpers/get-nft-src';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { MarketNft, NftMetadata } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

const MarketItem = () => {
  const { itemId } = useParams();
  const { address } = useAccount();

  const { data: marketItem } = useContractRead<
    unknown[],
    'GetMarketItem',
    MarketNft
  >({
    ...contractMarket,
    functionName: 'GetMarketItem',
    args: [BigInt(Number(itemId)!)],
    enabled: !!itemId,
  });
  const { tokenId, nftContract, seller, price, sold } = { ...marketItem };

  const { data: uri } = useContractRead<unknown[], 'TokenURI', string>({
    address: nftContract,
    abi: abiNft,
    functionName: 'tokenURI' as 'TokenURI',
    args: [tokenId],
    enabled: !!tokenId && !!nftContract,
  });

  const { data } = useQuery<NftMetadata>({
    queryKey: ['nft', uri],
    queryFn: async () => uri && axios.get(uri).then((res) => res.data),
    enabled: !!uri,
  });

  const { data: collectionName } = useContractRead<unknown[], 'name', string>({
    abi: abiNft,
    address: nftContract,
    functionName: 'name',
    enabled: !!nftContract,
  });

  const { isOwner } = useMemo(() => {
    return {
      isOwner: seller === address,
    };
  }, [address, seller]);
  console.log('isOwner', isOwner);

  console.log(data);
  console.log(marketItem);
  const { write: buyNft } = useContractWrite({
    ...contractMarket,
    functionName: 'Buy',
    account: address,
  });

  return (
    <div className="container grid place-items-center">
      <div className="flex flex-row gap-6">
        <div className="w-72 col-span-2 flex flex-col gap-4">
          <Image src={getNftSrc(data?.image)} alt="Norway" radius="sm" />
          <Button
            disabled={sold}
            onClick={() =>
              buyNft({
                value: price,
                args: [nftContract, marketItem?.itemId],
              })
            }
          >
            Buy
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-1">
            <Avatar radius="xl" />
            <Text>{collectionName}</Text>
          </div>
          <Text size="xl" weight="bolder">
            {data?.name}
          </Text>
          <Text size="lg" weight="bold">
            XCR {formatEther(price || 0n)}
          </Text>
          <Text size="md" weight="bold">
            {dayjs(data?.date).format('DD/MM/YYYY')}
          </Text>
          <Text>
            Ownership: {seller ? truncateMiddle(seller) : 'Has no owner'}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default MarketItem;
