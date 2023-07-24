import { Badge, Button, Card, Group, Input, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { PayPalMarks } from '@paypal/react-paypal-js';
import { useState } from 'react';
import PayPalMerchantId from 'src/components/common/PayPalMerchantId';
import {
  addressCheckIn,
  addressEvent,
  contractCheckIn,
} from 'src/configs/contract';
import { sellerRedirectUrl } from 'src/configs/payment';
import useMerchantId from 'src/hooks/useMerchantId';
import dayjs from 'src/utils/dayjs';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import Event from './components/Event';
import useNftDetector from 'src/hooks/useNftDetector';
import NFTCard from 'src/components/Marketplace/NFTCard';

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
  const nftIds = useNftDetector(addressEvent, addressCheckIn);
  console.log(nftIds);

  return (
    <div className="container flex flex-col gap-4">
      <Card shadow="sm" padding="sm" radius="md">
        <Group position="right">
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
        </Group>
      </Card>
      <Group position="center">
        <Text weight="bold" size="2rem">
          Event
        </Text>
      </Group>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          shadow="sm"
          padding="sm"
          radius="md"
          className="flex flex-col gap-2"
        >
          <Event />
        </Card>
        <div className="flex flex-col gap-4">
          <Group position="apart">
            <Text size="xl" weight="bold">
              TASK
            </Text>
            <Group position="apart">
              <Text size="sm" color="dimmed">
                EARNED
              </Text>
              <Text variant="gradient" weight="bold">
                {balance} RENT
              </Text>
            </Group>
          </Group>
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            className="flex flex-col gap-2"
          >
            <Text size="sm">
              Click check in button to claim 100 RENT per day
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
                  {dayjs.duration(count, 'seconds').format('D[d] H[h] m[m]')}{' '}
                  left
                </Badge>
              ) : (
                <Badge>You can check in now</Badge>
              )}
            </Group>
          </Card>
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            className="col-span-2 flex flex-col"
          >
            <Text size="xl" weight="bold">
              Exchange to gift
            </Text>
            <form
              className="flex flex-col gap-3 mt-1"
              onSubmit={onSubmit(({ amount }) => {
                exchangeToGift({
                  args: [BigInt(amount)],
                });
              })}
            >
              <Input.Wrapper label="Enter amount of RENT">
                <Input
                  min={1000}
                  max={balance}
                  type="number"
                  placeholder="Enter amount to exchange"
                  {...getInputProps('amount', {
                    type: 'input',
                  })}
                />
              </Input.Wrapper>

              <Group position="center">
                <Button variant="gradient" type="submit">
                  Exchange
                </Button>
              </Group>
            </form>
          </Card>
        </div>
        <Card
          shadow="sm"
          padding="sm"
          radius="md"
          className="col-span-2 flex flex-col"
        >
          <Text size="xl" weight="bold">
            Reward
          </Text>
          <Text size="sm" weight="bold" color="dimmed">
            2 XCR and 20 Nine NFTs in reward for this event.
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            {nftIds?.map((tokenId) => (
              <NFTCard
                key={tokenId.toString()}
                tokenId={tokenId}
                nftContract={addressEvent}
                height="10rem"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
