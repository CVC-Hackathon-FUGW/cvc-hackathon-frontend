import { Card, Image, Group, Text, Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function CardNft(props: any) {
    const navigate = useNavigate();
    return (
        <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder w={300} h={490} className='cursor-pointer hover:scale-105' onClick={()=> navigate('/nft/id')}>
                <Card.Section>
                    <Image
                        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                        height={280}
                        alt="Norway"
                    />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                    <Text size={30} className='cursor-pointer'>Name NFT</Text>
                    <Text size={30}>$ 2.5 eth</Text>
                </Group>
                <Group>
                    <Avatar size="lg" src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80" radius="xl" alt="it's me" />
                    <Text size={24}>0xBB8fBE59412</Text>
                </Group>
            </Card>
        </div>
    )
}