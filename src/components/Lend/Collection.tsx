import { Avatar, Text } from '@mantine/core';
export default function Collection(props: any) {
    return (
        <div style={{display: "flex",alignItems: 'center', gap: '20px'}}>
            <Avatar size="lg" src={props.img} radius="xl" alt="it's me" />
            <Text size="xl" weight={700}>{props.name}</Text>
        </div>

    )
}