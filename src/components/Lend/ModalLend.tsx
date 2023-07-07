import { Modal, Avatar, Title, Text, Input, Button, Divider } from "@mantine/core";

export default function ModalLend(props: any) {
    //Control modal


    return (
        <Modal opened={props.opened} onClose={props.close}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar size="lg" src={props.data.image} radius="xl" alt="it's me" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Title order={3}>Tên của pool</Title>
            </div>
            <div style={{ padding: '15px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Text color="grey" weight={600}>APY</Text>
                        <Text color="green" weight={700} size='26px'>{props.data.apy}%</Text>
                    </div>
                    <div>
                        <Text color="grey" weight={600}>DURATION</Text>
                        <Text weight={700} size='26px'>{props.data.duration}d</Text>
                    </div>
                    <div>
                        <Text color="grey" weight={600}>FLOOR</Text>
                        <Text weight={700} size='26px'>17.45</Text>
                    </div>
                </div>
                <Divider my="sm" />
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px' }}>
                    <div>
                        <Text weight={500} pb={10}>Offer Amount</Text>
                        <Input type="number"/>
                    </div>
                    <div>
                        <Text weight={500} pb={10} >Total Interest</Text>
                        <Text weight={600} size='26px'>◎0</Text>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '20px'}}>
                    <Text weight={500}>Your total is 0</Text>
                    <Text weight={500}>Your have 0</Text>
                </div>
                <Button fullWidth color="red" mt={30}>Place Offer</Button>
                <Text color="grey" size='12px' mt={20}>Offers can be revoked any time up until it is taken by a borrower.</Text>
            </div>

        </Modal>
    )
}
