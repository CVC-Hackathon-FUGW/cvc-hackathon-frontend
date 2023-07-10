import { Input, Title, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import CardNft from './CardNft';

const defaultValueNft = {
    id: 1,
    name: 'Brian Armstrong',
    price: 0.2,
}
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
            <div className='flex flex-wrap gap-16 mt-6'>

                <CardNft value={defaultValueNft} />
                <CardNft value={defaultValueNft} />
                <CardNft value={defaultValueNft} />
                <CardNft value={defaultValueNft} />

            </div>
        </div>
    )
}