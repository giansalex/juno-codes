import { fromBase64, fromUtf8 } from "@cosmjs/encoding";
import { Decimal } from "@cosmjs/math";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

export function ellideMiddle(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = Math.ceil((maxOutLen - ellide.length) / 2);
  const tailLen = Math.floor((maxOutLen - ellide.length) / 2);
  return str.slice(0, frontLen) + ellide + str.slice(str.length - tailLen, str.length);
}

export function ellideRight(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = maxOutLen - ellide.length;
  return str.slice(0, frontLen) + ellide;
}

// NARROW NO-BREAK SPACE (U+202F)
const thinSpace = "\u202F";

function printableCoin(coin: Coin): string {
  if (coin.denom?.startsWith("u")) {
    const ticker = coin.denom.slice(1).toUpperCase();
    return Decimal.fromAtomics(coin.amount ?? "0", 6).toString() + thinSpace + ticker;
  } else {
    return coin.amount + thinSpace + coin.denom;
  }
}

export function printableBalance(balance: readonly Coin[]): string {
  if (balance.length === 0) return "–";
  return balance.map(printableCoin).join(", ");
}

export function parseMsgContract(msg: Uint8Array): any {
  const json = fromUtf8(msg);

  return JSON.parse(json);
}

export function parseAckResult(ack: Uint8Array): any {
  const json = fromUtf8(ack);
  const ackData = JSON.parse(json);
  if (!ackData.result) {
    return ackData;
  }

  try {
    const jsonResult = fromUtf8(fromBase64(ackData.result));
    const ackResult = JSON.parse(jsonResult);

    return {
      result: ackResult,
    };
  } catch (e) {
    return ackData;
  }
}

export async function sha256(data: Uint8Array): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', data)

  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}
