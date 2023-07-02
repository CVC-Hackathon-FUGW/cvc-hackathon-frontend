import {
  Burger,
  Button,
  Center,
  Container,
  Group,
  Header,
  Menu,
  createStyles,
  rem,
} from '@mantine/core';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconChevronDown,
  IconCopy,
  IconCurrencyEthereum,
  IconPlugConnectedX,
} from '@tabler/icons-react';
import { useWeb3Modal } from '@web3modal/react';
import { useCallback, useEffect } from 'react';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';

const HEADER_HEIGHT = rem(60);

const links = [
  {
    link: '/about',
    label: 'Features',
  },
  {
    link: '#1',
    label: 'Learn',
    links: [
      {
        link: '/docs',
        label: 'Documentation',
      },
      {
        link: '/resources',
        label: 'Resources',
      },
      {
        link: '/community',
        label: 'Community',
      },
      {
        link: '/blog',
        label: 'Blog',
      },
    ],
  },
  {
    link: '/about',
    label: 'About',
  },
  {
    link: '/pricing',
    label: 'Pricing',
  },
  {
    link: '#2',
    label: 'Support',
    links: [
      {
        link: '/faq',
        label: 'FAQ',
      },
      {
        link: '/demo',
        label: 'Book a demo',
      },
      {
        link: '/forums',
        label: 'Forums',
      },
    ],
  },
];

const MyHeader = () => {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const { copy } = useClipboard();

  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains } = useSwitchNetwork();

  console.log('connected chain', chain);
  console.log('chains', chains);

  const handleCopyAddress = useCallback(() => {
    copy(address);
    notifications.show({
      message: 'Address copied to clipboard',
    });
  }, [copy, address]);

  useEffect(() => {
    if (chain?.unsupported) {
      notifications.show({
        message: `Unsupported network: ${chain.name}`,
        color: 'red',
      });
    }
  }, [chain, chains]);

  return (
    <Header height={HEADER_HEIGHT} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <IconCurrencyEthereum size={28} />
        </Group>
        <Group spacing={5} className={classes.links}>
          {links.map((link) => {
            const menuItems = link.links?.map((item) => (
              <Menu.Item key={item.link}>{item.label}</Menu.Item>
            ));

            if (menuItems) {
              return (
                <Menu
                  key={link.label}
                  trigger="hover"
                  transitionProps={{ exitDuration: 0 }}
                  withinPortal
                >
                  <Menu.Target>
                    <a
                      href={link.link}
                      className={classes.link}
                      onClick={(event) => event.preventDefault()}
                    >
                      <Center>
                        <span className={classes.linkLabel}>{link.label}</span>
                        <IconChevronDown size={rem(12)} stroke={1.5} />
                      </Center>
                    </a>
                  </Menu.Target>
                  <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
              );
            }

            return (
              <a
                key={link.label}
                href={link.link}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                {link.label}
              </a>
            );
          })}
        </Group>
        <Menu shadow="md" trigger="hover">
          <Menu.Target>
            <Button
              radius="xl"
              h={30}
              variant="gradient"
              onClick={isConnected ? handleCopyAddress : open}
            >
              {truncateMiddle(address) || `Connect Wallet`}
            </Button>
          </Menu.Target>
          <Menu.Dropdown hidden={!isConnected}>
            <Menu.Item
              icon={<IconCopy size={18} />}
              onClick={handleCopyAddress}
            >
              Copy address
            </Menu.Item>
            <Menu.Item
              color="red"
              icon={<IconPlugConnectedX size={18} />}
              onClick={() => disconnect()}
            >
              Disconnect
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Container>
    </Header>
  );
};

export default MyHeader;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));
