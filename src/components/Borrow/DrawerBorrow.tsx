import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Text,
  Title,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Loan, Pool } from 'src/types';
import { tempImage } from 'src/utils/contains';
import { formatEther, parseEther, zeroAddress } from 'viem';
import { useContractRead } from 'wagmi';

interface ModalLendProps {
  opened: boolean;
  close: () => void;
  data?: Pool;
}

export default function DrawerBorrow({ opened, close, data }: ModalLendProps) {
  const { APY, duration, image, poolId, tokenAddress } = { ...data };
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const { data: allLoans } = useContractRead<unknown[], 'getAllLoans', Loan[]>({
    ...contractMortgage,
    functionName: 'getAllLoans',
  });

  const loans = useMemo(() => {
    if (allLoans) {
      return allLoans.filter(
        (loan) =>
          loan.poolId === poolId && !loan.state && loan.lender !== zeroAddress
      );
    }
  }, [allLoans, poolId]);

  console.log(loans);

  const { data: floorPriceGwei } = useContractRead({
    ...contractMortgage,
    functionName: 'getFloorPrice',
    args: [tokenAddress],
    enabled: opened,
  });

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
      </div>
    </Modal>
  );
}
