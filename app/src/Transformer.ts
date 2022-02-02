import { DAG } from "./domain/interfaces";

const Mint = "0x0000000000000000000000000000000000000000";
const Polkastarter = "0xee62650fa45ac0deb1b24ec19f983a8f85b727ab";
const PancakeSwap = "0xd6d206f59cc5a3bfa4cc10bc8ba140ac37ad1c89";
const Owner = "0x72571d815dd31fbde52be0b9d7ffc8344aede616";
const OtherWallet = "Other";

class Transformer {
  transform(data: any[]): DAG {
    let links: any = [];
    let HODL = 0;

    const getNodeByAddress = (addr: string) => {
      switch (addr) {
        case Mint:
          return 0;
        case Owner:
          return 1;
        case OtherWallet:
          return 2;
        case "HODL":
          return 3;
        case PancakeSwap:
          return 4;
        case Polkastarter:
          return 5;
      }
    };

    const addOrUpdateLink = (
      from: string,
      to: string,
      quantity: any,
      links: any[]
    ) => {
      let linkIndex = links.findIndex((link: any) => {
        return link.source === from && link.target === to;
      });
      let isLinkCreated = linkIndex >= 0;
      if (!isLinkCreated) {
        links.push({
          source: from,
          target: to,
          value: Number(quantity),
        });
      } else {
        links[linkIndex].value += Number(quantity);
      }
      
    };
    data.forEach((entry, index) => {
      let { From, To, Quantity } = entry;
      Quantity = Quantity.split(",").join("");
      let isFromMint = From === Mint;
      let isFromPriWallet = From === Owner;
      let isFromPolkstarter = From === Polkastarter;
      let toPriWallet = To === Owner;
      let toPancake = To === PancakeSwap;
      let toOtherWallets = !toPriWallet && !toPancake;
      // Possible base Transaction conditions to render in graph.
      let baseConditions =
        (isFromMint && toPriWallet) ||
        (isFromPolkstarter && toPriWallet) ||
        (isFromPolkstarter && toPancake) ||
        (isFromPriWallet && toPancake);
      if (baseConditions) addOrUpdateLink(From, To, Quantity, links);
      // if transactions are going into other wallets then add link for that.
      if (
        (isFromPolkstarter && toOtherWallets) ||
        (isFromPriWallet && toOtherWallets)
      ) {
        addOrUpdateLink(From, OtherWallet, Quantity, links);
      }
      // Count all transactions coming into primary wallet
      if (toPriWallet) {
        HODL += Number(Quantity);
      }
      // Subtract outgoing transactions from primary wallet
      if (isFromPriWallet) {
        if (toOtherWallets || toPancake) {
          HODL -= Number(Quantity);
        }
      }
      // finally create the HODL link when the loop ends.
      if (index === data.length - 1) {
        addOrUpdateLink(Owner, "HODL", HODL, links);
      }
    });

    console.log(links);

    return {
      nodes: [
        {
          nodeId: 0,
          color: 'green',
          name: "Mint",
        },
        {
          nodeId: 1,
          name: "Owner",
          color: 'cyan'
        },
        {
          nodeId: 2,
          name: "Other Wallet",
          color: 'yellow'
        },
        {
          nodeId: 3,
          name: "HODL",
          color: 'green'
        },
        {
          nodeId: 4,
          name: "PancakeSwap",
          color: 'red',
        },
        {
          nodeId: 5,
          name: "Polkastarter",
          color: 'blue'
        },
      ],
      links: links.map((l: any) => ({
        source: getNodeByAddress(l.source),
        target: getNodeByAddress(l.target),
        value: l.value
      })),
    };
  }
}

export default new Transformer();
