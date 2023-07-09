import {
  Avatar,
  Button,
  Divider,
  Input,
  Modal,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMemo } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Pool } from 'src/types';
import { formatEther, parseEther } from 'viem';
import {
  useAccount,
  useBalance,
  useContractRead,
  useWalletClient,
} from 'wagmi';
import { getPublicClient } from 'wagmi/actions';

interface ModalLendProps {
  opened: boolean;
  close: () => void;
  data?: Pool;
}

export default function ModalLend({ opened, close, data }: ModalLendProps) {
  const { APY, duration, image, poolId, tokenAddress } = {
    ...data,
  };
  const { address } = useAccount();
  const { data: balance } = useBalance({ address, enabled: opened });
  const { data: walletClient } = useWalletClient();
  const publicClient = getPublicClient();

  const { data: floorPriceGwei } = useContractRead({
    ...contractMortgage,
    functionName: 'getFloorPrice',
    args: [tokenAddress],
    enabled: opened,
  });
  const floorPrice = useMemo(() => {
    if (floorPriceGwei) {
      return Number(formatEther(floorPriceGwei as bigint));
    }
    return 0;
  }, [floorPriceGwei]);

  const { onSubmit, getInputProps, values } = useForm({
    initialValues: {
      offerAmount: 0,
    },
  });

  const interest = useMemo(() => {
    return Number(
      calculateInterest(
        Number(values.offerAmount),
        Number(APY),
        Number(duration)
      )
    );
  }, [APY, duration, values.offerAmount]);

  const handleLend = async ({ offerAmount = 0 }) => {
    try {
      const value = parseEther(offerAmount.toString());
      const { request } = await publicClient.simulateContract({
        ...contractMortgage,
        functionName: 'LenderOffer',
        value,
        args: [poolId],
        account: address,
      });

      await walletClient?.writeContract(request);
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal opened={opened} onClose={close}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar size="lg" src={image} radius="xl" alt="it's me" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Title order={3}>{truncateMiddle(tokenAddress)}</Title>
      </div>
      <div style={{ padding: '15px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Text color="grey" weight={600}>
              APY
            </Text>
            <Text color="green" weight={700} size="26px">
              {Number(APY)}%
            </Text>
          </div>
          <div>
            <Text color="grey" weight={600}>
              DURATION
            </Text>
            <Text weight={700} size="26px">
              {Number(duration)}d
            </Text>
          </div>
          <div>
            <Text color="grey" weight={600}>
              FLOOR
            </Text>
            <Text weight={700} size="26px">
              {floorPrice}
            </Text>
          </div>
        </div>
        <Divider my="sm" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '15px',
          }}
        >
          <div>
            <Text weight={500} pb={10}>
              Offer Amount
            </Text>
            <Input
              type="number"
              {...getInputProps('offerAmount', {
                type: 'input',
              })}
              min={floorPrice}
              placeholder="Enter Amount"
            />
          </div>
          <div>
            <Text weight={500} pb={10}>
              Total Interest
            </Text>
            <Text weight={600}>XCR {interest}</Text>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '20px',
          }}
        >
          <Text weight={500}>Your total is {values.offerAmount}</Text>
          <Text weight={500}>You have XCR {balance?.formatted}</Text>
        </div>
        <Button
          fullWidth
          color="red"
          mt={30}
          onClick={() => onSubmit(handleLend)()}
        >
          Place Offer
        </Button>
        <Text color="grey" size="12px" mt={20}>
          Offers can be revoked any time up until it is taken by a borrower.
        </Text>
      </div>
    </Modal>
  );
}
