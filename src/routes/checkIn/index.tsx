import { Badge, Button, Card, Group, Input, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import ShowAddress from 'src/components/common/ShowAddress';
import { addressCheckIn, contractCheckIn } from 'src/configs/contract';
import dayjs from 'src/utils/dayjs';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

const CheckIn = () => {
  const { address } = useAccount();
  const [count, setCount] = useState(0);
  const { start } = useInterval(() => setCount((prev) => prev - 1), 1000 * 60);

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      amount: 0,
    },
  });

  const { refetch } = useContractRead({
    ...contractCheckIn,
    functionName: 'lastCheckin',
    args: [address],
    enabled: !!address,
    onSuccess: (data) => {
      const lastCheckin = Number(data || 0n);
      if (lastCheckin > 0) {
        setCount(60 * 60 * 24 - (Math.floor(Date.now() / 1000) - lastCheckin));
        start();
      }
    },
  });
  const { data: balance } = useContractRead<unknown[], 'balanceOf', number>({
    ...contractCheckIn,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    select: (data: any) => Number(data || 0n),
    watch: true,
  });

  const { write: checkin, data } = useContractWrite({
    ...contractCheckIn,
    functionName: 'checkin',
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => refetch(),
  });

  const { write: exchangeToGift } = useContractWrite({
    ...contractCheckIn,
    functionName: 'exchangeToGift',
  });

  return (
    <div className="container flex flex-col gap-4">
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-row items-center justify-between">
          <Title order={1}>Check in</Title>
          <ShowAddress
            variant="gradient"
            weight="bold"
            address={addressCheckIn}
          >
            RENT:
          </ShowAddress>
        </div>
        <Text fz="lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
          libero eius quod quos eligendi dolores optio eaque voluptatem corporis
          maiores tempora ducimus exercitationem, recusandae dolorum molestias
          rem rerum sit ipsam.
        </Text>
        <Group position="center" className="flex flex-row gap-4">
          <Button
            variant="gradient"
            onClick={() => checkin()}
            disabled={count > 0}
          >
            Check in
          </Button>
          <Badge>
            {dayjs.duration(count, 'seconds').format('D[d] H[h] m[m]')} left
          </Badge>
        </Group>
        <form
          className="flex flex-col gap-8"
          onSubmit={onSubmit(({ amount }) => {
            exchangeToGift({
              args: [BigInt(amount)],
            });
          })}
        >
          <Group position="center">
            <Input
              min={1000}
              max={balance}
              type="number"
              placeholder="Enter amount to exchange"
              {...getInputProps('amount', {
                type: 'input',
              })}
            />
            <Text className="flex flex-row items-center gap-2">
              You have:
              <Text variant="gradient" weight="bold">
                {balance} RENT
              </Text>
            </Text>
          </Group>
          <Group position="center">
            <Button variant="gradient" type="submit">
              Exchange to gift
            </Button>
          </Group>
        </form>
      </Card>
      <DataTable
        records={convertRate}
        columns={[
          {
            accessor: 'state',
          },
          {
            accessor: 'reward',
          },
        ]}
      />
    </div>
  );
};

export default CheckIn;

const convertRate = [
  {
    state: '1000 <= amount RENT < 10000',
    reward: 'each 1000 RENT can be exchanged to 0.01 XCR',
  },
  {
    state: '10000 RENT',
    reward: 'A Random NFT',
  },
];
