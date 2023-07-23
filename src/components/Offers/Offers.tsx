import { Button, Input, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconSearch } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { borrowPrice, contractMortgage } from 'src/configs/contract';
import { isLoanEnded } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import { Loan, Pool } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther, zeroAddress } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
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
    render: ({ start_time }: Loan) => {
      const unixTime = Number(start_time);
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
    render: ({ start_time, duration }: Loan) => {
      if (Number(start_time) === 0) {
        return <Text weight={700}>-</Text>;
      }

      const unixTime = Number(start_time) + Number(duration) * 86400;

      return <Text weight={700}>{dayjs.unix(unixTime).fromNow()}</Text>;
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

export default function Offers() {
  const { address } = useAccount();

  const { data: pools } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: () => api.get('/pools'),
  });

  const { data: loans } = useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: () => api.get('/loans'),
  });

  const { writeAsync: revoke } = useContractWrite({
    ...contractMortgage,
    functionName: 'LenderRevokeOffer',
  });

  const { mutateAsync: deleteLoan } = useMutation({
    mutationKey: ['delete-loan'],
    mutationFn: ({ id, withPool }: { id?: number; withPool?: boolean }) =>
      api.delete(`/loans/${id}?with-pool=${withPool}`),
  });

  const openRevokeModal = ({ pool_id, loan_id }: Loan) => {
    modals.openConfirmModal({
      title: 'Revoke offer',
      centered: true,
      onConfirm: async () => {
        const data = await revoke({
          args: [pool_id, loan_id],
        });
        await waitForTransaction({
          hash: data?.hash,
        });
        await deleteLoan({
          id: loan_id,
          withPool: true,
        });
      },
      confirmProps: { color: 'red' },
      labels: {
        cancel: 'Cancel',
        confirm: 'Revoke',
      },
    });
  };

  const { writeAsync: claim } = useContractWrite({
    ...contractMortgage,
    functionName: 'LenderClaimNFT',
    value: borrowPrice,
    account: address,
  });

  const handleClaim = async (loan: Loan) => {
    const data = await claim({
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
        records={loans?.filter(
          ({ lender, is_active }) => lender === address && is_active
        )}
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
            accessor: ' ',
            width: '10%',
            render: (loan) => {
              const { state, start_time, duration } = loan;

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

              const isEnded = isLoanEnded(Number(start_time), Number(duration));
              if (isEnded) {
                return (
                  <Button
                    size="md"
                    onClick={() => handleClaim(loan)}
                    color="blue"
                  >
                    Claim
                  </Button>
                );
              }
              return <></>;
            },
          },
        ]}
      />
    </div>
  );
}
