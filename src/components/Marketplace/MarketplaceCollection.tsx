import { useEffect, useState, useMemo } from "react";
import CollectionCard from "./CollectionCard";
import { Avatar, Button, Card, Input, Select, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import _, { debounce } from "lodash";
import { useQuery, QueryClient } from "@tanstack/react-query";
import api from "src/services/api";
import { Collection } from "src/types";
import { xdc } from "viem/chains";


export default function MarketPlaceCollection() {

    const [sortField, setSortField] = useState('')
    const [nameSearch, setNameSearch] = useState('')

    const { data: collections } = useQuery({
        queryKey: ['fetchMarketItems', nameSearch, sortField],
        queryFn: () => api.get<void, Collection[]>(`/marketCollections?name=${nameSearch}`),
        select: (data) => _.sortBy(data, sortField)
    });

    const handleSearch = debounce((value) => {
        setNameSearch(value.target.value)
    }, 400);


    const renderItems = collections?.map((item: any) => {
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
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <Select
                        label="Sort by"
                        placeholder="Pick one"
                        data={[
                            { value: 'volume', label: 'Volume' },
                        ]}
                        onChange={(value: any) => setSortField(value)}
                    />
                </div>
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {
                    renderItems
                }
                
            </div>
        </div>
    )
}