import { Handle, Position } from "@xyflow/react"
import { TrendingUp } from "lucide-react"

export type AssetTypes={
    USD:"USD",
    BTC:"BTC",

}
export type PriceTriggerMetadata={
    asset:string,
    price:string,
}

const styles = {
  container: "flex flex-col items-center justify-center px-4 py-3 min-w-[130px] min-h-[60px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl rounded-lg text-slate-800 dark:text-slate-100 font-medium transition-all hover:border-emerald-500 hover:shadow-emerald-500/20",
  header: "flex items-center gap-1.5 mb-1.5 text-emerald-500 dark:text-emerald-400",
  title: "text-[10px] uppercase tracking-wider font-bold",
  body: "flex items-baseline gap-1.5",
  asset: "text-sm font-bold",
  price: "text-sm text-emerald-600 dark:text-emerald-300",
  handle: "w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900"
}

export const PriceTrigger = ({data,isConnectable}:{
data:{
    metadata:PriceTriggerMetadata
},isConnectable:boolean
}) => {
    return     (
    <div className={styles.container}>
        <div className={styles.header}>
            <TrendingUp size={14} />
            <span className={styles.title}>Price Trigger</span>
        </div>
        <div className={styles.body}>
            <span className={styles.asset}>{data.metadata.asset}</span>
            <span className={styles.price}>${data.metadata.price}</span>
        </div>
        <Handle type='source' position={Position.Right} className={styles.handle} />
    </div>
)}