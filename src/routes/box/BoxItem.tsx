import { Button, Image, Text, Title } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { abiBoxInside, boxPrice } from 'src/configs/contract';
import api from 'src/services/api';
import { BoxCollection } from 'src/types';
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
  const { data: ownedBoxes } = useQuery<BoxCollection[]>({
    queryKey: ['ownedBoxes', boxItem?.box_collection_address],
    queryFn: async () =>
      api.get(`/box/address/${boxItem?.box_collection_address}`),
    enabled: !!boxItem?.box_collection_address,
    select: (data) => data,
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
      </div>
    </div>
  );
};

export default BoxItem;
