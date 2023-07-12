import { Button, Divider, Group, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import { Pool } from 'src/types';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import CreatePool from './components/CreatPool';
import EditPool from './components/EditPool';
import UpdateFloorPrice from './components/UpdateFloorPrice';
import CreateCollection from './components/CreateCollection';

const Admin = () => {
  const { data: pools } = useContractRead<unknown[], 'getAllPool', Pool[]>({
    ...contractMortgage,
    functionName: 'getAllPool',
    watch: true,
  });

  const { data: marketItems } = useQuery({
    queryFn: () => api.get('/marketItems'),
    queryKey: ['get-marketItems'],
  });

  console.log('marketItems', marketItems);

  const [editingPool, setEditingPool] = useState<Pool | null>(null);
  // const [opened, { open, close }] = useDisclosure(false);
  const [createAction, setCreateAction] = useState<'pool' | 'collection'>();

  const openFloorPriceModal = ({ tokenAddress }: Pool) => {
    modals.open({
      title: 'Update Floor Price',
      centered: true,
      children: <UpdateFloorPrice tokenAddress={tokenAddress} />,
    });
  };

  return (
    <div>
      <Title>Mortgages</Title>
      <Group position="right">
        <Button onClick={() => setCreateAction('pool')}>Create Pool</Button>
      </Group>
      <DataTable
        records={pools || []}
        columns={[
          {
            accessor: 'tokenAddress',
            width: '15%',
            render: (value: Pool) => `${truncateMiddle(value.tokenAddress)}`,
          },
          {
            accessor: 'APY',
            width: '25%',
            cellsStyle: { color: 'green', fontWeight: 'bold' },
            render: (value: Pool) => `${Number(value.APY)}%`,
          },
          {
            accessor: 'Duration',
            width: '20%',
            render: (value: Pool) => `${Number(value.duration)}d`,
          },
          {
            accessor: 'poolId',
            width: '15%',
            render: (value: Pool) => `${Number(value.poolId)}`,
          },
          {
            accessor: 'TotalPoolAmount',
            width: '15%',
            render: (value: Pool) => `${formatEther(value.totalPoolAmount)}`,
          },
          {
            accessor: ' ',
            render: (value: Pool) => (
              <div className="flex flex-row gap-2">
                <Button onClick={() => setEditingPool(value)}>Update</Button>
                <Button onClick={() => openFloorPriceModal(value)} color="teal">
                  Set Floor price
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Divider variant="dashed" className="my-5" />
      <Title>Marketplace collection</Title>
      <Group position="right">
        <Button onClick={() => setCreateAction('collection')}>
          Create Collection
        </Button>
      </Group>

      <CreatePool
        opened={createAction === 'pool'}
        close={() => setCreateAction(undefined)}
      />
      <CreateCollection
        opened={createAction === 'collection'}
        close={() => setCreateAction(undefined)}
      />
      <EditPool
        opened={Boolean(editingPool)}
        close={() => setEditingPool(null)}
        editingPool={editingPool}
        key={`${editingPool?.poolId}`}
      />
    </div>
  );
};

export default Admin;
