import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Pool } from 'src/types';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import AvailablePool from '../Lend/AvailablePool';
import Collection from '../Lend/Collection';
import DrawerBorrow from './DrawerBorrow';

const columns = [
  {
    accessor: 'collection',
    width: '25%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ tokenAddress }: Pool) => (
      <Collection name={truncateMiddle(tokenAddress)} />
    ),
  },
  {
    accessor: 'totalPoolAmount',
    width: '20%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ totalPoolAmount }: Pool) => (
      <AvailablePool
        number={formatEther(totalPoolAmount)}
        description="1344 of 1410 offers taken"
      />
    ),
  },
  {
    accessor: 'bestOffer',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: () => 'Pending',
  },
  {
    accessor: 'APY',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ APY }: Pool) => (
      <Text size="30px" weight={700} color="green">
        {Number(APY)}%
      </Text>
    ),
  },
  {
    accessor: 'Interest',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ APY, duration }: Pool) => (
      <Text>
        {/* {Number(
          calculateInterest(
            Number(bestOffer),
            Number(APY),
            Number(duration)
          )
        )} */}
        Pending
      </Text>
    ),
  },
  {
    accessor: 'duration',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: Pool) => (
      <Text size="30px" weight={700}>
        {Number(duration)}d
      </Text>
    ),
  },
];

export default function Borrow() {
  const [pool, setPool] = useState<Pool>();
  const { data: pools } = useContractRead({
    ...contractMortgage,
    functionName: 'getAllPool',
  });
  return (
    <>
      <DrawerBorrow
        opened={Boolean(pool)}
        close={() => setPool(undefined)}
        data={pool}
      />
      <div style={{ padding: '20px 70px' }}>
        <div style={{ maxWidth: '990px' }}>
          <Title size="3.2rem">Make loan offers on NFT collections.</Title>
          <Text fz="lg">
            Browse collections below, and name your price. The current best
            offer will be shown to borrowers. To take your offer, they lock in
            an NFT from that collection to use as collateral. You will be repaid
            at the end of the loan, plus interest. If they fail to repay, you
            get to keep the NFT.
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
          records={(pools as Pool[])?.filter(({ state }) => state) || []}
          columns={[
            ...columns,
            {
              accessor: ' ',
              width: '10%',
              render: (dataPool) => (
                <Button onClick={() => setPool(dataPool)} size="md">
                  Borrow
                </Button>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
