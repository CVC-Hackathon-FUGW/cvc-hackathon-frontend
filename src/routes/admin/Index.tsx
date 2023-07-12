import { Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Pool } from 'src/types';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import CreatePool from './components/CreatPool';
import EditPool from './components/EditPool';
import UpdateFloorPrice from './components/UpdateFloorPrice';
import { useQuery } from '@tanstack/react-query';
import api from 'src/services/api';

const Admin = () => {
  const { data: pools, refetch } = useContractRead<
    unknown[],
    'getAllPool',
    Pool[]
  >({
    ...contractMortgage,
    functionName: 'getAllPool',
    watch: true,
  });

  const { data: marketItems } = useQuery({
    queryFn: () => api.get('/marketItems'),
    queryKey: ['get-marketItems'],
  });

  console.log(marketItems);

  const [editingPool, setEditingPool] = useState<Pool | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

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
        <Button onClick={open}>Create Pool</Button>
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

      <CreatePool opened={opened} close={close} refetch={refetch} />
      <EditPool
        opened={Boolean(editingPool)}
        close={() => setEditingPool(null)}
        editingPool={editingPool}
        refetch={refetch}
        key={`${editingPool?.poolId}`}
      />
      <Title>Marketplace collection</Title>
    </div>
  );
};

export default Admin;
