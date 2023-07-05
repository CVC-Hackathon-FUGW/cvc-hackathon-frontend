import {
  Button,
  Container,
  Group,
  Text,
  createStyles,
  rem,
} from '@mantine/core';

const HeroImage = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          BORROW & LEND AGAINST YOUR{' '}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            inherit
          >
            NFTS
          </Text>
          , INSTANTLY.
        </h1>

        <Text className={classes.description} color="dimmed">
          Rental is a decentralized lending protocol that allows you to borrow
        </Text>

        <Group className={classes.controls}>
          <Button
            component="a"
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            href="/lend"
          >
            Lend
          </Button>

          <Button
            component="a"
            href="/borrow"
            size="xl"
            variant="default"
            className={classes.control}
          >
            Borrow
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default HeroImage;

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    position: 'relative',
    paddingTop: rem(200),
    paddingBottom: rem(120),

    [theme.fn.smallerThan('sm')]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan('sm')]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },
}));
