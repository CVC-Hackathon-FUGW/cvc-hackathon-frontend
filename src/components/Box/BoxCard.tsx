import { Avatar, Card, Group, Image, Text } from '@mantine/core';
import { getNftSrc } from 'src/helpers/get-nft-src';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import 'src/styles/nft-card.css';
import { Box } from 'src/types';
import { zeroAddress } from 'viem';

interface NFTCardProps {
  box?: Box;
  onClick?: (nft: Partial<Box>) => void;
  height?: string;
}

const BoxCard = (props: NFTCardProps) => {
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
            className="absolute top-1/2"
          />
        </div>

        <div style={{ wordWrap: 'break-word' }} className="mt-6 p-5">
          <div className="flex justify-center text-xl font-bold mt-2">
            <Text className="content-center text-[#79699B]">
              {box?.name || 'Box Name'}
            </Text>
          </div>
          <div className="mt-4">
            <Text className="font-semibold text-gray-500">Address:</Text>
            <Text className="font-semibold">
              {truncateMiddle(box?.address || zeroAddress)}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BoxCard;
