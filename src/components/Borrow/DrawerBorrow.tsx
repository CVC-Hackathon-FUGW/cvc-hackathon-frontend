import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Input,
  Modal,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMemo, useState } from 'react';
import {
  abiNft,
  addressMortgage,
  contractMortgage,
} from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { ContractLoan, ContractPool } from 'src/types';
import { tempImage } from 'src/utils/contains';
import { formatEther, zeroAddress } from 'viem';
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

interface ModalLendProps {
  opened: boolean;
  close: () => void;
  data?: ContractPool;
}

export default function DrawerBorrow({ opened, close, data }: ModalLendProps) {
  const { APY, duration, image, poolId, tokenAddress } = { ...data };
  const [selectedLoan, setSelectedLoan] = useState<ContractLoan | null>();

  const { onSubmit, getInputProps, values } = useForm({
    initialValues: {
      tokenId: '',
    },
  });

  // const nftIds = useNftDetector(tokenAddress);

  const { data: allLoans } = useContractRead<
    unknown[],
    'getAllLoans',
    ContractLoan[]
  >({
    ...contractMortgage,
    functionName: 'getAllLoans',
  });

  const { data: floorPriceGwei } = useContractRead({
    ...contractMortgage,
    functionName: 'getFloorPrice',
    args: [tokenAddress],
    enabled: opened,
  });

  const { data: approved } = useContractRead({
    address: tokenAddress,
    abi: abiNft,
    functionName: 'getApproved',
    args: [BigInt(values.tokenId)],
    enabled: !!values.tokenId,
  });

  const isApproved = useMemo(() => {
    if (approved) {
      return approved === addressMortgage;
    }
    return false;
  }, [approved]);

  const {
    write: approve,
    reset,
    data: allowance,
  } = useContractWrite({
    address: tokenAddress,
    abi: abiNft,
    functionName: 'approve',
  });

  const { write: borrow } = useContractWrite({
    ...contractMortgage,
    functionName: 'BorrowerTakeLoan',
  });

  const { isSuccess } = useWaitForTransaction({
    hash: allowance?.hash,
    onSuccess: () =>
      notifications.show({
        title: 'Approve successfully',
        message: 'You can now Borrow',
      }),
  });

  const loans = useMemo(() => {
    if (allLoans) {
      return allLoans.filter(
        (loan) =>
          loan.poolId === poolId && !loan.state && loan.lender !== zeroAddress
      );
    }
  }, [allLoans, poolId]);

  const floorPrice = useMemo(() => {
    if (floorPriceGwei) {
      return Number(formatEther(floorPriceGwei as bigint));
    }
    return 0;
  }, [floorPriceGwei]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setSelectedLoan(null);
        reset();
        close();
      }}
      size={'xl'}
      centered
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center justify-between">
          <Group className="flex flex-row gap-2 items-center">
            <Avatar
              size="lg"
              src={image || tempImage}
              radius="xl"
              alt="it's me"
            />
            <Title order={3}>{truncateMiddle(tokenAddress)}</Title>
          </Group>
          <Card
            shadow="sm"
            padding="xs"
            radius="md"
            withBorder
            className="w-fit"
          >
            <Text weight={700} size="20px">
              Floor
            </Text>
            <Text weight={700} size="20px">
              XCR {floorPrice}
            </Text>
          </Card>
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            withBorder
            className="w-fit"
          >
            <Text weight={700} size="20px">
              Duration
            </Text>
            <Text weight={700} size="20px">
              {Number(duration)}d
            </Text>
          </Card>
        </div>
        <div className="flex flex-row overflow-x-auto gap-2">
          {loans?.map((loan) => (
            <Card
              withBorder
              shadow="sm"
              radius="md"
              className="w-full"
              key={loan.loanId.toString()}
              onClick={() => setSelectedLoan(loan)}
              c={selectedLoan?.loanId === loan.loanId ? 'blue' : 'gray'}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Card.Section
                p="sm"
                className="flex flex-row justify-between items-center"
              >
                <div className="flex flex-col gap-2">
                  <Text size="xl" fw="bold">
                    {truncateMiddle(loan.tokenAddress)}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    Lender: {truncateMiddle(loan.lender)}
                  </Text>
                </div>
                <Badge variant="outline">XCR {formatEther(loan.amount)}</Badge>
              </Card.Section>
              <Divider />
              <Card.Section p="sm">
                <Text>
                  Interest:{' '}
                  {calculateInterest(
                    Number(formatEther(loan.amount)),
                    Number(APY),
                    Number(duration)
                  )}
                </Text>
              </Card.Section>
            </Card>
          ))}
        </div>
        <Divider />

        <form
          className="flex flex-col gap-2"
          onSubmit={onSubmit(({ tokenId }) => {
            if (!tokenId) return;
            const bigTokenId = BigInt(tokenId);
            if (isSuccess || isApproved) {
              return borrow({
                args: [poolId, bigTokenId, selectedLoan?.loanId],
              });
            }
            return approve({
              args: [addressMortgage, bigTokenId],
            });
          })}
        >
          <Input {...getInputProps('tokenId')} placeholder="Enter Token ID" />
          <Group position="center">
            <Button disabled={!selectedLoan && !isApproved} type="submit">
              {isSuccess || isApproved ? 'Borrow' : 'Approve'}
            </Button>
          </Group>
        </form>
      </div>
    </Modal>
  );
}
