import { Title, Text, Card, Input, Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from "react";
import Collection from "../Lend/Collection";
import AvailablePool from "../Lend/AvailablePool";

const data = [
    {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        offer: <AvailablePool number={0.03} />,
        interest: <Text size="30px" weight={700} color='red'>-0.028</Text>,
        APY: <Text size="30px" weight={700} color='green'>-100%</Text>,
        status: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        ' ': <Button color="red" size="md">View</Button>
    },{
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        offer: <AvailablePool number={0.03} />,
        interest: <Text size="30px" weight={700} color='red'>-0.028</Text>,
        APY: <Text size="30px" weight={700} color='green'>-100%</Text>,
        status: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        ' ': <Button color="red" size="md">View</Button>
    },{
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        offer: <AvailablePool number={0.03} />,
        interest: <Text size="30px" weight={700} color='red'>-0.028</Text>,
        APY: <Text size="30px" weight={700} color='green'>-100%</Text>,
        status: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        ' ': <Button color="red" size="md">View</Button>
    },{
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        offer: <AvailablePool number={0.03} />,
        interest: <Text size="30px" weight={700} color='red'>-0.028</Text>,
        APY: <Text size="30px" weight={700} color='green'>-100%</Text>,
        status: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        ' ': <Button color="red" size="md">View</Button>
    },
    

]

export default function Offers() {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [records, setRecords] = useState(sortBy(data, 'collection'));

    useEffect(() => {
        const result = sortBy(data, sortStatus.columnAccessor) as any;
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : result);
    }, [sortStatus]);
    return (
        <div style={{ padding: "20px 70px" }}>
            <div style={{ maxWidth: "1200px" }}>
                <Title size="3.2rem">My offers and contracts</Title>
                <Text fz="lg">
                    Once your offer is accepted by a borrower, a secure contract is created, freezing the NFT in their wallet.
                    When the loan ends, you will get paid the total SOL (loan with interest).
                    In the event of a default, you can foreclose, which transfers the collateral NFT to your wallet.
                </Text>
            </div>
            <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                <div style={{display: "flex", gap: "20px", paddingTop: "20px"}}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">TOTAL INTEREST EARNED (ALL TIME)</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
                        <Text size="14px" weight={500} color="grey">+◎0 expected from active loans</Text>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">TOTAL OFFER VALUE</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
                        <Text size="14px" weight={500} color="grey">0 open offers</Text>
                    </Card> <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">TFORECLOSURE RATE</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
                        <Text size="14px" weight={500} color="grey">0 foreclosed</Text>
                    </Card> <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">UNDER WATER</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
                        <Text size="14px" weight={500} color="grey">0% of active loans</Text>
                    </Card>
                </div>
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
                    { accessor: 'offer', width: '20%', sortable: true, titleStyle: { fontSize: "25px" } },
                    { accessor: 'interest', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                    { accessor: 'APY', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                    { accessor: 'status', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                    { accessor: ' ', width: '10%' },
                ]}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
            />
        </div>
    )
}