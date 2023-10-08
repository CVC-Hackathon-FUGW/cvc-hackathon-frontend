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
import { DatePickerInput } from '@mantine/dates';

interface CreateProjectProps {
  opened: boolean;
  close: () => void;
}

const CreateProject = ({ opened, close }: CreateProjectProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      project_name: '',
      project_owner: '',
      project_description: '',
      total_raise_amount: 0,
      due_time: '',
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
    <Drawer
      opened={opened}
      onClose={close}
      title="Create Project"
      position="right"
    >
      <form
        onSubmit={onSubmit(async ({ due_time }) => {
          const image = await uploadImage();

          if (image) {
            await create?.({
              args: [],
            });

            // watchContractEvent(
            //   {
            //     ...contractBox,
            //     eventName: 'ContractCreated',
            //   },
            //   (logs: any[]) => {
            //     const box_collection_address = logs?.at(0)?.args?.newAddress;
            //     return createBox({
            //       box_collection_address,
            //       origin_address: ,
            //       image,
            //     });
            //   }
            // );
          }
        })}
        className="flex flex-col gap-4"
      >
        <ImageInput />
        <TextInput
          label="Project Name"
          {...getInputProps('project_name', {
            type: 'input',
          })}
        />
        <TextInput
          label="Project Owner"
          {...getInputProps('project_owner', {
            type: 'input',
          })}
        />
        <TextInput
          label="Total Raise Amount"
          {...getInputProps('total_raise_amount', {
            type: 'input',
          })}
          type="number"
        />
        <TextInput
          label="Project Description"
          {...getInputProps('project_description', {
            type: 'input',
          })}
        />
        <DatePickerInput
          label="Due Time"
          {...getInputProps('due_time', {
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

export default CreateProject;
