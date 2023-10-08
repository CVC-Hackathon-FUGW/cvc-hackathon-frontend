import { Avatar, Badge, Button, Card, Image, Text } from '@mantine/core';
import { abiBoxInside } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import 'src/styles/nft-card.css';
import { Box, BoxCollection } from 'src/types';
import { zeroAddress } from 'viem';
import { useContractWrite, useMutation } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

interface NFTCardProps {
  box?: BoxCollection;
  onClick?: (nft: Partial<BoxCollection>) => void;
  height?: string;
}

const BoxCollectionCard = (props: NFTCardProps) => {
  const { box, onClick } = props;
  return (
    <div className="card-container">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="cursor-pointer grid gap-1 card"
        onClick={() => onClick?.({ ...box })}
      >
        <div className="flex flex-col items-center justify-center relative">
          <div className="w-full h-24 bg-blue-300" />
          <Avatar
            src={box?.image}
            radius="100%"
            size="90px"
            className="absolute top-1/2 shadow"
          />
        </div>

        <div style={{ wordWrap: 'break-word' }} className="mt-6 p-5">
          <div className="flex justify-center text-xl font-bold mt-2">
            <Text className="content-center text-[#79699B]">
              {truncateMiddle(box?.box_collection_address) || 'Box Name'}
            </Text>
          </div>
          <div className="mt-4">
            <Text className="font-semibold text-gray-500">Address:</Text>
            <Text className="font-semibold">
              {truncateMiddle(box?.origin_address || zeroAddress)}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface BoxCardProps {
  box?: Box;
  height?: string;
}

export const BoxCard = (props: BoxCardProps) => {
  const { box } = props;

  const { writeAsync: revealBox, isLoading: isLoadingContract } =
    useContractWrite({
      address: box?.box_address,
      abi: abiBoxInside,
      functionName: 'revealBox',
    });

  const { mutateAsync: updateBox, isLoading } = useMutation({
    mutationKey: ['update-box'],
    mutationFn: (params: any) => api.patch('/box', params),
  });

  return (
    <div className="card-container">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="cursor-pointer grid gap-1 card"
      >
        <div className="flex flex-col items-center justify-center relative">
          <Image src={'/box.png'} alt="Norway" radius="sm" />
        </div>

        <div style={{ wordWrap: 'break-word' }} className="p-5">
          <Badge>#{box?.token_id.toString()}</Badge>
          <div className="flex justify-center text-xl font-bold mt-2">
            <Text className="content-center text-[#79699B]">
              {truncateMiddle(box?.box_address) || 'Box Name'}
            </Text>
          </div>
        </div>
        <Button
          fullWidth
          loading={isLoading || isLoadingContract}
          onClick={async () => {
            const data = await revealBox({
              args: [box?.token_id],
            });
            await waitForTransaction(data);
            await updateBox({
              box_id: box?.box_id,
              is_opened: true,
            });
          }}
        >
          Reveal box
        </Button>
      </Card>
    </div>
  );
};

export default BoxCollectionCard;
