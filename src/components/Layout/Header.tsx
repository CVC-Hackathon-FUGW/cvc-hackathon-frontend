import {
  Burger,
  Button,
  Container,
  Group,
  Header,
  Menu,
  Text,
  ThemeIcon,
  createStyles,
  rem,
} from '@mantine/core';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCopy,
  IconCurrencyEthereum,
  IconPlugConnectedX,
} from '@tabler/icons-react';
import { useWeb3Modal } from '@web3modal/react';
import { useCallback, useEffect } from 'react';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import SwitchNetworkModal from './SwitchNetworkModal';

const HEADER_HEIGHT = rem(60);

const links = [
  {
    link: '/lend',
    label: 'Lend',
  },
  {
    link: '/offers',
    label: 'Offers',
  },
  {
    link: '/borrow',
    label: 'Borrow',
  },
  {
    link: '/loans',
    label: 'Loans',
  },
];

const MyHeader = () => {
  const { classes } = useStyles();
  const [openedBurger, { toggle: toggleBurger }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const { copy } = useClipboard();

  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const handleCopyAddress = useCallback(() => {
    copy(address);
    notifications.show({
      message: 'Address copied to clipboard',
    });
  }, [copy, address]);

  useEffect(() => {
    if (chain?.unsupported) {
      openModal();
    }
  }, [chain, openModal]);

  return (
    <Header height={HEADER_HEIGHT} mb={HEADER_HEIGHT}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={openedBurger}
            onClick={toggleBurger}
            className={classes.burger}
            size="sm"
          />
          <a href="/">
            <ThemeIcon variant="gradient" size={32}>
              <IconCurrencyEthereum />
            </ThemeIcon>
          </a>
        </Group>
        <Group spacing={5} className={classes.links}>
          {links.map(({ link, label }) => (
            <Text
              variant={
                window?.location?.pathname === link ? 'gradient' : 'text'
              }
              key={label}
              href={link}
              className={classes.link}
              component="a"
            >
              {label}
            </Text>
          ))}
        </Group>
        <Menu shadow="md" trigger="hover">
          <Menu.Target>
            <Button
              radius="xl"
              h={30}
              variant="gradient"
              onClick={isConnected ? undefined : open}
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
      <SwitchNetworkModal
        opened={openedModal}
        onClose={closeModal}
        disconnect={disconnect}
      />
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
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',

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
