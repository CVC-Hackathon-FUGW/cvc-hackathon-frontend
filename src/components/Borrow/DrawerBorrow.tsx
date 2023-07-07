import { Drawer, Button, Group, Avatar, Card, Text, Title, Checkbox } from '@mantine/core';

export default function DrawerBorrow(props: any) {


    return (
        <Drawer opened={props.opened} onClose={props.close} position='right'>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Avatar size="lg" src='https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg' radius="xl" alt="it's me" />
                    <Title order={3}>Name Pool</Title>
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '185px' }}>
                        <Text weight={700} size='20px'>Floor</Text>
                        <Text weight={700} size='20px'>◎0.05</Text>
                    </Card>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>
                        <Text color="grey" weight={600}>INTEREST</Text>
                        <Text color="green" weight={700} size='26px'>100%</Text>
                    </div>
                    <div>
                        <Text color="grey" weight={600}>DURATION</Text>
                        <Text weight={700} size='26px'>7d</Text>
                    </div>
                    <div>
                        <Text color="grey" weight={600}>AVAILABLE TO BORROW</Text>
                        <Text weight={700} size='26px'> ◎ 0.001</Text>
                    </div>
                </div>
                <Checkbox
                    label={<Text weight={600}>Select all</Text>}
                    mt={40}
                    pl='35%'
                />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card shadow="sm" padding="lg" radius="md" mt={20} withBorder style={{ width: '185px', height: '180px'}}>

                    </Card>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <Title>1 NFT Selected</Title>
                    <Text weight={700} size='26px'> ◎ 0.001</Text>
                    <Button color='red' h={50} w={300}>
                        <Text size='lg'>Borrow ◎ 0.001</Text>
                    </Button>
                </div>
            </div>
        </Drawer>
    )
}