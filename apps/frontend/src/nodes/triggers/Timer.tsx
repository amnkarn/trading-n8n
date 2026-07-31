import { Handle, Position } from "@xyflow/react"
import { Clock } from "lucide-react"

export type TimerNodeMetadata={
   time:number
}

const styles = {
  container: "flex flex-col items-center justify-center px-3 py-2 min-w-[110px] min-h-[50px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl rounded-lg text-slate-800 dark:text-slate-100 font-medium transition-all hover:border-indigo-500 hover:shadow-indigo-500/20",
  header: "flex items-center gap-1 mb-1 text-indigo-500 dark:text-indigo-400",
  title: "text-[9px] uppercase tracking-wider font-bold",
  body: "text-xs",
  time: "text-indigo-600 dark:text-indigo-300 font-bold",
  handle: "w-2.5 h-2.5 bg-indigo-500 border-2 border-white dark:border-slate-900"
}

export const Timer = ({data}:{
data:{
    metadata:TimerNodeMetadata
}
}) => {
    return (
    <div className={styles.container}>
        <div className={styles.header}>
            <Clock size={14} />
            <span className={styles.title}>Timer</span>
        </div>
        <div className={styles.body}>Every <span className={styles.time}>{data.metadata.time}</span> sec</div>
        <Handle type='source' position={Position.Right} className={styles.handle} />
    </div>)
}