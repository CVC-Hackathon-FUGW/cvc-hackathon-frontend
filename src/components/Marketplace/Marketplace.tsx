import { Input, Title,Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import CardNft from './CardNft';
export default function Marketplace() {

    return (
        <div className='p-7'>
            <div className='flex justify-center mb-4'>
                <Title>MARKETPLACE</Title>
            </div>
            <Input
                icon={<IconSearch />}
                variant="filled"
                size="sm"
                placeholder="search collectibles by name..."
                w={500}
            />
            <div className='flex flex-wrap gap-12 mt-6'>
                
                <CardNft/>
                <CardNft/>
                <CardNft/>
                <CardNft/>
                <CardNft/>
                <CardNft/>
            </div>
        </div>
    )
}