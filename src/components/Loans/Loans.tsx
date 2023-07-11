import { Button, Card, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { borrowPrice, contractMortgage } from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Loan, Pool } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther, parseEther, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Collection from '../Lend/Collection';

const columns = [
  {
    accessor: 'duration',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: Loan) => (
      <Text weight={700}>{Number(duration)}d</Text>
    ),
  },
  {
    accessor: 'startTime',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ startTime }: Loan) => {
      const unixTime = Number(startTime);
      return (
        <Text weight={700}>
          {unixTime > 0 ? new Date(unixTime * 1000).toLocaleDateString() : '-'}
        </Text>
      );
    },
  },
  {
    accessor: 'remainingTime',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ startTime, duration }: Loan) => {
      if (Number(startTime) === 0) {
        return <Text weight={700}>-</Text>;
      }

      const unixTime =
        Number(startTime) + Number(duration) * 86400 - Date.now() / 1000;

      return (
        <Text weight={700}>
          {dayjs.duration(unixTime, 'seconds').format('D[d] H[h] m[m]')}
        </Text>
      );
    },
  },
  {
    accessor: 'borrower',
    titleStyle: { fontSize: '25px' },
    render: ({ borrower }: Loan) => (
      <Text>{borrower === zeroAddress ? '-' : truncateMiddle(borrower)}</Text>
    ),
  },
  {
    accessor: 'Amount',
    width: '20%',
    titleStyle: { fontSize: '25px' },
    render: ({ amount }: Loan) => (
      <Text weight={700}>{formatEther(amount)}</Text>
    ),
  },
];

export default function Loans() {
  const { address } = useAccount();

  const { data: loans } = useContractRead<unknown[], 'getAllLoans', Loan[]>({
    ...contractMortgage,
    functionName: 'getAllLoans',
  });
  const { data: pools } = useContractRead<unknown[], 'getAllPool', Pool[]>({
    ...contractMortgage,
    functionName: 'getAllPool',
  });

  const { write: pay } = useContractWrite({
    ...contractMortgage,
    functionName: 'BorrowerPayLoan',
    account: address,
  });

  const handlePay = async (loan: Loan) => {
    const { startTime, duration, amount } = loan;
    const pool = (pools as Pool[])?.find(
      ({ poolId }) => loan.poolId === poolId
    );
    let durations = (Date.now() / 1000 - Number(startTime)) / 86400;
    if (durations < Number(duration)) {
      durations++;
    }
    const interest = calculateInterest(
      Number(formatEther(amount)),
      Number(pool?.APY),
      durations,
      20
    );

    const value = parseEther(interest) + borrowPrice + amount;
    pay({
      value,
      args: [loan.poolId, loan.loanId],
    });
  };

  return (
    <div style={{ padding: '20px 70px' }}>
      <div style={{ maxWidth: '1200px' }}>
        <Title size="3.2rem">My loans</Title>
        <Text fz="lg">
          Here are the NFTs you borrowed against. You must pay these in full by
          the expiration date in order to keep your NFT.
        </Text>
      </div>
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '20px', paddingTop: '20px' }}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: '300px' }}
          >
            <Text size="14px" weight={500} color="grey">
              BORROW PRICE
            </Text>
            <Text size="36px" weight={700}>
              XCR {formatEther(borrowPrice)}
            </Text>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <Input
          icon={<IconSearch />}
          variant="filled"
          size="xl"
          placeholder="search collections..."
        />
      </div>
      <DataTable
        records={loans?.filter(({ borrower }) => borrower === address)}
        columns={[
          {
            accessor: 'Collection',
            width: '25%',
            sortable: true,
            titleStyle: { fontSize: '25px' },
            render: (loan) => {
              const pool = pools?.find(({ poolId }) => loan.poolId === poolId);
              return (
                <Collection name={truncateMiddle(pool?.tokenAddress || '')} />
              );
            },
          },
          ...columns,
          {
            accessor: 'currentInterest',
            width: '20%',
            titleStyle: { fontSize: '25px' },
            render: (loan: Loan) => {
              const { startTime, duration, amount } = loan;
              const pool = (pools as Pool[])?.find(
                ({ poolId }) => loan.poolId === poolId
              );
              let durations = (Date.now() / 1000 - Number(startTime)) / 86400;
              if (durations < Number(duration)) {
                durations++;
              }

              return (
                <Text weight={700}>
                  {calculateInterest(
                    Number(formatEther(amount)),
                    Number(pool?.APY),
                    durations
                  )}
                </Text>
              );
            },
          },
          {
            accessor: ' ',
            width: '10%',
            render: (loan) => (
              <Button onClick={() => handlePay(loan)}>Pay</Button>
            ),
          },
        ]}
      />
    </div>
  );
}
