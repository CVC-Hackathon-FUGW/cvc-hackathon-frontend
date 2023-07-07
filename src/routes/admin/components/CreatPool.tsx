import { Button, Drawer, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { contractMortgage } from 'src/configs/contract';
import { useContractWrite } from 'wagmi';

interface CreatePoolProps {
  opened: boolean;
  close: () => void;
}

const CreatePool = ({ opened, close }: CreatePoolProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      _tokenAddress: '',
      _APY: 0,
      _duration: 0,
    },
  });

  const { write } = useContractWrite({
    ...contractMortgage,
    functionName: 'CreatePool',
  });

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title="Create Pool"
      position="right"
    >
      <form
        onSubmit={onSubmit(({ _tokenAddress, _APY, _duration }) => {
          write?.({
            args: [_tokenAddress, BigInt(_APY), BigInt(_duration)],
          });
        })}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Token address"
          {...getInputProps('_tokenAddress', {
            type: 'input',
          })}
        />
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
        <Group position="right">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </Drawer>
  );
};

export default CreatePool;
