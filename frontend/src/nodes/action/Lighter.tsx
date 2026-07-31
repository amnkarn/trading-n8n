import type { SUPPORTED_ASSETS } from "@/components/TriggerSheet";
import { Zap } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export type TradingMetadata={
    type:"LONG" | "SHORT",
    qty:number,
    symbol:typeof SUPPORTED_ASSETS[keyof typeof SUPPORTED_ASSETS],
}

const styles = {
  container: "flex flex-col items-center justify-center px-4 py-3 min-w-[150px] min-h-[70px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl rounded-lg text-slate-800 dark:text-slate-100 font-medium transition-all hover:border-purple-500 hover:shadow-purple-500/20",
  header: "flex items-center gap-1.5 mb-2 text-purple-500 dark:text-purple-400",
  title: "text-[10px] uppercase tracking-wider font-bold",
  row: "flex w-full justify-between items-center bg-slate-100 dark:bg-slate-800/50 rounded px-2 py-1 mb-1.5",
  rowLast: "flex w-full justify-between items-center bg-slate-100 dark:bg-slate-800/50 rounded px-2 py-1",
  label: "text-[10px] text-slate-500 dark:text-slate-400",
  valueLong: "text-xs font-bold text-emerald-600 dark:text-emerald-400",
  valueShort: "text-xs font-bold text-rose-600 dark:text-rose-400",
  value: "text-xs font-bold text-slate-700 dark:text-slate-200",
  handle: "w-2.5 h-2.5 bg-purple-500 border-2 border-white dark:border-slate-900"
}

const Lighter = ({data}:{
  data:{
    metadata:TradingMetadata
  },
  
}) => {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <Zap size={14} />
          <span className={styles.title}>Lighter Trade</span>
      </div>
      <div className={styles.row}>
          <span className={styles.label}>Side</span>
          <span className={data.metadata.type === 'LONG' ? styles.valueLong : styles.valueShort}>{data.metadata.type}</span>
      </div>
      <div className={styles.rowLast}>
          <span className={styles.label}>{data.metadata.qty}</span>
          <span className={styles.value}>{data.metadata.symbol}</span>
      </div>
      <Handle type='target' position={Position.Left} className={styles.handle} />
      <Handle type='source' position={Position.Right} className={styles.handle} />
    </div>
    );

};
export default Lighter;