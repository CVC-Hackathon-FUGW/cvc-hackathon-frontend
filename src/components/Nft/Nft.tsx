import { Image, Button, Avatar, Text, Tabs } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Nft(props:any){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/nft/id/details`)
    }

    return <div className='p-14 flex gap-16 justify-center'>
    <div>
        <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={280}
            alt="Norway"
            radius={5}
        />
        <Button className='block mt-4' size='lg' fullWidth variant='default' onClick={()=>handleClick()}>
            Details
        </Button>
        <Button className='mt-4' size='lg' fullWidth>
            Buy
        </Button>
    </div>
    <div>
        <div className='flex'>
            <Avatar size="lg" src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80" radius="xl" alt="it's me" />
            <Text ml={20} size={24}>Name</Text>
        </div>
        <div className='mt-5'>
            <Text size={28} weight={500}>Name NFT</Text>
            <Text size={28} weight={500}>$ 2.5 eth</Text>
            <Text size={20} weight={500}>8/15/2022</Text>
            <div className='mt-4'>
                <Tabs defaultValue="gallery">
                    <Tabs.List>
                        <Tabs.Tab value="Ownership">Ownership</Tabs.Tab>
                        <Tabs.Tab value="Creator" >Creator</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="Ownership" pt="xs">
                        Has no owner
                    </Tabs.Panel>

                    <Tabs.Panel value="Creator" pt="xs">
                        <div className='flex mt-4'>
                            <Avatar size="lg" src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80" radius="xl" alt="it's me" />
                            <Text ml={20}>Name</Text>
                        </div>

                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>

    </div>
</div>
}