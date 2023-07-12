import { Button, Group, Image, Text, createStyles, rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useCallback, useRef, useState } from 'react';
import { storage } from 'src/utils/firebase';

const useImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<File>();
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);

  const ImageInput = useCallback(
    () => (
      <div className="relative mb-10 min-h-[15rem]">
        <Dropzone
          openRef={openRef}
          onDrop={(file) => setSelectedImage(file?.[0])}
          className={`absolute z-10 w-full h-full hover:opacity-80 ${
            selectedImage ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300 grid place-items-center`}
          radius="md"
          multiple={false}
          accept={IMAGE_MIME_TYPE}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group position="center">
              <Dropzone.Accept>
                <IconDownload
                  size={rem(50)}
                  color={theme.colors[theme.primaryColor][6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={rem(50)}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  size={rem(50)}
                  color={
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[0]
                      : theme.black
                  }
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
              <Dropzone.Idle>Upload resume</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only
              image files that are less than 30mb in size.
            </Text>
          </div>
        </Dropzone>
        <Button
          className={classes.control}
          size="md"
          radius="xl"
          onClick={() => openRef.current?.()}
        >
          Select files
        </Button>

        <Image
          src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
          radius="md"
        />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedImage]
  );

  const { mutateAsync: uploadImage, ...rest } = useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: async () => {
      if (!selectedImage) return null;
      const formData = new FormData();
      formData.append('image', selectedImage);

      const storageRef = ref(storage, `/public/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const url = await getDownloadURL(storageRef);
      return url;
    },
  });

  return { ImageInput, uploadImage, ...rest };
};

export default useImageUploader;

const useStyles = createStyles((theme) => ({
  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
    zIndex: 20,
  },
}));
