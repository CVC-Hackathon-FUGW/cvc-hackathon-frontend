import { Card, Image, Group, Text, Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function CardNft(props: any) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/nft/${props.value.id}`)
    }
    return (
        <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder w={300} h={490} className='cursor-pointer hover:scale-105' onClick={() => handleClick()}>
                <Card.Section>
                    <Image
                        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                        height={280}
                        alt="Norway"
                    />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                    <Text size={24} weight={600}>#1195 Brian Armstrong</Text>

                </Group>
                <Group position="apart" mt="md" mb="xs">
                    <Text weight={500} color='yellow'>WIN NFT HEROES</Text>
                    <div className='w-10 h-8 bg-slate-400 flex justify-center align-middle rounded-sm font-bold'>CVC</div>
                </Group>

                <Group position="apart" mt="md" mb="xs">
                    <Text size={24}>Price</Text>
                    <div>
                        <Text size={24} weight={600}>0.2 XRC</Text>
                        <Text color='grey'><span>&#8776;</span> $ 99.03</Text>
                    </div>
                </Group>
            </Card>
        </div>
    )
}