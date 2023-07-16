import { Avatar, Text } from '@mantine/core';
import { tempImage } from 'src/utils/contains';

interface Props {
  img?: string;
  name?: string;
}

export default function Collection({ name, img }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <Avatar size="lg" src={img || tempImage} radius="xl" alt="it's me" />
      <Text size="xl" weight={700}>
        {name}
      </Text>
    </div>
  );
}
