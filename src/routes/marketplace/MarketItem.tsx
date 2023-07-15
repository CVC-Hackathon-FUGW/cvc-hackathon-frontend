import { Avatar, Button, Image, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ShowAddress from 'src/components/common/ShowAddress';
import { abiNft, contractMarket } from 'src/configs/contract';
import { getNftSrc } from 'src/helpers/get-nft-src';
import { ContractNft, NftMetadata } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther, parseEther, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

const MarketItem = () => {
  const { itemId } = useParams();
  const { address } = useAccount();

  const { data: marketItem } = useContractRead<
    unknown[],
    'GetMarketItem',
    ContractNft
  >({
    ...contractMarket,
    functionName: 'GetMarketItem',
    args: [BigInt(Number(itemId)!)],
    enabled: !!itemId,
  });
  const {
    tokenId,
    nftContract,
    seller,
    price,
    sold,
    isOfferable,
    currentOfferValue,
    currentOfferer,
  } = {
    ...marketItem,
  };

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

  const { isOwner, numCurrentOfferValue } = useMemo(() => {
    return {
      isOwner: seller === address,
      numCurrentOfferValue: Number(formatEther(currentOfferValue || 0n)),
    };
  }, [address, seller, currentOfferValue]);

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      offer: numCurrentOfferValue,
    },
    validate: {
      offer: (value) =>
        Number(value) < numCurrentOfferValue
          ? 'Offer must be higher than current offer'
          : null,
    },
  });

  const { write: buyNft } = useContractWrite({
    ...contractMarket,
    functionName: 'Buy',
    account: address,
  });

  const { write: offerNft } = useContractWrite({
    ...contractMarket,
    functionName: 'OfferMarketItem',
    account: address,
  });

  const { write: acceptOffer } = useContractWrite({
    ...contractMarket,
    functionName: 'AcceptOffer',
  });
  const { write: cancelListing } = useContractWrite({
    ...contractMarket,
    functionName: 'CancelListing',
  });

  return (
    <div className="container grid place-items-center">
      <div className="flex flex-row gap-6">
        <div className="w-72 flex flex-col gap-4">
          <Image src={getNftSrc(data?.image)} alt="Norway" radius="sm" />
          {isOwner ? (
            <div className="flex flex-col gap-2">
              <Text>You are selling this item</Text>
              {isOfferable && (
                <>
                  <Text>
                    Current offer:{' '}
                    {Number(currentOfferValue) > 0
                      ? numCurrentOfferValue
                      : 'No offer yet'}
                  </Text>
                  <ShowAddress
                    address={
                      currentOfferer === zeroAddress
                        ? 'Be the first!'
                        : currentOfferer
                    }
                  >
                    Current offerer:
                  </ShowAddress>
                  <Button
                    disabled={sold || numCurrentOfferValue === 0}
                    onClick={() =>
                      acceptOffer({
                        args: [nftContract, marketItem?.itemId],
                      })
                    }
                  >
                    Accept Offer ({numCurrentOfferValue} XCR)
                  </Button>
                </>
              )}
              <Button
                color="red"
                disabled={sold}
                onClick={() =>
                  cancelListing({
                    args: [nftContract, marketItem?.itemId],
                  })
                }
              >
                Cancel Listing
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
              {isOfferable && (
                <form
                  className="flex flex-col gap-1"
                  onSubmit={onSubmit(({ offer }) => {
                    const value = parseEther(offer.toString());
                    return offerNft({
                      value,
                      args: [marketItem?.itemId],
                    });
                  })}
                >
                  <Text>
                    Current offer:{' '}
                    {Number(currentOfferValue) > 0
                      ? numCurrentOfferValue
                      : 'No offer yet'}
                  </Text>
                  <ShowAddress
                    address={
                      currentOfferer === zeroAddress
                        ? 'Be the first!'
                        : currentOfferer
                    }
                  >
                    Current offerer:
                  </ShowAddress>
                  <TextInput
                    label={'Offer'}
                    min={numCurrentOfferValue}
                    {...getInputProps('offer')}
                  />
                  <Button type="submit" color="teal" className="mt-1">
                    Offer
                  </Button>
                </form>
              )}
            </div>
          )}
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
          <ShowAddress address={seller || 'Has no owner'}>
            Ownership:
          </ShowAddress>
        </div>
      </div>
    </div>
  );
};

export default MarketItem;
