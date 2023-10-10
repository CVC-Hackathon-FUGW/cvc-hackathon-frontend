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
import { Project } from 'src/types';

interface CreatePackageProps {
  opened: boolean;
  close: () => void;
  editingProject?: Project | null;
}

const CreatePackage = ({
  opened,
  close,
  editingProject,
}: CreatePackageProps) => {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      package_name: '',
      package_description: '',
      package_price: '0',
    },
  });

  const { ImageInput, uploadImage, isLoading: uploading } = useImageUploader();

  const { mutateAsync: createPackage, isLoading: creating } = useMutation({
    mutationKey: ['create-package'],
    mutationFn: (params: any) => api.post('/package', params),
    onSuccess: close,
  });

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Create Package"
        position="right"
      >
        <form
          onSubmit={onSubmit(
            async ({ package_name, package_description, package_price }) => {
              const package_image = await uploadImage();

              if (package_image && editingProject) {
                return createPackage({
                  package_image,
                  package_name,
                  package_description,
                  package_price: parseInt(package_price),
                  project_name: editingProject.project_name,
                  project_address: editingProject.project_address,
                  project_id: editingProject.project_id,
                });
              }
            }
          )}
          className="flex flex-col gap-4"
        >
          <ImageInput />
          <TextInput
            label="Package Name"
            {...getInputProps('package_name', {
              type: 'input',
            })}
          />
          <TextInput
            label="Package Price"
            {...getInputProps('package_price', {
              type: 'input',
            })}
            type="number"
          />
          <TextInput
            label="Package Description"
            {...getInputProps('package_description', {
              type: 'input',
            })}
            multiple
          />
          <Group position="right">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Drawer>
      <LoadingOverlay visible={uploading || creating} overlayBlur={2} />
    </>
  );
};

export default CreatePackage;
