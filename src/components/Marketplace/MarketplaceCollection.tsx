import { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import { Button, Input, Select, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import _ from "lodash";

const result = [
    {
        "collection_id": 1,
        "collection_name": "INS1D3RS", "token_address": "0xFB4b0A946AFbFb4267bB05B4e73e26481cEa983B",
        "image": "https://firebasestorage.googleapis.com/v0/b/cvc-hackathon-frontend.appspot.com/o/public%2F360039525_580853007589182_1246281386788593312_n.jpg?alt=media\u0026token=7dbef1eb-b992-466e-b3f9-f22e7b27da45",
        "is_active": true,
        "volume": 100,
    },
    {
        "collection_id": 2,
        "collection_name": "ABCD", "token_address": "0xFB4b0A946AFbFb4267bB05B4e73e26481cEa983B",
        "image": "https://firebasestorage.googleapis.com/v0/b/cvc-hackathon-frontend.appspot.com/o/public%2F360039525_580853007589182_1246281386788593312_n.jpg?alt=media\u0026token=7dbef1eb-b992-466e-b3f9-f22e7b27da45",
        "is_active": true,
        "volume": 80,
    },
    {
        "collection_id": 2,
        "collection_name": "EFGH", "token_address": "0xFB4b0A946AFbFb4267bB05B4e73e26481cEa983B",
        "image": "https://firebasestorage.googleapis.com/v0/b/cvc-hackathon-frontend.appspot.com/o/public%2F360039525_580853007589182_1246281386788593312_n.jpg?alt=media\u0026token=7dbef1eb-b992-466e-b3f9-f22e7b27da45",
        "is_active": true,
        "volume": 10,

    },
    {
        "collection_id": 4,
        "collection_name": "AAAA", "token_address": "0xFB4b0A946AFbFb4267bB05B4e73e26481cEa983B",
        "image": "https://firebasestorage.googleapis.com/v0/b/cvc-hackathon-frontend.appspot.com/o/public%2F360039525_580853007589182_1246281386788593312_n.jpg?alt=media\u0026token=7dbef1eb-b992-466e-b3f9-f22e7b27da45",
        "is_active": true,
        "volume": 50,

    }
]

export default function MarketPlaceCollection() {
    const [collections, setCollections] = useState([] as any)
    const [sort, setSort] = useState('collection_name')
    const [name, setName] = useState('')
    useEffect(() => {
        fetch('https://cvc-hackathon-backend.up.railway.app/v1/marketCollections')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Lỗi khi gọi API: " + response.status);
                }
            })
            .then(data => {
                const sortedCollections = _.sortBy(data, sort);
                setCollections(sortedCollections);
            })
            .catch(error => {
                console.error(error);
            });
        // const sortedCollections = _.sortBy(result, sort);
        // setCollections(sortedCollections)
    }, [sort])

    const handleSearchCollection = () => {
        fetch(`https://cvc-hackathon-backend.up.railway.app/v1/marketCollections?name=${name}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Lỗi khi gọi API: " + response.status);
                }
            })
            .then(data => {
                const sortedCollections = _.sortBy(data, sort);
                setCollections(sortedCollections);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleChangeSortField = (value: string) => {
        setSort(value)
    }

    const renderItems = collections.map((item: any) => {
        if (item.is_active === true) {
            return (
                <CollectionCard key={item.collection_id} collection={item} />
            )
        }
        return;
    })

    return (
        <div className="pl-20 pr-20">
            <div>
                <h1 className="text-[#7645D9]">Collections</h1>

                <div className="flex items-center gap-8">
                    <div className="mt-7 flex gap-1">
                        <div>
                            <Input
                                icon={<IconSearch />}
                                variant="filled"
                                size="sm"
                                placeholder="search collectibles by name..."
                                w={500}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <Button onClick={handleSearchCollection}>Search</Button>
                    </div>

                    <Select
                        label="Sort by"
                        placeholder="Pick one"
                        onChange={handleChangeSortField}
                        data={[
                            { value: 'collection_name', label: 'Name' },
                            { value: 'volume', label: 'Volume' },
                        ]}
                    />
                </div>


            </div>
            <div className="mt-10 flex gap-8 justify-between">
                {
                    renderItems
                }
            </div>

        </div>
    )
}