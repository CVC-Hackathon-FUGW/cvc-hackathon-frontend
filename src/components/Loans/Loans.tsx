import { Title, Text, Card, Input, Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from "react";
import Collection from "../Lend/Collection";

const data = [
    {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        borrowed: <Text size="30px" weight={700}>◎0.05</Text>,
        term: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        repayment: <Text size="30px" weight={700}>◎0.051</Text>,
    }, {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        borrowed: <Text size="30px" weight={700}>◎0.05</Text>,
        term: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        repayment: <Text size="30px" weight={700}>◎0.051</Text>,
    }, {
        collection: <Collection img="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg" name="Bear Market Beavers" />,
        borrowed: <Text size="30px" weight={700}>◎0.05</Text>,
        term: <Text size="24px" weight={700}>Repaid 125d ago</Text>,
        repayment: <Text size="30px" weight={700}>◎0.051</Text>,
    }
]

export default function Loans() {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [records, setRecords] = useState(sortBy(data, 'collection'));

    useEffect(() => {
        const result = sortBy(data, sortStatus.columnAccessor) as any;
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : result);
    }, [sortStatus]);
    return (
        <div style={{ padding: "20px 70px" }}>
            <div style={{ maxWidth: "1200px" }}>
                <Title size="3.2rem">My loans</Title>
                <Text fz="lg">
                    Here are the NFTs you borrowed against. You must pay these in full by the expiration date in order to keep your NFT.
                </Text>
            </div>
            <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                <div style={{ display: "flex", gap: "20px", paddingTop: "20px" }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">TOTAL ACTIVE LOANS</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">TOTAL BORROWED</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
                        <Text size="14px" weight={500} color="grey">0 open offers</Text>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "300px" }}>
                        <Text size="14px" weight={500} color="grey">TOTAL INTEREST OWED</Text>
                        <Text size="36px" weight={700}>◎-2.123</Text>
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
                    { accessor: 'borrowed', width: '20%', sortable: true, titleStyle: { fontSize: "25px" } },
                    { accessor: 'term', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                    { accessor: 'repayment', width: '15%', sortable: true, titleStyle: { fontSize: "25px" } },
                ]}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
            />
        </div>
    )
}