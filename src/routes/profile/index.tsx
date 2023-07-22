import { Badge, Button, Card, Group, Input, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { PayPalMarks } from '@paypal/react-paypal-js';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import PayPalMerchantId from 'src/components/common/PayPalMerchantId';
import ShowAddress from 'src/components/common/ShowAddress';
import { addressCheckIn, contractCheckIn } from 'src/configs/contract';
import { sellerRedirectUrl } from 'src/configs/payment';
import useMerchantId from 'src/hooks/useMerchantId';
import dayjs from 'src/utils/dayjs';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

const Profile = () => {
  const { address } = useAccount();
  const [count, setCount] = useState(0);
  const { start } = useInterval(() => setCount((prev) => prev - 1), 1000 * 60);
  const merchantId = useMerchantId();

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
    <div
      className="container grid grid-cols-3 gap-4"
      style={{ padding: '20px 70px' }}
    >
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        className="flex flex-col gap-4"
      >
        {merchantId ? (
          <PayPalMerchantId merchantId={merchantId} size="lg" />
        ) : (
          <Button
            variant="light"
            component="a"
            href={sellerRedirectUrl}
            target="_blank"
          >
            Sign up for
            <PayPalMarks fundingSource="paypal" />
          </Button>
        )}
      </Card>

      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        className="col-span-2 flex flex-col gap-4"
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
          You can check in once a day. Each time you check in, you will receive
          100 RENT, and you can use RENT to exchange to XCR, NFT and so much
          gifts will be added later.
        </Text>
        <Group position="center" className="flex flex-row gap-4">
          <Button
            variant="gradient"
            onClick={() => checkin()}
            disabled={count > 0}
          >
            Check in
          </Button>
          {count > 0 ? (
            <Badge>
              {dayjs.duration(count, 'seconds').format('D[d] H[h] m[m]')} left
            </Badge>
          ) : (
            <Badge>You can check in now</Badge>
          )}
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

export default Profile;

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
