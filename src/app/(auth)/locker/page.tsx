'use client'
import { Sidebar } from "../../../components/ui/sidebar/sidebar";
import { Card } from "../../../components/ui/cards/card";
import { KeyIcon, AlertTriangleIcon } from "lucide-react";
import React, { useEffect } from "react";


export const lockerList = [
    {
        id: 1,
        name: "SM - 01",
        status: "active",
    },
    {
        id: 2,
        name: "SM - 02",
        status: "inactive",
    },
    {
        id: 3,
        name: "SM - 03",
        status: "active",
    },
]


interface Item {
    id: number;
    name: string;
    status: string;
}

export default function LockerPage() {
    const [data, setData] = React.useState<Item[]>(lockerList);

    useEffect(() => {
        setData(lockerList);
    }, [])
    
  return (
    <>
        <Sidebar />
        <div className="flex h-screen w-full flex-col items-center justify-center bg-center bg-cover space-y-6">
            <h1 className="text-2xl font-bold">Locker</h1>

            <div className="flex gap-8">

                {
                    data.map((item) => (
                        <Card key={item.id} className="w-40 h-64 bg-green-500 relative flex flex-col items-center justify-start p-4">
                            <div className="text-black font-bold mb-2">{item.name}</div>
                            <div className="space-y-1 mb-6">
                                <div className="w-24 h-2 bg-white"></div>
                                <div className="w-24 h-2 bg-white"></div>
                                <div className="w-24 h-2 bg-white"></div>
                            </div>
                            <div className="absolute left-4 bottom-4">
                                <AlertTriangleIcon className="text-white" size={24} />
                            </div>
                            <div className="absolute right-4 bottom-4">
                                <KeyIcon className="text-yellow-400" size={24} />
                            </div>
                            <div className="absolute left-4 top-24">
                                <div className="w-4 h-6 bg-black rounded-full"></div>
                            </div>
                        </Card>
                    ))
                }

                
                {/* <Card className="w-40 h-64 bg-green-500 relative flex flex-col items-center justify-start p-4">
                    <div className="text-black font-bold mb-2">SM - 01</div>
                        <div className="space-y-1 mb-6">
                        <div className="w-24 h-2 bg-white"></div>
                        <div className="w-24 h-2 bg-white"></div>
                        <div className="w-24 h-2 bg-white"></div>
                    </div>
                    <div className="absolute left-4 bottom-4">
                        <AlertTriangleIcon className="text-white" size={24} />
                    </div>
                    <div className="absolute right-4 bottom-4">
                        <KeyIcon className="text-yellow-400" size={24} />
                    </div>
                    <div className="absolute left-4 top-24">
                        <div className="w-4 h-6 bg-black rounded-full"></div>
                    </div>
                </Card> */}
            </div>
        </div>
    </>
  )
}
