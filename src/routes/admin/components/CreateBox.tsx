import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { contractBox } from 'src/configs/contract';
import useImageUploader from 'src/hooks/useImageUploader';
import api from 'src/services/api';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';

interface CreateBoxProps {
  opened: boolean;
  close: () => void;
}

const CreateBox = ({ opened, close }: CreateBoxProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      tokenAddress: '',
    },
  });

  const {
    writeAsync: create,
    isLoading,
    data,
  } = useContractWrite({
    ...contractBox,
    functionName: 'createBox',
  });

  const { ImageInput, uploadImage, isLoading: uploading } = useImageUploader();

  const { mutateAsync: createBox } = useMutation({
    mutationKey: ['create-box'],
    mutationFn: (params: any) => api.post('/boxCollection', params),
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: close,
  });

  return (
    <Drawer opened={opened} onClose={close} title="Create Box" position="right">
      <form
        onSubmit={onSubmit(async ({ tokenAddress }) => {
          const image = await uploadImage();

          if (image) {
            await create?.({
              args: [tokenAddress],
            });

            watchContractEvent(
              {
                ...contractBox,
                eventName: 'ContractCreated',
              },
              (logs: any[]) => {
                const box_collection_address = logs?.at(0)?.args?.newAddress;
                return createBox({
                  box_collection_address,
                  origin_address: tokenAddress,
                  image,
                });
              }
            );
          }
        })}
        className="flex flex-col gap-4"
      >
        <ImageInput />
        <TextInput
          label="Token address"
          {...getInputProps('tokenAddress', {
            type: 'input',
          })}
        />
        <Group position="right">
          <Button type="submit">Create</Button>
        </Group>
        <LoadingOverlay visible={isLoading || uploading} overlayBlur={2} />
      </form>
    </Drawer>
  );
};

export default CreateBox;
