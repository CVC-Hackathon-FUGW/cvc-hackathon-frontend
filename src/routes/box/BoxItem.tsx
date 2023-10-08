import { Button, Image, Text, Title } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import BoxCollectionCard, { BoxCard } from 'src/components/Box/BoxCard';
import { abiBoxInside, boxPrice } from 'src/configs/contract';
import api from 'src/services/api';
import { Box, BoxCollection } from 'src/types';
import { formatEther } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

const BoxItem = () => {
  const { itemId } = useParams();
  const { address } = useAccount();

  const { data: boxItem } = useQuery<BoxCollection>({
    queryKey: ['boxCollection', itemId],
    queryFn: async () => api.get(`/boxCollection/${itemId}`),
    enabled: !!itemId,
  });
  const { data: ownedBoxes } = useQuery<Box[]>({
    queryKey: ['ownedBoxes', boxItem?.box_collection_address],
    queryFn: async () =>
      api.get(`/box/address/${boxItem?.box_collection_address}`),
    enabled: !!boxItem?.box_collection_address,
    select: (data) =>
      data?.filter((item) => item.owner === address && !item.is_opened),
  });

  console.log(ownedBoxes);

  const { writeAsync: mintBox } = useContractWrite({
    address: boxItem?.box_collection_address,
    abi: abiBoxInside,
    functionName: 'mintBox',
    account: address,
  });

  const { mutateAsync: createBox } = useMutation({
    mutationKey: ['create-box'],
    mutationFn: (params: any) => api.post('/box', params),
  });

  return (
    <div className="container grid place-items-center gap-8">
      <div className="flex flex-row gap-6">
        <div className="w-72 flex flex-col gap-4">
          <Image src={'/box.png'} alt="Norway" radius="sm" />

          <div className="flex flex-col gap-4">
            <Button
              onClick={async () => {
                if (!itemId) return;
                const data = await mintBox({ value: BigInt(boxPrice) });

                await waitForTransaction({
                  hash: data?.hash,
                });
                await createBox({
                  box_price: boxPrice,
                  box_address: boxItem?.box_collection_address,
                  is_opened: false,
                  owner: address,
                });
              }}
            >
              Buy
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Text size="xl" weight="bolder">
            Mystery Box
          </Text>
          <Text size="lg" weight="bold">
            XCR {formatEther(boxPrice)}
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Title>Your Boxes</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {ownedBoxes?.map((box) => (
            <BoxCard key={Number(box.box_id)} box={box} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxItem;
