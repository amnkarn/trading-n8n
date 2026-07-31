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

const styles = {
    sheetContent: "bg-slate-50 dark:bg-slate-900 border-l-slate-200 dark:border-l-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl",
    sheetHeader: "mb-6",
    sheetTitle: "text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent",
    sheetDesc: "text-slate-500 dark:text-slate-400 text-sm",
    selectTrigger: "w-full bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100",
    input: "w-full bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100",
    label: "text-sm font-medium text-slate-700 dark:text-slate-300",
    button: "w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all rounded-md h-10 text-sm",
    formContainer: "space-y-6 px-4"
}

export const TriggerSheet = ({ onSelect, onClose }: {
    onSelect: (kind: NodeKind, metadata: NodeMetadata) => void,
    onClose: () => void
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

    return (
        <Sheet open={true} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <SheetContent className={styles.sheetContent}>
                <SheetHeader className={styles.sheetHeader}>
                    <SheetTitle className={styles.sheetTitle}>Select Trigger</SheetTitle>
                    <SheetDescription className={styles.sheetDesc}>
                        Choose the event that starts this workflow.
                    </SheetDescription>
                </SheetHeader>
                <div className={styles.formContainer}>
                    <Select value={selectedTrigger} onValueChange={handleTriggerChange} >
                        <SelectTrigger className={styles.selectTrigger}>
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
                    {selectedTrigger === "timer" && <div className="space-y-1.5">
                        <div className={styles.label}>Number of seconds after which to run the timer</div>
                        <Input className={styles.input} value={isTimerMetadata(metadata) ? metadata.time : ''} onChange={(e) => {
                            setMetadata({
                                time: Number(e.target.value)
                            })
                        }}
                        ></Input>
                    </div>}
                    {
                        selectedTrigger === "price-trigger" && <div className="space-y-3">
                            <div className="space-y-1.5">
                                <div className={styles.label}>Price:</div>
                                <Input className={styles.input} type="text" value={isPriceMetadata(metadata) ? metadata.price : ''} onChange={(e) => {
                                    setMetadata({
                                        asset: isPriceMetadata(metadata) ? metadata.asset : 'ETH',
                                        price: e.target.value
                                    })
                                }}></Input>
                            </div>
                            <div className="space-y-1.5">
                                <div className={styles.label}>Asset:</div>
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
                                    <SelectTrigger className={styles.selectTrigger}>
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
                <SheetFooter className="mt-6">
                    <Button
                        className={styles.button}
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