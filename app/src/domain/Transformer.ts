import { DAG } from "./interfaces";

const Mint = "0x0000000000000000000000000000000000000000";
const Polkastarter = "0xee62650fa45ac0deb1b24ec19f983a8f85b727ab";
const PancakeSwap = "0xd6d206f59cc5a3bfa4cc10bc8ba140ac37ad1c89";
const Owner = "0x72571d815dd31fbde52be0b9d7ffc8344aede616";
const OtherWallet = "Other";
const HODL = "HODL";

interface Link {
  source: string;
  target: string;
  value: number;
}

export const transform = (
  data: { From: string; To: string; Quantity: string }[]
): DAG => {
  let links: Array<Link> = [];
  let hodlCount = 0;
  let transactionsProcessed = 0;
  let totalQUIDD = 0;

  const getNodeByAddress = (addr: string): number => {
    switch (addr) {
      case Mint:
        return 0;
      case Owner:
        return 1;
      case OtherWallet:
        return 2;
      case HODL:
        return 3;
      case PancakeSwap:
        return 4;
      case Polkastarter:
        return 5;
      default:
        return 2;
    }
  };

  const addOrUpdateLink = (from: string, to: string, quantity: number) => {
    let linkIndex = links.findIndex((link: Link) => {
      return link.source === from && link.target === to;
    });
    let isLinkCreated = linkIndex >= 0;
    if (!isLinkCreated) {
      links.push({
        source: from,
        target: to,
        value: quantity,
      });
    } else {
      links[linkIndex].value += quantity;
    }
    transactionsProcessed++;
    totalQUIDD += quantity;
  };

  data.forEach(({ From, To, Quantity }) => {
    const QuantityParsed: number = +Quantity.split(",").join("");
    let fromMint = From === Mint;
    let fromOwnerWallet = From === Owner;
    let fromPolkstarter = From === Polkastarter;
    let fromPancake = From === PancakeSwap;
    let fromOtherWallet = !(
      fromMint ||
      fromOwnerWallet ||
      fromPolkstarter ||
      fromPancake
    );
    let toOwnerWallet = To === Owner;
    let toPancake = To === PancakeSwap;
    let toPolkstarter = To === Polkastarter;
    let toOtherWallet = !(toOwnerWallet || toPancake || toPolkstarter);

    let processed = false;

    if (fromOtherWallet && toOwnerWallet && !processed) {
      addOrUpdateLink(OtherWallet, To, QuantityParsed);
      processed = true;
    }

    if (
      (fromPancake || fromPolkstarter) &&
      (toOwnerWallet) &&
      !processed
    ) {
      addOrUpdateLink(From, To, QuantityParsed);
      processed = true;
    }

    if ((toPancake || toPolkstarter) && (fromOwnerWallet) && !processed) {
      addOrUpdateLink(From, To, QuantityParsed);
      processed = true;
    }

    if (toOtherWallet && !fromOtherWallet && !processed) {
      addOrUpdateLink(From, OtherWallet, QuantityParsed);
      processed = true;
    }

    if (toOwnerWallet) {
      hodlCount += QuantityParsed;
    }
    if (fromOwnerWallet) {
      hodlCount -= QuantityParsed;
    }

    if (!processed && !(toOtherWallet || fromOtherWallet)) {
      addOrUpdateLink(From, To, QuantityParsed);
    }
  });

  addOrUpdateLink(Owner, HODL, hodlCount);

  return {
    transactionsProcessed,
    totalQUIDD,
    nodes: [
      {
        nodeId: 0,
        color: "green",
        name: "Mint",
      },
      {
        nodeId: 1,
        name: "Owner",
        color: "cyan",
      },
      {
        nodeId: 2,
        name: "Other Wallet",
        color: "yellow",
      },
      {
        nodeId: 3,
        name: "HODL",
        color: "green",
      },
      {
        nodeId: 4,
        name: "PancakeSwap",
        color: "red",
      },
      {
        nodeId: 5,
        name: "Polkastarter",
        color: "blue",
      },
    ],
    links: links.map((l: Link) => ({
      source: getNodeByAddress(l.source),
      target: getNodeByAddress(l.target),
      value: l.value,
    })),
  };
};
