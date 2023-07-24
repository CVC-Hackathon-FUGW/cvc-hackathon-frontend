import { Image, Text } from '@mantine/core';
import React from 'react';
import banner from '/banner.png';

const Event = () => {
  return (
    <>
      <Text size="xl" weight="bold">
        Riskless Lending Grand Opening
      </Text>
      <Image src={banner} alt="banner" radius="md" />
      <Text size="sm" weight="bold">
        The first pool in Riskless Lending airdrop - NINE Collection NFTs
        Airdrop.
      </Text>
      <Text size="sm" weight="bold">
        Reward for this pool:
      </Text>
      <Text size="sm">
        2 XCR and 20 Nine NFTs in reward for this event.
        <br />
        You can convert your RENT token to XCR or to NFT.
      </Text>

      <Text size="sm" weight="bold">
        Rules:
      </Text>
      <Text size="sm">
        {`Minimum RENT can be converted to gift is 1001 RENT and maximum is 10000 RENT
If 1000 < RENT < 10000, RENT will be converted into XCR (0.01 XCR = 1000 RENT)
If RENT = 10000, RENT will be converted into a random NINE NFTs.
You can checkin once a day to gain RENT. Each checkin gain 100 RENT. 
Amount of RENT you have will be displayed in the middle of this page.
Go check us now !`}
      </Text>
    </>
  );
};

export default Event;
