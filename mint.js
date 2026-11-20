const mintButton = document.querySelector("#mint-button");
const mintStatus = document.querySelector("#mint-status");
const mintTransaction = document.querySelector("#mint-transaction");
let selectedEdition;
let selection = 0;
let busy = false;

const mintEnabled = /^0x[0-9a-f]{40}$/i.test(mintConfig.address) &&
  mintConfig.address.toLowerCase() !== "0x" + "0".repeat(40);
const word = value => BigInt(value).toString(16).padStart(64, "0");
const quantity = value => "0x" + BigInt(value).toString(16);

detail.addEventListener("nft:selected", event => {
  selectedEdition = event.detail;
  selection++;
  mintTransaction.hidden = true;
  mintButton.hidden = !selectedEdition.id || !mintEnabled;
  mintButton.textContent = "Connect wallet to mint";
  mintButton.disabled = busy;
  mintStatus.textContent = selectedEdition.id && !mintEnabled
    ? "Minting is pending contract deployment. Displayed prices are planned launch prices."
    : "";
});

mintButton.addEventListener("click", async () => {
  const item = selectedEdition;
  if (!mintEnabled || !item?.id || busy) return;
  const current = selection;
  const update = message => {
    if (selection === current) mintStatus.textContent = message;
  };
  const provider = window.ethereum;
  if (!provider?.request) {
    update("Open this page in an Ethereum wallet browser or install an Ethereum wallet.");
    return;
  }

  busy = true;
  mintButton.disabled = true;
  let hash;
  try {
    update("Connecting wallet…");
    const [buyer] = await provider.request({ method: "eth_requestAccounts" });
    if (!buyer) throw new Error("Choose a wallet account.");
    const chain = await provider.request({ method: "eth_chainId" });
    if (chain !== mintConfig.chainId) {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: mintConfig.chainId }] });
    }
    if (await provider.request({ method: "eth_chainId" }) !== mintConfig.chainId) {
      throw new Error("Switch to the collection’s Ethereum network.");
    }

    const id = word(item.id);
    const quote = await provider.request({
      method: "eth_call",
      params: [{ to: mintConfig.address, data: "0xed1bd76c" + id }, "latest"]
    });
    if (!/^0x[0-9a-f]{128}$/i.test(quote)) throw new Error("The contract quote is unavailable.");
    const price = BigInt("0x" + quote.slice(2, 66));
    const available = BigInt("0x" + quote.slice(66));
    if (available !== 1n) throw new Error("This edition is currently unavailable.");
    if (price !== BigInt(item.eth) * 10n ** 18n) throw new Error("The contract price differs from this listing.");
    if (selection !== current || !detail.open) return;

    update(`Review ${item.eth.toLocaleString()} ETH plus network fees in your wallet.`);
    hash = await provider.request({
      method: "eth_sendTransaction",
      params: [{ from: buyer, to: mintConfig.address, data: "0xa0712d68" + id, value: quantity(price) }]
    });
    if (selection === current) {
      mintTransaction.href = mintConfig.explorer + "/tx/" + hash;
      mintTransaction.hidden = false;
    }
    update("Transaction submitted. Waiting for confirmation…");
    for (let attempt = 0; attempt < 40 && selection === current && detail.open; attempt++) {
      if (await provider.request({ method: "eth_chainId" }) !== mintConfig.chainId) break;
      const receipt = await provider.request({ method: "eth_getTransactionReceipt", params: [hash] });
      if (receipt) {
        update(receipt.status === "0x1" ? "Mint confirmed. The NFT is in your wallet." : "The transaction reverted.");
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    update("Transaction submitted. Follow its confirmation in the block explorer.");
  } catch (error) {
    update(hash ? "Transaction submitted. Check the block explorer for its status." :
      error.code === 4001 ? "Wallet request canceled." : error.shortMessage || error.message || "Unable to mint.");
  } finally {
    busy = false;
    mintButton.disabled = false;
  }
});
