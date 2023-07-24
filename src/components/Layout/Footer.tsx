import { ActionIcon, Footer, Group, Text, rem } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandTelegram,
  IconBrandTwitter,
} from '@tabler/icons-react';

const FOOTER_HEIGHT = rem(60);

const MyFooter = () => {
  return (
    <Footer height={FOOTER_HEIGHT}>
      <Group position="center" noWrap className="h-full">
        <Text size="sm" color="dimmed">
          Connect with us:
        </Text>
        <ActionIcon component="a" href="https://twitter.com" target="_blank">
          <IconBrandTwitter size="2rem" />
        </ActionIcon>
        <ActionIcon
          component="a"
          href="https://t.me/hoanglh1311"
          target="_blank"
        >
          <IconBrandTelegram size="2rem" />
        </ActionIcon>
        <ActionIcon
          component="a"
          href="https://fb.com/hlee4real"
          target="_blank"
        >
          <IconBrandFacebook size="2rem" />
        </ActionIcon>
      </Group>
      <div />
    </Footer>
  );
};

export default MyFooter;
