import { Text } from '@mantine/core';

export default function AvailablePool(props: any) {
  return (
    <div>
      <Text size="30px" weight={700}>
        XCR {props.number}
      </Text>
      <Text size={'sm'} color="DFD3B8" weight={500}>
        {props.description}
      </Text>
    </div>
  );
}
