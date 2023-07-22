import {
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Header,
  Menu,
  SegmentedControl,
  Text,
  createStyles,
  rem,
} from '@mantine/core';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCopy, IconPlugConnectedX } from '@tabler/icons-react';
import { useWeb3Modal } from '@web3modal/react';
import { useCallback, useEffect, useMemo } from 'react';
import logo from 'src/assets/logo.png';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import SwitchNetworkModal from './SwitchNetworkModal';
import useAdmin from 'src/hooks/useAdmin';
import { useLocation, useNavigate } from 'react-router-dom';

const HEADER_HEIGHT = rem(60);

const routes = [
  {
    value: 'marketplace',
    label: 'Marketplace',
  },
  {
    value: 'lend',
    label: 'Lend',
  },
  {
    value: 'offers',
    label: 'Offers',
  },
  {
    value: 'borrow',
    label: 'Borrow',
  },
  {
    value: 'loans',
    label: 'Loans',
  },
];

const adminRoutes = [
  {
    value: 'admin',
    label: 'Admin',
  },
];

const userRoutes = [
  {
    value: 'profile',
    label: 'Profile',
  },
];

const MyHeader = () => {
  const [openedBurger, { toggle: toggleBurger }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { classes } = useStyles();
  const { copy } = useClipboard();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isAdmin } = useAdmin();

  const handleCopyAddress = useCallback(() => {
    copy(address);
    notifications.show({
      message: 'Address copied to clipboard',
    });
  }, [copy, address]);

  const roleRoutes = useMemo(
    () =>
      isAdmin
        ? [...adminRoutes, ...routes]
        : isConnected
        ? [...userRoutes, ...routes]
        : routes,
    [isAdmin, isConnected]
  );

  useEffect(() => {
    if (chain?.unsupported) {
      openModal();
    }
  }, [chain, openModal]);

  return (
    <Header height={HEADER_HEIGHT} mb={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
      <Container className={classes.inner} fluid>
        <Group>
          <Menu>
            <Menu.Target>
              <Burger
                opened={openedBurger}
                onClick={toggleBurger}
                className={classes.burger}
                size="sm"
              />
            </Menu.Target>
            <Menu.Dropdown>
              {roleRoutes.map(({ value, label }) => (
                <Menu.Item
                  key={label}
                  onClick={() => {
                    navigate(`/${value}`);
                    toggleBurger();
                  }}
                >
                  <Text
                    variant={
                      pathname?.split('/')[1] === value ? 'gradient' : 'text'
                    }
                    key={label}
                    className={classes.link}
                  >
                    {label}
                  </Text>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <a href="/">
            <Avatar src={logo} size="lg" />
          </a>
        </Group>
        <SegmentedControl
          radius="xl"
          size="md"
          data={roleRoutes}
          classNames={classes}
          value={pathname?.split('/')[1]}
          onChange={(value) => navigate(`/${value}`)}
        />
        <Menu shadow="md" trigger="hover">
          <Menu.Target>
            <Button
              radius="xl"
              variant="gradient"
              onClick={isConnected ? undefined : open}
              className={classes.button}
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
  root: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  indicator: {
    backgroundImage: theme.fn.gradient(),
  },

  control: {
    border: '0 !important',
  },
  button: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },

  label: {
    '&, &:hover': {
      '&[data-active]': {
        color: theme.white,
      },
    },
  },
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  burger: {
    [theme.fn.largerThan('md')]: {
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
