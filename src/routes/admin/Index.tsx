import { Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { contractMortgage } from 'src/configs/contract';
import { Pool } from 'src/types';
import { useContractRead } from 'wagmi';
import CreatePool from './components/CreatPool';
import { useState } from 'react';
import EditPool from './components/EditPool';

const Admin = () => {
  const { data: pools } = useContractRead({
    ...contractMortgage,
    functionName: 'getAllPool',
  });
  const [editingPool, setEditingPool] = useState<Pool | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <Group position="center">
        <Button onClick={open}>Create Pool</Button>
      </Group>

      <DataTable
        records={pools as Pool[]}
        onRowClick={setEditingPool}
        columns={[
          {
            accessor: 'APY',
            width: '25%',
            titleStyle: { fontSize: '25px' },
            render: (value: Pool) => `${Number(value.APY)}%`,
          },
          {
            accessor: 'Duration',
            width: '20%',
            titleStyle: { fontSize: '25px' },
            render: (value: Pool) => `${Number(value.duration)}`,
          },
          {
            accessor: 'poolId',
            width: '15%',
            titleStyle: { fontSize: '25px' },
            render: (value: Pool) => `${Number(value.poolId)}`,
          },
          {
            accessor: 'tokenAddress',
            width: '15%',
            titleStyle: { fontSize: '25px' },
          },
          {
            accessor: 'TotalPoolAmount',
            width: '15%',
            titleStyle: { fontSize: '25px' },
            render: (value: Pool) => `${Number(value.totalPoolAmount)}`,
          },
        ]}
      />

      <CreatePool opened={opened} close={close} />
      <EditPool
        opened={Boolean(editingPool)}
        close={() => setEditingPool(null)}
        editingPool={editingPool}
      />
    </div>
  );
};

export default Admin;
