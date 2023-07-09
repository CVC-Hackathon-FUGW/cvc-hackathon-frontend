import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { contractMortgage } from 'src/configs/contract';
import { Pool } from 'src/types';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

interface EditPoolProps {
  opened: boolean;
  close: () => void;
  editingPool: Pool | null;
  refetch: () => void;
}

const EditPool = ({ opened, close, editingPool, refetch }: EditPoolProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      _APY: Number(editingPool?.APY),
      _duration: Number(editingPool?.duration),
      _state: editingPool?.state,
    },
  });

  const { write, isLoading, data } = useContractWrite({
    ...contractMortgage,
    functionName: 'UpdatePool',
  });
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      refetch();
      close();
    },
  });

  return (
    <Drawer opened={opened} onClose={close} title="Edit Pool" position="right">
      <form
        onSubmit={onSubmit(({ _APY, _duration, _state }) => {
          const _poolId = editingPool?.poolId;
          console.log(_poolId, _APY, _duration, _state);
          write?.({
            args: [_poolId, BigInt(_APY), BigInt(_duration), _state],
          });
        })}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="APY"
          type="number"
          {...getInputProps('_APY', {
            type: 'input',
          })}
        />
        <TextInput
          label="Duration"
          type="number"
          {...getInputProps('_duration', {
            type: 'input',
          })}
        />
        <Switch
          label="State"
          {...getInputProps('_state', {
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
