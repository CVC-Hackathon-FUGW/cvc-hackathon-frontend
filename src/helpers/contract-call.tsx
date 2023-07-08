import { notifications } from '@mantine/notifications';

export const onError = (error: any) =>
  notifications.show({
    title: error.name,
    message: error.message,
    color: 'red',
  });
