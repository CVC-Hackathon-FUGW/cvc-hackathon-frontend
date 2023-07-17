import { useEffect, useState, useMemo } from "react";
import CollectionCard from "./CollectionCard";
import { Button, Input, Select, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import _, { debounce } from "lodash";
import { useQuery, QueryClient } from "@tanstack/react-query";
import api from "src/services/api";
import { Collection } from "src/types";
import { xdc } from "viem/chains";

const queryClient = new QueryClient();

export default function MarketPlaceCollection() {

    //const [sort, setSort] = useState('collection_name')
    const [nameSearch, setNameSearch] = useState('')
    console.log(nameSearch)
    const { data: collections } = useQuery({
        queryKey: ['fetchMarketItems', nameSearch],
        queryFn: () => api.get<void, Collection[]>(`/marketCollections?name=${nameSearch}`),
    });

    // const handleChangeSortField = (value: string) => {
    //     setSort(value)
    // }

    const handleSearch = debounce((value) => {
        setNameSearch(value.target.value)
      },400);
    
    // const sortedCollections = useMemo(() => {
    //     if (sort) {
    //         return _.sortBy(collections, sort)
    //     }
    //     return collections;
    // }, [collections, sort]);


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