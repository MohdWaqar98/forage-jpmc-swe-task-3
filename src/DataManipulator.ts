import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | null,
  price_abc: number,
  price_def: number,
  timestamp: Date,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    // Extract price_abc and price_def from the server response
    const price_abc = serverResponds[0].top_ask && serverResponds[0].top_ask.price ? serverResponds[0].top_ask.price : 0;
    const price_def = serverResponds[1].top_ask && serverResponds[1].top_ask.price ? serverResponds[1].top_ask.price : 0;

    // Compute ratio and bounds based on the extracted prices
    const ratio = price_abc / price_def;
    const historicalAverageRatio = 1.0; // Adjust this to the 12-month historical average ratio
    const upper_bound = historicalAverageRatio * 1.1; // +10% of historical average
    const lower_bound = historicalAverageRatio * 0.9; // -10% of historical average
    const trigger_alert = (ratio > upper_bound || ratio < lower_bound) ? ratio : null;

    // Return data in Perspective's required format
    return [{
      ratio: ratio,
      upper_bound: upper_bound,
      lower_bound: lower_bound,
      trigger_alert: trigger_alert,
      price_abc: price_abc,
      price_def: price_def,
      timestamp: new Date(), // You can adjust this to the actual timestamp from the server if available
    }];
  }
}
