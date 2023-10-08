import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { addressCheckIn, contractRaiseFund } from 'src/configs/contract';
import useImageUploader from 'src/hooks/useImageUploader';
import api from 'src/services/api';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';
import { DatePickerInput } from '@mantine/dates';
import { parseEther } from 'viem';
import dayjs from 'src/utils/dayjs';

interface CreateProjectProps {
  opened: boolean;
  close: () => void;
}

const CreateProject = ({ opened, close }: CreateProjectProps) => {
  const { address: project_owner } = useAccount();

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      project_name: '',
      project_description: '',
      total_raise_amount_num: '0',
      due_time_string: '',
    },
  });

  const {
    writeAsync: create,
    isLoading,
    data,
  } = useContractWrite({
    ...contractRaiseFund,
    functionName: 'createRaiseFund',
  });

  const { ImageInput, uploadImage, isLoading: uploading } = useImageUploader();

  const { mutateAsync: createProject } = useMutation({
    mutationKey: ['create-project'],
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
        onSubmit={onSubmit(
          async ({
            due_time_string,
            total_raise_amount_num,
            project_name,
            project_description,
          }) => {
            const project_image = await uploadImage();
            const total_raise_amount = parseEther(total_raise_amount_num);
            const due_time = dayjs(due_time_string).unix();

            if (project_image) {
              await create?.({
                args: [
                  project_owner,
                  addressCheckIn,
                  total_raise_amount,
                  due_time,
                  project_name,
                ],
              });

              watchContractEvent(
                {
                  ...contractRaiseFund,
                  eventName: 'ContractCreated',
                },
                (logs: any[]) => {
                  const project_address = logs?.at(0)?.args?.contractAddress;
                  return createProject({
                    project_address,
                    total_raise_amount,
                    due_time,
                    project_name,
                    project_description,
                    project_owner,
                    project_image,
                    total_fund_raised: 0,
                  });
                }
              );
            }
          }
        )}
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
          {...getInputProps('total_raise_amount_num', {
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
          {...getInputProps('due_time_string', {
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
