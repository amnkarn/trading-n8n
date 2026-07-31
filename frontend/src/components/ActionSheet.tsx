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
import { Input } from "./ui/input";
import { SUPPORTED_ASSETS } from "./TriggerSheet";

export type ActionMetadata = {
    symbol?: string;
    qty?: number;
    side?: "long" | "short";
};

type NodeMetadata = ActionMetadata;

const SUPPORTED_ACTION = [{
    id: "hyperliquid", title: "Hyperliquid",
    description: "place a trade on hyperliquid",
}, {
    id: "lighter", title: "Lighter",
    description: "place a trade  on lighter",

}, {
    id: "backpack",
    title: "Backpack",
    description: "place a trade on backpack"
}]
export const ActionSheet = ({ onSelect }: {
    onSelect: (type: NodeKind, metadata: NodeMetadata,) => void
}) => {
    const [selectAction, setSelectAction] = useState(SUPPORTED_ACTION[0].id);
    const [side, setSide] = useState<"long" | "short">("long");
    const [metadata, setMetadata] = useState<ActionMetadata>({
        symbol: Object.keys(SUPPORTED_ASSETS)[0],
        qty: 0,
        side: "long"
    });

    console.log(
        "selected action ", selectAction
    );
    return (
        <Sheet open={true}>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>select Action</SheetTitle>
                    <SheetDescription>
                        select the type of Action
                    </SheetDescription>
                </SheetHeader>
                <Select value={selectAction} onValueChange={(value) => { setSelectAction(value) }} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a trigger">
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {SUPPORTED_ACTION.map(({ id, title }) => {
                                return <SelectItem key={id} value={id}>{title}</SelectItem>
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {(selectAction === "hyperliquid" || selectAction === "lighter" || selectAction === "backpack") && <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Side</div>
                        <Select value={side} onValueChange={(value: "long" | "short") => {
                            setSide(value);
                            setMetadata(prev => ({ ...prev, side: value }));
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="select side" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={"long"}>LONG</SelectItem>
                                    <SelectItem value={"short"}>SHORT</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Symbol</div>
                        <Select value={metadata?.symbol} onValueChange={(value) => {
                            setMetadata(metadata => ({
                                ...metadata,
                                symbol: value
                            }))
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="select an asset" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    {Object.keys(SUPPORTED_ASSETS).map((item: string) => (
                                        <SelectItem value={item}>{item}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Qty</div>
                        <Input type="number" onChange={(e) => setMetadata(
                            {
                                ...metadata,
                                qty: Number(e.target.value)
                            }
                        )}></Input>
                    </div>
                </div>}


                <SheetFooter>
                    <Button
                        className="border-red-300"
                        onClick={() => {
                            onSelect(
                                selectAction as NodeKind,
                                metadata,
                            )
                        }}>
                        Add Action
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}