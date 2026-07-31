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

const styles = {
    sheetContent: "bg-slate-50 dark:bg-slate-900 border-l-slate-200 dark:border-l-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl",
    sheetHeader: "mb-6",
    sheetTitle: "text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent",
    sheetDesc: "text-slate-500 dark:text-slate-400 text-sm",
    selectTrigger: "w-full bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100",
    input: "w-full bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100",
    label: "text-sm font-medium text-slate-700 dark:text-slate-300",
    button: "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-500/25 transition-all rounded-md h-10 text-sm",
    formContainer: "space-y-6 px-4"
}

export const ActionSheet = ({ onSelect, onClose }: {
    onSelect: (type: NodeKind, metadata: NodeMetadata,) => void,
    onClose: () => void
}) => {
    const [selectAction, setSelectAction] = useState(SUPPORTED_ACTION[0].id);
    const [side, setSide] = useState<"long" | "short">("long");
    const [metadata, setMetadata] = useState<ActionMetadata>({
        symbol: Object.keys(SUPPORTED_ASSETS)[0],
        qty: 0,
        side: "long"
    });

    return (
        <Sheet open={true} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <SheetContent className={styles.sheetContent}>
                <SheetHeader className={styles.sheetHeader}>
                    <SheetTitle className={styles.sheetTitle}>Select Action</SheetTitle>
                    <SheetDescription className={styles.sheetDesc}>
                        Choose what happens when the trigger fires.
                    </SheetDescription>
                </SheetHeader>
                <div className={styles.formContainer}>
                    <Select value={selectAction} onValueChange={(value) => { setSelectAction(value) }} >
                        <SelectTrigger className={styles.selectTrigger}>
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
                    {(selectAction === "hyperliquid" || selectAction === "lighter" || selectAction === "backpack") && <div className="space-y-3">
                        <div className="space-y-1.5">
                            <div className={styles.label}>Side</div>
                            <Select value={side} onValueChange={(value: "long" | "short") => {
                                setSide(value);
                                setMetadata(prev => ({ ...prev, side: value }));
                            }}>
                                <SelectTrigger className={styles.selectTrigger}>
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
                        <div className="space-y-1.5">
                            <div className={styles.label}>Symbol</div>
                            <Select value={metadata?.symbol} onValueChange={(value) => {
                                setMetadata(metadata => ({
                                    ...metadata,
                                    symbol: value
                                }))
                            }}>
                                <SelectTrigger className={styles.selectTrigger}>
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
                        <div className="space-y-1.5">
                            <div className={styles.label}>Qty</div>
                            <Input className={styles.input} type="number" onChange={(e) => setMetadata(
                                {
                                    ...metadata,
                                    qty: Number(e.target.value)
                                }
                            )}></Input>
                        </div>
                    </div>}
                </div>

                <SheetFooter className="mt-6">
                    <Button
                        className={styles.button}
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