import { JSON, Process } from "@seda-protocol/as-sdk/assembly";
import { fetchBinance } from "./services/binance-service";
import { fetchKucoin } from "./services/kucoin-service";
import { fetchOkx } from "./services/okx-service";
import { median } from './services/median';

export function executionPhase(): void {
  const drInputsRaw = String.UTF8.decode(Process.getInputs().buffer);
  console.log('Fetching price for pair: ' + drInputsRaw);
  const drInputs = drInputsRaw.split('-');
  const symbolA = drInputs[0];
  const symbolB = drInputs[1];
  const prices: f64[] = [];

  const binance = fetchBinance(symbolA, symbolB);

  if (!binance.success) {
    console.error(binance.value);
  } else {
    const price = f64.parse(binance.value);
    console.log('Binance price: ' + price.toString());
    prices.push(price);
  }

  const kucoin = fetchKucoin(symbolA, symbolB);

  if (!kucoin.success) {
    console.error(kucoin.value);
  } else {
    const price = f64.parse(kucoin.value);
    console.log('Kucoin price: ' + price.toString());
    prices.push(price);
  }

  const okx = fetchOkx(symbolA, symbolB);

  if (!okx.success) {
    console.error(okx.value);
  } else {
    const price = f64.parse(okx.value);
    console.log('Okx price: ' + price.toString());
    prices.push(price);
  }

  const medianPrice = median(prices);

  Process.exit_with_message(0, medianPrice.toString());
}