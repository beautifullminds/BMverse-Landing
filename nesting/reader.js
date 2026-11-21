const field = id => document.getElementById(id);
const characters = editions.catalog.filter(({id}) => id <= 7 || id === 9 || (id >= 13 && id <= 15));
for (const {id,name} of characters) field("character").add(new Option(name,id));
let sequence = 0;
function reset() {
  sequence++;
  field("result").hidden = true;
  field("status").textContent = "Check on chain to load the current selection.";
}
document.querySelector("form").addEventListener("input", reset);
window.ethereum?.on?.("chainChanged", reset);
const fact = (label, value) => {
  const dt = document.createElement("dt"), dd = document.createElement("dd");
  dt.textContent = label; dd.textContent = value;
  field("facts").append(dt,dd);
};
document.querySelector("form").onsubmit = async event => {
  event.preventDefault();
  const request = ++sequence;
  field("result").hidden = true;
  field("status").textContent = "Checking deployed code and reading the selected block…";
  try {
    const address = ethers.getAddress(field("address").value.trim());
    if (!window.ethereum) throw Error("Open this page in an Ethereum-compatible wallet browser.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const explorer = {1:"https://etherscan.io",11155111:"https://sepolia.etherscan.io"}[network.chainId];
    if (!explorer) throw Error("Select Ethereum mainnet or Sepolia in your wallet.");
    const head = await provider.getBlock("latest");
    const blockTag = head.number;
    const code = ethers.getBytes(await provider.getCode(address,blockTag));
    for (const ref of editions.refs) code.fill(0,ref.start,ref.start+ref.length);
    if (ethers.keccak256(code)!==editions.hash) throw Error("The deployed bytecode does not match this ANTVERSE nesting release.");
    const contract = new ethers.Contract(address,editions.abi,provider);
    const id = Number(field("character").value), options={blockTag};
    const [priceInfo,version,slots,paused] = await Promise.all([
      contract.quote(id,options),contract.loadoutVersion(id,options),
      Promise.all([1,2,3,4,5].map(slot=>contract.equipped(id,slot,options))),contract.paused(options)
    ]);
    let owner;
    try { owner = await contract.ownerOf(id,options); }
    catch(e) {
      if(e.code!=="CALL_EXCEPTION" || e.data?.slice(0,10)!==ethers.id("ERC721NonexistentToken(uint256)").slice(0,10)) throw e;
    }
    const names=["Jewel","Scene","Identity track","Relic","Potion"];
    const rows = await Promise.all(slots.map(async (token,index)=>{
      if (!token) return names[index]+" · Empty";
      const [holder,parent]=await Promise.all([contract.ownerOf(token,options),contract.parentOf(token,options)]);
      if(holder!==address || parent!==BigInt(id)) throw Error("Equipment and custody records disagree at this block.");
      const item=editions.catalog.find(x=>BigInt(x.id)===token);
      return names[index]+" · "+(item?.name || "Edition")+" #"+token+" · custody verified";
    }));
    if ((await provider.getBlock(blockTag)).hash!==head.hash) throw Error("The chain reorganized during this read. Check again.");
    if(request!==sequence)return;
    field("facts").replaceChildren();field("items").replaceChildren();
    field("title").textContent=characters.find(x=>x.id===id).name;
    fact("Network", network.chainId===1n?"Ethereum mainnet":"Sepolia testnet");
    fact("NFT contract",address);fact("Owner",owner || "Unminted");fact("Loadout revision",String(version));
    fact("Catalog mint price",ethers.formatEther(priceInfo[0])+" ETH");fact("Mint status",owner?"Already minted":paused?"Paused":"Available");
    for(const row of rows){const li=document.createElement("li");li.textContent=row;field("items").append(li);}
    field("block").href=explorer+"/block/"+blockTag;field("block").textContent="View block "+blockTag;
    field("result").hidden=false;field("status").textContent="Verified against the deployed contract at block "+blockTag+".";
  } catch(e) {
    if(request===sequence)field("status").textContent=e.shortMessage || e.message || "The blockchain read failed.";
  }
};
