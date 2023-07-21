import { Avatar, Button, Image, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShowAddress from 'src/components/common/ShowAddress';
import { abiNft, contractMarket } from 'src/configs/contract';
import { getNftSrc } from 'src/helpers/get-nft-src';
import api from 'src/services/api';
import { Collection, MarketItemData, NftMetadata } from 'src/types';
import { xrcRate } from 'src/utils/contains';
import dayjs from 'src/utils/dayjs';
import { formatEther, parseEther, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

const MarketItem = () => {
  const { itemId } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();

  const { data: marketItem } = useQuery<MarketItemData>({
    queryKey: ['MarketItemData', itemId],
    queryFn: async () => api.get(`/marketItems/${itemId}`),
    enabled: !!itemId,
  });

  const {
    token_id,
    address: nftContract,
    seller,
    price,
    sold,
    is_offerable,
    current_offer_value,
    current_offerer,
    accept_visa_payment,
    merchant_id,
  } = {
    ...marketItem,
  };

  const { data: uri } = useContractRead<unknown[], 'tokenURI', string>({
    address: nftContract,
    abi: abiNft,
    functionName: 'tokenURI',
    args: [token_id],
    enabled: !!token_id && !!nftContract,
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
      numCurrentOfferValue: Number(formatEther(current_offer_value || 0n)),
    };
  }, [address, seller, current_offer_value]);

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      offer: numCurrentOfferValue,
    },
    validate: {
      offer: (value) =>
        Number(value) < numCurrentOfferValue
          ? 'New offer must be higher than current offer'
          : null,
    },
  });

  const { data: collection } = useQuery({
    queryKey: ['get-marketItems'],
    queryFn: () => api.get<void, Collection[]>('/marketCollections'),
    initialData: [],
    select: (data) =>
      data?.find(({ token_address }) => token_address === nftContract),
  });

  const { writeAsync: buyNft } = useContractWrite({
    ...contractMarket,
    functionName: 'Buy',
    account: address,
  });
  const { writeAsync: instantBuy } = useContractWrite({
    ...contractMarket,
    functionName: 'InstantBuy',
  });

  const { writeAsync: offerNft } = useContractWrite({
    ...contractMarket,
    functionName: 'OfferMarketItem',
    account: address,
  });

  const { writeAsync: acceptOffer } = useContractWrite({
    ...contractMarket,
    functionName: 'AcceptOffer',
  });
  const { writeAsync: cancelListing } = useContractWrite({
    ...contractMarket,
    functionName: 'CancelListing',
  });

  const { mutateAsync: deleteMarketItem } = useMutation({
    mutationKey: ['deleteMarketItem'],
    mutationFn: (id: number) => api.delete(`/marketItems/${id}`),
    onSuccess: () => navigate(-1),
  });
  const { mutateAsync: updateMarketItem } = useMutation({
    mutationKey: ['updateMarketItem'],
    mutationFn: (params: MarketItemData) => api.patch(`/marketItems`, params),
  });
  const { mutateAsync: updateCollection } = useMutation({
    mutationKey: ['updateMarketItem'],
    mutationFn: (params: Partial<Collection>) =>
      api.patch(`/marketCollections`, params),
  });

  console.log(merchant_id);

  return (
    <div className="container grid place-items-center">
      <div className="flex flex-row gap-6">
        <div className="w-72 flex flex-col gap-4">
          <Image src={getNftSrc(data?.image)} alt="Norway" radius="sm" />
          {isOwner ? (
            <div className="flex flex-col gap-2">
              <Text>You are selling this item</Text>
              {is_offerable && (
                <>
                  <Text>
                    Current offer:{' '}
                    {Number(current_offer_value) > 0
                      ? numCurrentOfferValue
                      : 'No offer yet'}
                  </Text>
                  <ShowAddress
                    address={
                      current_offerer === zeroAddress
                        ? 'Be the first!'
                        : current_offerer
                    }
                    canBeCopied={current_offerer !== zeroAddress}
                  >
                    Current offerer:
                  </ShowAddress>
                  <Button
                    disabled={sold || numCurrentOfferValue === 0}
                    onClick={async () => {
                      await acceptOffer({
                        args: [nftContract, itemId],
                      });
                      await deleteMarketItem(Number(itemId));
                      if (collection?.collection_id && current_offer_value) {
                        await updateCollection({
                          collection_id: collection?.collection_id,
                          volume:
                            BigInt(collection?.volume) +
                            BigInt(current_offer_value),
                        });
                      }
                    }}
                  >
                    Accept Offer ({numCurrentOfferValue} XCR)
                  </Button>
                </>
              )}
              <Button
                color="red"
                disabled={sold}
                onClick={async () => {
                  await cancelListing({
                    args: [nftContract, itemId],
                  });
                  await deleteMarketItem(Number(itemId));
                }}
              >
                Cancel Listing
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Button
                disabled={sold}
                onClick={async () => {
                  if (!price) return;
                  await buyNft({
                    value: BigInt(price),
                    args: [nftContract, itemId],
                  });
                  await deleteMarketItem(Number(itemId));
                  if (collection?.collection_id && price) {
                    await updateCollection({
                      collection_id: collection?.collection_id,
                      volume: BigInt(collection?.volume) + BigInt(price),
                    });
                  }
                }}
              >
                Buy
              </Button>
              {is_offerable && (
                <form
                  className="flex flex-col gap-1"
                  onSubmit={onSubmit(async ({ offer }) => {
                    const value = parseEther(offer.toString());
                    await offerNft({
                      value,
                      args: [itemId],
                    });

                    await updateMarketItem({
                      item_id: Number(itemId),
                      current_offer_value: value,
                      current_offerer: address,
                    });
                  })}
                >
                  <Text>
                    Current offer:{' '}
                    {Number(current_offer_value) > 0
                      ? numCurrentOfferValue
                      : 'No offer yet'}
                  </Text>
                  <ShowAddress
                    address={
                      current_offerer === zeroAddress
                        ? 'Be the first!'
                        : current_offerer
                    }
                    canBeCopied={current_offerer !== zeroAddress}
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
              {accept_visa_payment && (
                <PayPalButtons
                  createOrder={(_, actions) => {
                    if (!price || !merchant_id)
                      return Promise.reject({
                        name: 'Price or merchant id is not defined',
                      });
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            value: (
                              Number(formatEther(price || 0n)) * xrcRate
                            ).toFixed(2),
                          },
                          payee: {
                            merchant_id,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (_, actions) => {
                    await actions.order?.capture();
                    await instantBuy({
                      args: [nftContract, itemId, true],
                    });
                    await deleteMarketItem(Number(itemId));
                    if (collection?.collection_id && price) {
                      await updateCollection({
                        collection_id: collection?.collection_id,
                        volume: BigInt(collection?.volume) + BigInt(price),
                      });
                    }
                  }}
                  onError={(err: any) =>
                    notifications.show({
                      message: err.name,
                      color: 'red',
                    })
                  }
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-1">
            <Avatar size="lg" radius="xl" src={collection?.image} />
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
