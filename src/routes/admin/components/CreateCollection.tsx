import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import useImageUploader from 'src/hooks/useImageUploader';
import api from 'src/services/api';

interface CreateCollectionProps {
  opened: boolean;
  close: () => void;
}

const CreateCollection = ({ opened, close }: CreateCollectionProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      collection_name: '',
      token_address: '',
    },
  });

  const { ImageInput, uploadImage, isLoading: uploading } = useImageUploader();

  const { mutate, isLoading } = useMutation({
    mutationKey: ['create-collection'],
    mutationFn: ({
      collection_name,
      token_address,
      image,
    }: {
      collection_name: string;
      token_address: string;
      image: string;
    }) =>
      api.post('/marketCollections', {
        collection_name,
        token_address,
        image,
      }),
    onSuccess: close,
  });

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title="Create Collection"
      position="right"
    >
      <ImageInput />
      <form
        onSubmit={onSubmit(async ({ collection_name, token_address }) => {
          const image = await uploadImage();

          if (image) {
            mutate({ collection_name, token_address, image });
          }
        })}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Collection Name"
          {...getInputProps('collection_name', {
            type: 'input',
          })}
        />
        <TextInput
          label="Token Address"
          {...getInputProps('token_address', {
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

export default CreateCollection;
