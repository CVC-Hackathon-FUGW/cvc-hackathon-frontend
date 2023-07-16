import { Button, Input, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { borrowPrice, contractMortgage } from 'src/configs/contract';
import { isLoanEnded } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { ContractLoan, ContractPool } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Collection from '../Lend/Collection';

const columns = [
  {
    accessor: 'duration',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: ContractLoan) => (
      <Text weight={700}>{Number(duration)}d</Text>
    ),
  },
  {
    accessor: 'startTime',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ startTime }: ContractLoan) => {
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
    render: ({ startTime, duration }: ContractLoan) => {
      if (Number(startTime) === 0) {
        return <Text weight={700}>-</Text>;
      }

      const unixTime = Number(startTime) + Number(duration) * 86400;

      return <Text weight={700}>{dayjs.unix(unixTime).fromNow()}</Text>;
    },
  },
  {
    accessor: 'borrower',
    titleStyle: { fontSize: '25px' },
    render: ({ borrower }: ContractLoan) => (
      <Text>{borrower === zeroAddress ? '-' : truncateMiddle(borrower)}</Text>
    ),
  },
  {
    accessor: 'Amount',
    width: '20%',
    titleStyle: { fontSize: '25px' },
    render: ({ amount }: ContractLoan) => (
      <Text weight={700}>{formatEther(amount)}</Text>
    ),
  },
];

export default function Offers() {
  const { address } = useAccount();

  const { data: pools } = useContractRead<
    unknown[],
    'getAllPool',
    ContractPool[]
  >({
    ...contractMortgage,
    functionName: 'getAllPool',
  });
  const { data: loans } = useContractRead({
    ...contractMortgage,
    functionName: 'getAllLoans',
  });

  const { write } = useContractWrite({
    ...contractMortgage,
    functionName: 'LenderRevokeOffer',
  });

  const openRevokeModal = ({ poolId, loanId }: ContractLoan) => {
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

  const { write: claim } = useContractWrite({
    ...contractMortgage,
    functionName: 'LenderClaimNFT',
    value: borrowPrice,
    account: address,
  });

  const handleClaim = async (loan: ContractLoan) =>
    claim({
      args: [loan.poolId, loan.loanId],
    });

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
        records={(loans as ContractLoan[])?.filter(
          ({ lender }) => lender === address
        )}
        columns={[
          {
            accessor: 'Collection',
            width: '25%',
            sortable: true,
            titleStyle: { fontSize: '25px' },
            render: (loan) => {
              const pool = (pools as ContractPool[])?.find(
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
