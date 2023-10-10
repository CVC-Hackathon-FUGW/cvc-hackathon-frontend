import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { contractMortgage } from 'src/configs/contract';
import useImageUploader from 'src/hooks/useImageUploader';
import api from 'src/services/api';
import { Pool } from 'src/types';
import { Address, useContractWrite, useWaitForTransaction } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

interface CreatePoolProps {
  opened: boolean;
  close: () => void;
}

const CreatePool = ({ opened, close }: CreatePoolProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      collection_name: '',
      tokenAddress: '',
      duration: 0,
      APY: 0,
    },
  });

  const {
    writeAsync: create,
    isLoading,
    data,
  } = useContractWrite({
    ...contractMortgage,
    functionName: 'CreatePool',
  });
  const { ImageInput, uploadImage, isLoading: uploading } = useImageUploader();

  const { mutateAsync: createPool } = useMutation({
    mutationKey: ['create-pool'],
    mutationFn: (params: Pool) => api.post('/pools', params),
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: close,
  });

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Create Pool"
        position="right"
      >
        <form
          onSubmit={onSubmit(
            async ({ tokenAddress, APY, duration, collection_name }) => {
              const image = await uploadImage();

              if (image) {
                const data = await create?.({
                  args: [tokenAddress, BigInt(APY), BigInt(duration)],
                });
                await waitForTransaction({
                  hash: data?.hash,
                });
                await createPool({
                  apy: BigInt(APY),
                  duration: BigInt(duration),
                  collection_name,
                  image,
                  is_active: true,
                  state: true,
                  token_address: tokenAddress as Address,
                  total_pool_amount: 0n,
                });
              }
            }
          )}
          className="flex flex-col gap-4"
        >
          <ImageInput />
          <TextInput
            label="Collection name"
            {...getInputProps('collection_name', {
              type: 'input',
            })}
          />
          <TextInput
            label="Token address"
            {...getInputProps('tokenAddress', {
              type: 'input',
            })}
          />
          <TextInput
            label="APY"
            type="number"
            {...getInputProps('APY', {
              type: 'input',
            })}
          />
          <TextInput
            label="Duration"
            type="number"
            {...getInputProps('duration', {
              type: 'input',
            })}
          />
          <Group position="right">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Drawer>
      <LoadingOverlay visible={isLoading || uploading} overlayBlur={2} />
    </>
  );
};

export default CreatePool;
