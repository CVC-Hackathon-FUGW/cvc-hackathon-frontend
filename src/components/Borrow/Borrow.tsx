import sortBy from 'lodash/sortBy';
import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Collection from '../Lend/Collection';
import AvailablePool from '../Lend/AvailablePool';


const data = [
    {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="SMB Barrel"/>,
        availablePool: <AvailablePool number={1029.79} description = "1344 of 1410 offers taken"/>,
        bestOffer: <AvailablePool number={17.22} description = "17.22 last loan token"/>,
        interest: <Text size="30px" weight={700} color='red'>0.583</Text>,
        duration: <Text size="30px" weight={700}>7d</Text>, 
        ' ': <Button color="red" size="md">Borrow</Button>
    },
    {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="SMB Barrel"/>,
        availablePool: <AvailablePool number={999.79} description = "1344 of 1410 offers taken"/>,
        bestOffer: <AvailablePool number={17.22} description = "17.22 last loan token"/>,
        interest: <Text size="30px" weight={700} color='red'>0.355</Text>,
        duration: <Text size="30px" weight={700}>14d</Text>, 
        ' ': <Button color="red" size="md">Borrow</Button>
    },
    {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="SMB Barrel"/>,
        availablePool: <AvailablePool number={1189.79} description = "1344 of 1410 offers taken"/>,
        bestOffer: <AvailablePool number={17.22} description = "17.22 last loan token"/>,
        interest: <Text size="30px" weight={700} color='red'>0.344</Text>,
        duration: <Text size="30px" weight={700}>5d</Text>, 
        ' ': <Button color="red" size="md">Borrow</Button>
    },
    {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="SMB Barrel"/>,
        availablePool: <AvailablePool number={1559.79} description = "1344 of 1410 offers taken"/>,
        bestOffer: <AvailablePool number={17.22} description = "17.22 last loan token"/>,
        interest: <Text size="30px" weight={700} color='red'>0.113</Text>,
        duration: <Text size="30px" weight={700}>2d</Text>, 
        ' ': <Button color="red" size="md">Borrow</Button>
    },
    
]

export default function Borrow() {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [records, setRecords] = useState(sortBy(data, 'collection'));

    useEffect(() => {
      const result = sortBy(data, sortStatus.columnAccessor) as any;
      setRecords(sortStatus.direction === 'desc' ? data.reverse() : result);
    }, [sortStatus]);

    return (
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
                { accessor: 'interest', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                { accessor: 'duration', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                { accessor: ' ', width: '10%' },
            ]}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
        />
    </div>
    )
}