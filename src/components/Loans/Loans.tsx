import { Button, Card, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { borrowPrice, contractMortgage } from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import { Loan, Pool } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther, parseEther, zeroAddress } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';
import Collection from '../Lend/Collection';
import { calTimeRemain } from 'src/helpers/cal-time-remain';
import { waitForTransaction } from 'wagmi/actions';

const columns = [
  {
    accessor: 'duration',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: Loan) => (
      <Text weight={'bold'}>{Number(duration)}d</Text>
    ),
  },
  {
    accessor: 'startTime',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ start_time }: Loan) => {
      const unixTime = Number(start_time);
      return (
        <Text weight={'bold'}>
          {unixTime > 0 ? new Date(unixTime * 1000).toLocaleDateString() : '-'}
        </Text>
      );
    },
  },
  {
    accessor: 'remainingTime',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ start_time, duration }: Loan) => {
      if (Number(start_time) === 0) {
        return <Text weight={'bold'}>-</Text>;
      }

      const unixTime = calTimeRemain(duration, start_time);

      return (
        <Text weight={'bold'}>
          {unixTime > 0
            ? dayjs.duration(unixTime, 'seconds').format('D[d] H[h] m[m]')
            : 'Passed'}
        </Text>
      );
    },
  },
  {
    accessor: 'borrower',
    titleStyle: { fontSize: '25px' },
    render: ({ borrower }: Loan) => (
      <Text weight={'bold'}>
        {borrower === zeroAddress ? '-' : truncateMiddle(borrower)}
      </Text>
    ),
  },
  {
    accessor: 'Amount',
    width: '20%',
    titleStyle: { fontSize: '25px' },
    render: ({ amount }: Loan) => (
      <Text weight={'bold'}>{formatEther(amount)}</Text>
    ),
  },
];

export default function Loans() {
  const { address } = useAccount();

  const { data: loans, refetch } = useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: () => api.get('/loans'),
  });
  const { data: pools } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: () => api.get('/pools'),
  });

  const { mutateAsync: deleteLoan } = useMutation({
    mutationKey: ['delete-loan'],
    mutationFn: ({ id, withPool }: { id?: number; withPool?: boolean }) =>
      api.delete(`/loans/${id}?with-pool=${withPool}`),
    onSuccess: () => refetch(),
  });

  const { writeAsync: pay } = useContractWrite({
    ...contractMortgage,
    functionName: 'BorrowerPayLoan',
    account: address,
  });

  const handlePay = async (loan: Loan) => {
    const { start_time, duration, amount } = loan;
    const pool = pools?.find(({ pool_id }) => loan.pool_id === pool_id);
    let durations =
      (Math.floor(Date.now() / 1000) - Number(start_time)) / 86400;
    if (durations < Number(duration)) {
      durations++;
    }
    const interest = calculateInterest(
      Number(formatEther(amount)),
      Number(pool?.apy),
      durations,
      20
    );

    const value = parseEther(interest) + BigInt(borrowPrice) + BigInt(amount);
    const data = await pay({
      value,
      args: [loan.pool_id, loan.loan_id],
    });

    await waitForTransaction({
      hash: data?.hash,
    });

    await deleteLoan({
      id: loan.loan_id,
      withPool: false,
    });
  };

  return (
    <div className="container">
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
            <Text size="36px" weight={'bold'}>
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
              const pool = pools?.find(
                ({ pool_id }) => loan.pool_id === pool_id
              );
              return (
                <Collection name={pool?.collection_name} img={pool?.image} />
              );
            },
          },
          ...columns,
          {
            accessor: 'currentInterest',
            width: '20%',
            titleStyle: { fontSize: '25px' },
            render: (loan: Loan) => {
              const { start_time, duration, amount } = loan;
              const pool = pools?.find(
                ({ pool_id }) => loan.pool_id === pool_id
              );
              let durations =
                (Math.floor(Date.now() / 1000) - Number(start_time)) / 86400;
              if (durations < Number(duration)) {
                durations++;
              }

              return (
                <Text weight={'bold'}>
                  {calculateInterest(
                    Number(formatEther(amount)),
                    Number(pool?.apy),
                    durations
                  )}
                </Text>
              );
            },
          },
          {
            accessor: ' ',
            width: '10%',
            render: (loan) => {
              const { start_time, duration } = loan;
              const unixTime = calTimeRemain(duration, start_time);
              if (unixTime < 0) {
                return null;
              }

              return <Button onClick={() => handlePay(loan)}>Pay</Button>;
            },
          },
        ]}
      />
    </div>
  );
}
