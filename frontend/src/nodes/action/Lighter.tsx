import type { SUPPORTED_ASSETS } from "@/components/TriggerSheet";

import type { PriceTriggerMetadata } from "../triggers/PriceTrigger";
import { Handle } from "node_modules/@xyflow/react/dist/esm/components/Handle";
import { Position } from "@xyflow/react";
export type TradingMetadata={
    type:"LONG" | "SHORT",
    qty:number,
    symbol:typeof SUPPORTED_ASSETS[keyof typeof SUPPORTED_ASSETS],
}
const Lighter = ({data}:{
  data:{
    metadata:TradingMetadata
  },
  
}) => {

  return (
    <>
    <div className="p-4 border">
      Lighter Trade 
      <div>{data.metadata.type}</div>
      <div>{data.metadata.qty}</div>
      <div>{data.metadata.symbol}</div>
    </div>

    </>
    );

};
export default Lighter;