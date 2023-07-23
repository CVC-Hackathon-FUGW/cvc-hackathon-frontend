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
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractMortgage } from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import usePoolUpdate from 'src/hooks/usePoolUpdate';
import api from 'src/services/api';
import { Loan, Pool } from 'src/types';
import { formatEther, parseEther, zeroAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

interface ModalLendProps {
  opened: boolean;
  close: () => void;
  data?: Pool;
}

export default function ModalLend({ opened, close, data }: ModalLendProps) {
  const { apy, duration, image, pool_id, token_address, collection_name } = {
    ...data,
  };
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address, enabled: opened });

  const { data: floorPriceGwei } = useContractRead({
    ...contractMortgage,
    functionName: 'getFloorPrice',
    args: [token_address],
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
        Number(apy),
        Number(duration)
      )
    );
  }, [apy, duration, values.offerAmount]);

  const { mutateAsync: createLend } = useMutation({
    mutationKey: ['create-lend'],
    mutationFn: (params: Loan) => api.post('/loans', params),
  });

  const { pool, mutateAsync: updatePool } = usePoolUpdate({ id: pool_id });

  const { writeAsync: lend } = useContractWrite({
    ...contractMortgage,
    functionName: 'LenderOffer',
    account: address,
    onSuccess: () => {
      close();
      navigate('/offers');
    },
  });
  console.log(pool);

  const handleLend = async ({ offerAmount = 0 }) => {
    const value = parseEther(offerAmount.toString());
    const data = await lend({
      value,
      args: [pool_id],
    });
    await waitForTransaction({
      hash: data?.hash,
    });
    await createLend({
      amount: value,
      borrower: zeroAddress,
      lender: address,
      pool_id,
      duration,
      token_address,
      start_time: 0,
      token_id: 0,
      state: false,
    });
    await updatePool({
      pool_id,
      total_pool_amount:
        BigInt(pool?.total_pool_amount?.toString() || '0') + value,
    });
  };

  return (
    <Modal opened={opened} onClose={close}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar size="lg" src={image} radius="xl" alt="it's me" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Title order={3}>{collection_name}</Title>
      </div>
      <div style={{ padding: '15px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Text color="grey" weight={600}>
              APY
            </Text>
            <Text color="green" weight={700} size="26px">
              {Number(apy)}%
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
