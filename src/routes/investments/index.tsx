import { Button, Card, Text, Title } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { borrowPrice, contractMortgage } from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { calTimeRemain } from 'src/helpers/cal-time-remain';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import { Loan, Pool } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther, parseEther, zeroAddress } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

const columns = [
  {
    accessor: 'Project Name',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: Loan) => (
      <Text weight={'bold'}>{Number(duration)}d</Text>
    ),
  },
  {
    accessor: 'Description',
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
    accessor: 'Invested',
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
];

export default function InvestmentsPage() {
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
    mutationFn: (id?: number) => api.delete(`/loans/${id}`),
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

    await deleteLoan(loan.loan_id);
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '1200px' }}>
        <Title size="3.2rem">Your investments</Title>
        <Text fz="lg"></Text>
      </div>
      <DataTable
        records={loans?.filter(({ borrower }) => borrower === address)}
        columns={columns}
      />
    </div>
  );
}
