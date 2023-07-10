import {Text} from '@mantine/core';

export default function TextContent(props:any){
    return(
        <div className='grid grid-cols-4'>
            <Text size='xl' className='col-span-1' weight={500}>{props.label}:</Text>
            <Text size='xl' className='col-span-3'>{props.value}</Text>
        </div>
    )
}