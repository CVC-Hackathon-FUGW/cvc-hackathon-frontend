import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import api from 'src/services/api';
import { Pool, WrappedPool } from 'src/types';
import { formatEther } from 'viem';
import AvailablePool from './AvailablePool';
import Collection from './Collection';
import ModalLend from './ModalLend';
import { debounce } from 'lodash';

const columns = [
  {
    accessor: 'collection',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { collection_name, image } }: WrappedPool) => (
      <Collection img={image} name={collection_name} />
    ),
  },
  {
    accessor: 'totalPoolAmount',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { total_pool_amount }, loan_count }: WrappedPool) => (
      <AvailablePool
        number={formatEther(total_pool_amount || 0n)}
        description={loan_count}
      />
    ),
  },
  {
    accessor: 'bestOffer',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ loan_max_amount }: WrappedPool) => (
      <Text size="lg" weight={700}>
        {formatEther(loan_max_amount || 0n)}
      </Text>
    ),
  },
  {
    accessor: 'APY',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { apy } }: WrappedPool) => (
      <Text size="lg" weight={700} color="green">
        {Number(apy)}%
      </Text>
    ),
  },
  {
    accessor: 'duration',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { duration } }: WrappedPool) => (
      <Text size="lg" weight={700}>
        {Number(duration)}d
      </Text>
    ),
  },
];

export default function Lend() {
  const [pool, setPool] = useState<Pool>();
  const [nameSearch, setNameSearch] = useState('');
  const handleSearch = debounce((value) => {
    setNameSearch(value.target.value);
  }, 400);

  const { data: pools } = useQuery<WrappedPool[]>({
    queryKey: ['pools', nameSearch],
    queryFn: () => api.get(`/pools/loan?name=${nameSearch}`),
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
            Choose your pricing while perusing the collections below. Borrowers
            will be presented with the current best offer. The smart contract
            take one NFT from that collection to be used as collateral in order
            to accept your offer. At the end of the loan, you will be paid back
            plus interest. In that case, you are allowed to maintain the NFT.
          </Text>
        </div>
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <Input
            icon={<IconSearch />}
            size="xl"
            placeholder="search collections..."
            onChange={handleSearch}
          />
        </div>

        <DataTable
          records={pools?.filter(({ pool }) => pool?.state) || []}
          columns={[
            ...columns,
            {
              accessor: ' ',
              width: '10%',
              render: ({ pool }) => (
                <Button onClick={() => setPool(pool)} size="md">
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
