import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { NodeKind } from "./CreateWorkFlow"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { useState } from "react";
import { type PriceTriggerMetadata } from "@/nodes/triggers/PriceTrigger";
import { type TimerNodeMetadata } from "@/nodes/triggers/Timer";
import { Input } from "./ui/input";

type NodeMetadata = any;
export const SUPPORTED_ASSETS = {
    ETH: "ETH",
    BTC: "BTC",
    SOL: "SOL",
    USD: "USD"
}
const SUPPORTED_TRIGGERS = [{
    id: "timer", title: "Timer",
    description: "run this trigger every x seconds/minutes",

}, {
    id: "price-trigger",
    title: "Price Trigger",
    description: "runs whenever the price go above or below a certain number for an assets"
}]
export const TriggerSheet = ({ onSelect }: {
    onSelect: (kind: NodeKind, metadata: NodeMetadata) => void
}) => {

    const [metadata, setMetadata] = useState<PriceTriggerMetadata | TimerNodeMetadata>({
        time: 3600
    });

    const [selectedTrigger, setSelectedTrigger] = useState(SUPPORTED_TRIGGERS[0].id);

    const handleTriggerChange = (value: string) => {
        setSelectedTrigger(value);
        if (value === 'timer') {
            setMetadata({ time: 3600 });
        } else {
            setMetadata({ asset: 'ETH', price: '0' });
        }
    };

    const isTimerMetadata = (m: any): m is TimerNodeMetadata => 'time' in m;
    const isPriceMetadata = (m: any): m is PriceTriggerMetadata => 'asset' in m;

    console.log(
        "selected trigger ", selectedTrigger
    );
    return (
        <Sheet open={true}>
            <SheetTrigger>Op en</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>select Trigger</SheetTitle>
                </SheetHeader>
                <div className="space-y-4">
                    <SheetDescription>
                        select the type of trigger
                    </SheetDescription>
                    <Select value={selectedTrigger} onValueChange={handleTriggerChange} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a trigger">
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {SUPPORTED_TRIGGERS.map(({ id, title }) => {
                                    return <SelectItem key={id} value={id}>{title}</SelectItem>
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {selectedTrigger === "timer" && <div className="space-y-2">
                        <div className="text-sm font-medium">Number of seconds after which to run the timer</div>
                        <Input value={isTimerMetadata(metadata) ? metadata.time : ''} onChange={(e) => {
                            setMetadata({
                                time: Number(e.target.value)
                            })
                        }}
                        ></Input>
                    </div>}
                    {
                        selectedTrigger === "price-trigger" && <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Price:</div>
                                <Input type="text" value={isPriceMetadata(metadata) ? metadata.price : ''} onChange={(e) => {
                                    setMetadata({
                                        asset: isPriceMetadata(metadata) ? metadata.asset : 'ETH',
                                        price: e.target.value
                                    })
                                }}></Input>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Asset:</div>
                                <Select
                                    value={isPriceMetadata(metadata) ? metadata.asset : ''}
                                    onValueChange={(value) => {
                                        setMetadata(prev => ({
                                            ...prev,
                                            asset: value,
                                            price: isPriceMetadata(prev) ? prev.price : 0
                                        }))
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an asset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem key="ETH" value="ETH">ETH</SelectItem>
                                            <SelectItem key="BTC" value="BTC">BTC</SelectItem>
                                            <SelectItem key="SOL" value="SOL">SOL</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    }
                </div>
                <SheetFooter>
                    <Button
                        className="border-red-300"
                        onClick={() => {
                            const selected = SUPPORTED_TRIGGERS.find(t => t.id === selectedTrigger);
                            if (selected) {
                                onSelect(
                                    selectedTrigger as NodeKind,
                                    metadata
                                )
                            }
                        }}>
                        Add Trigger
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}