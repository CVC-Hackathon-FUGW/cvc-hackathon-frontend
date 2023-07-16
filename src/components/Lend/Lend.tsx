import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import { ContractPool, Pool } from 'src/types';
import { tempImage } from 'src/utils/contains';
import { formatEther } from 'viem';
import AvailablePool from './AvailablePool';
import Collection from './Collection';
import ModalLend from './ModalLend';

const columns = [
  {
    accessor: 'collection',
    width: '25%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ tokenAddress }: ContractPool) => (
      <Collection img={tempImage} name={truncateMiddle(tokenAddress)} />
    ),
  },
  {
    accessor: 'totalPoolAmount',
    width: '20%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ totalPoolAmount }: ContractPool) => (
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
    render: ({ APY }: ContractPool) => (
      <Text size="30px" weight={700} color="green">
        {Number(APY)}%
      </Text>
    ),
  },
  {
    accessor: 'duration',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: ContractPool) => (
      <Text size="30px" weight={700}>
        {Number(duration)}d
      </Text>
    ),
  },
];

export default function Lend() {
  const [pool, setPool] = useState<Pool>();

  const { data: pools } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: () => api.get('/pools'),
  });

  return (
    <>
      <ModalLend
        opened={Boolean(pool)}
        close={() => setPool(undefined)}
        data={pool}
      />
      <div className="container">
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
          records={
            (pools as ContractPool[])?.filter(({ state }) => state) || []
          }
          columns={[
            ...columns,
            {
              accessor: ' ',
              width: '10%',
              render: (dataPool) => (
                <Button onClick={() => setPool(dataPool)} size="md">
                  Lend
                </Button>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
