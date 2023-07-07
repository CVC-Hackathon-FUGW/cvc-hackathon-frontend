import sortBy from 'lodash/sortBy';
import { Avatar, Button, Input, Modal, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Collection from './Collection';
import AvailablePool from './AvailablePool';
import { useDisclosure } from '@mantine/hooks';
import ModalLend from './ModalLend';

const dataResponse = [
    {
        pool_id: 1,
        token_address: "abc",
        total_pool_amount: 5,
        apy: 100,
        duration: 7,
        state: "active",
        image: 'https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg'
    },
    {
        pool_id: 1,
        token_address: "abc",
        total_pool_amount: 5,
        apy: 100,
        duration: 7,
        state: "active",
        image: 'https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg'
    },
    {
        pool_id: 1,
        token_address: "abc",
        total_pool_amount: 5,
        apy: 100,
        duration: 7,
        state: "active",
        image: 'https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg'
    },
]


export default function Lend() {
    const [opened, { open, close }] = useDisclosure(false);
    const [pool, setPool] = useState({}as any);
    const handleModalLend = (dataPool: any, open: any) => {
        setPool(dataPool)
        return open();
    }
    // Mapping data to record
    const dataRecord = dataResponse.map((dataPool) => {
        return {
            collection: <Collection img={dataPool.image} name="SMB Barrel" />,
            availablePool: <AvailablePool number={dataPool.total_pool_amount} description="1344 of 1410 offers taken" />,
            bestOffer: "Pending",
            apy: <Text size="30px" weight={700} color='green'>{dataPool.apy}%</Text>,
            duration: <Text size="30px" weight={700}>{dataPool.duration}d</Text>,
            ' ': <Button onClick={() => handleModalLend(dataPool, open)} color="red" size="md">Lend</Button>
        }
    })

    //Sort data
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [records, setRecords] = useState(sortBy(dataRecord, 'collection'));
    useEffect(() => {
        const result = sortBy(dataRecord, sortStatus.columnAccessor) as any;
        setRecords(sortStatus.direction === 'desc' ? dataRecord.reverse() : result);
    }, [sortStatus]);

    return (
        <>
            <ModalLend opened={opened} close={close} data={pool} />
            <div style={{ padding: "20px 70px" }}>
                <div style={{ maxWidth: "990px" }}>
                    <Title size="3.2rem">Make loan offers on NFT collections.</Title>
                    <Text fz="lg">
                        Browse collections below, and name your price. The current best offer will be shown to borrowers.
                        To take your offer, they lock in an NFT from that collection to use as collateral.
                        You will be repaid at the end of the loan, plus interest. If they fail to repay, you get to keep the NFT.
                    </Text>
                </div>
                <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                    <Input
                        icon={<IconSearch />}
                        variant="filled"
                        size='xl'
                        placeholder='search collections...'
                    />
                </div>

                <DataTable
                    records={records}
                    columns={[
                        { accessor: 'collection', width: '25%', sortable: true, titleStyle: { fontSize: "25px" } },
                        { accessor: 'availablePool', width: '20%', sortable: true, titleStyle: { fontSize: "25px" } },
                        { accessor: 'bestOffer', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                        { accessor: 'apy', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                        { accessor: 'duration', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                        { accessor: ' ', width: '10%' },
                    ]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                />
            </div>
        </>

    )
}