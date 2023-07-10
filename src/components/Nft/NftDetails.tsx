import { Title, Image, Button, Card } from '@mantine/core';
import TextContent from './TextContent';

const defaultValue = [
    {
        label: 'Item-ID',
        value: 3,
    },
    {
        label: 'Name',
        value: 'Ape Army',
    },
    {
        label: 'Creator',
        value: '0xBB8fBE594123a2eC70aBd6a8478fa6991ebDBB69',
    },
    {
        label: 'Desciption',
        value: 'Vivamus ultrices feugiat sem, a condimentum tellus dignissim sit amet. Praesent euismod arcu vitae sapien ullamcorper semper.',
    },
    {
        label: 'Price',
        value: '2.5 ETH',
    },
    {
        label: 'Sold',
        value: 'unsold',
    },
    {
        label: 'Token-ID',
        value: 3,
    },
    {
        label: 'NFT Url',
        value: 'https://ipfs.io/ipfs/bafybeidzeojceo2yzsuefjhdjhnqt3j5x3i7nlebassrka7npdulgc3ho4/ape-army.png.image/png',
    }
]

export default function NftDetails() {
    return (
        <div className='p-3'>
            <div className='flex justify-center mb-4'>
                <Title>DETAILS</Title>
            </div>
            <div className='flex justify-between p-10'>
                <Card shadow="sm" padding="lg" radius="md" withBorder mr={20}>
                    {
                        defaultValue.map((field)=>(<TextContent {...field}/>))
                    }
                </Card>
                <div>
                    <Image
                        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                        height={280}
                        alt="Norway"
                        radius={5}
                    />
                    <Button fullWidth mt={10} className='rounded-md' variant="gradient">View on market</Button>
                </div>
            </div>

        </div>
    )
}