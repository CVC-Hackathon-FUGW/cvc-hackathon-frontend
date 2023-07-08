import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { contractMortgage } from 'src/configs/contract';
import { isLoanEnded } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Loan, Pool } from 'src/types';
import { formatEther, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Collection from '../Lend/Collection';
import { modals } from '@mantine/modals';
import { onError } from 'src/helpers/contract-call';

const columns = [
  {
    accessor: 'duration',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: Loan) => (
      <Text weight={700}>{Number(duration)}d</Text>
    ),
  },
  {
    accessor: 'startTime',
    width: '15%',
    sortable: true,
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
    accessor: 'borrower',
    titleStyle: { fontSize: '25px' },
    render: ({ borrower }: Loan) => (
      <Text>{borrower === zeroAddress ? '-' : truncateMiddle(borrower)}</Text>
    ),
  },
  {
    accessor: 'Amount',
    width: '20%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ amount }: Loan) => (
      <Text weight={700}>{formatEther(amount)}</Text>
    ),
  },
];
export default function Offers() {
  const { address } = useAccount();
  const { data: pools } = useContractRead({
    ...contractMortgage,
    functionName: 'getAllPool',
    onError,
  });
  const { data: loans } = useContractRead({
    ...contractMortgage,
    functionName: 'getAllLoans',
    onError,
  });

  const { write } = useContractWrite({
    ...contractMortgage,
    functionName: 'LenderRevokeOffer',
    onError,
  });

  const openRevokeModal = ({ poolId, loanId }: Loan) => {
    modals.openConfirmModal({
      title: 'Revoke offer',
      centered: true,
      onConfirm: () =>
        write({
          args: [poolId, loanId],
        }),
      confirmProps: { color: 'red' },
      labels: {
        cancel: 'Cancel',
        confirm: 'Revoke',
      },
    });
  };

  return (
    <div style={{ padding: '20px 70px' }}>
      <div style={{ maxWidth: '1200px' }}>
        <Title size="3.2rem">My offers and contracts</Title>
        <Text fz="lg">
          Once your offer is accepted by a borrower, a secure contract is
          created, freezing the NFT in their wallet. When the loan ends, you
          will get paid the total SOL (loan with interest). In the event of a
          default, you can foreclose, which transfers the collateral NFT to your
          wallet.
        </Text>
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
        records={(loans as Loan[]).filter(
          ({ lender }) => lender === address && lender !== zeroAddress
        )}
        columns={[
          {
            accessor: 'Collection',
            width: '25%',
            sortable: true,
            titleStyle: { fontSize: '25px' },
            render: (loan) => {
              const pool = (pools as Pool[])?.find(
                ({ poolId }) => loan.poolId === poolId
              );
              return (
                <Collection name={truncateMiddle(pool?.tokenAddress || '')} />
              );
            },
          },
          ...columns,
          {
            accessor: ' ',
            width: '10%',
            render: (loan) => {
              const { state, startTime, duration } = loan;

              if (!state) {
                return (
                  <Button
                    size="md"
                    onClick={() => openRevokeModal(loan)}
                    color="red"
                  >
                    Revoke
                  </Button>
                );
              }

              const isEnded = isLoanEnded(Number(startTime), Number(duration));
              if (isEnded) {
                return (
                  <Button
                    size="md"
                    onClick={() => {
                      console.log('claim');
                    }}
                    color="blue"
                  >
                    Claim
                  </Button>
                );
              }

              return (
                <Button
                  size="md"
                  onClick={() => {
                    console.log('view');
                  }}
                  color="blue"
                >
                  View
                </Button>
              );
            },
          },
        ]}
      />
    </div>
  );
}
