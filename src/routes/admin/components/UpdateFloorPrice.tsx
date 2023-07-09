import { Button, LoadingOverlay, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import React from 'react';
import { contractMortgage } from 'src/configs/contract';
import { formatEther, parseEther } from 'viem';
import { useContractRead, useContractWrite } from 'wagmi';

const UpdateFloorPrice = ({ tokenAddress }: { tokenAddress: string }) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      floorPrice: '',
    },
  });

  const { data: currentFloorPrice } = useContractRead<
    unknown[],
    'getFloorPrice',
    bigint
  >({
    ...contractMortgage,
    functionName: 'getFloorPrice',
    args: [tokenAddress],
  });

  const { write, isLoading } = useContractWrite({
    ...contractMortgage,
    functionName: 'setFloorPrice',
    onSuccess: () => modals.closeAll(),
  });
  return (
    <form
      onSubmit={onSubmit(async ({ floorPrice }) => {
        const floorPriceGwei = parseEther(floorPrice);
        write({
          args: [tokenAddress, floorPriceGwei],
        });
      })}
    >
      <Text>
        Current Floor Price:{' '}
        {currentFloorPrice ? formatEther(currentFloorPrice) : '-'}
      </Text>
      <TextInput
        placeholder="New Price"
        data-autofocus
        type="number"
        {...getInputProps('floorPrice', {
          type: 'input',
        })}
      />
      <Button fullWidth type="submit" mt="md">
        Submit
      </Button>
      <LoadingOverlay visible={isLoading} />
    </form>
  );
};

export default UpdateFloorPrice;
