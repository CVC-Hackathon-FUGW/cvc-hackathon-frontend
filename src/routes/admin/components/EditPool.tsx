import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { contractMortgage } from 'src/configs/contract';
import api from 'src/services/api';
import { Pool } from 'src/types';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

interface EditPoolProps {
  opened: boolean;
  close: () => void;
  editingPool: Pool | null;
}

const EditPool = ({ opened, close, editingPool }: EditPoolProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      APY: Number(editingPool?.apy),
      duration: Number(editingPool?.duration),
      state: editingPool?.state,
      collection_name: editingPool?.collection_name,
    },
  });

  const { mutateAsync: updatePool } = useMutation({
    mutationKey: ['update-pool'],
    mutationFn: (params: Pool) => api.patch('/pools', params),
  });

  const {
    writeAsync: update,
    isLoading,
    data,
  } = useContractWrite({
    ...contractMortgage,
    functionName: 'UpdatePool',
  });
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: close,
  });

  return (
    <Drawer opened={opened} onClose={close} title="Edit Pool" position="right">
      <form
        onSubmit={onSubmit(
          async ({ APY, duration, state, collection_name }) => {
            const _poolId = editingPool?.pool_id;

            const data = await update?.({
              args: [_poolId, BigInt(APY), BigInt(duration), state],
            });
            await waitForTransaction({
              hash: data?.hash,
            });
            updatePool({
              ...editingPool,
              apy: BigInt(APY),
              duration: BigInt(duration),
              collection_name,
              state,
            });
          }
        )}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Collection name"
          {...getInputProps('collection_name', {
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
        <Switch
          label="State"
          {...getInputProps('state', {
            type: 'checkbox',
          })}
        />
        {/* TODO: add image upload */}
        <Group position="right">
          <Button type="submit">Create</Button>
        </Group>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
      </form>
    </Drawer>
  );
};

export default EditPool;
