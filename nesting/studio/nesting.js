(() => {
  const slots = [
    ["Jewel", "Jewels"], ["Scene", "Scenes"], ["Identity track", "Music"],
    ["Relic", "Artifacts"], ["Potion", "Potions"]
  ];
  const editions = nftCatalog.filter(item => Number.isInteger(item.id));
  const byId = new Map(editions.map(item => [item.id, item]));
  const characters = editions.filter(item => item.category === "Characters");
  const element = id => document.getElementById(id);
  const character = element("loadout-character");
  const controls = element("loadout-slots");
  const status = element("equipment-status");
  const live = mintEnabled && mintConfig.nesting === true;
  const builds = new Map();
  const selects = [];

  for (const item of characters) character.add(new Option(item.name, item.id));
  const selected = () => byId.get(Number(character.value));
  function render() {
    const parent = selected();
    const build = builds.get(parent.id) || [];
    const items = build.map(id => byId.get(id)).filter(Boolean);
    element("loadout-portrait").src = parent.image;
    element("loadout-portrait").alt = parent.name;
    element("loadout-caption").textContent = [parent.name, ...items.map(item => item.name)].join(" · ");
    let story = "";
    if (parent.id === 15 && build[2] === 12) {
      story = "Archive unlocked · Renata’s refrain. Above the last train, Renata hears three notes from a station the city erased.";
    } else if (parent.id === 2 && build[3] === 8 && build[0] === 19) {
      story = "Archive unlocked · The first gate. The Engineer turns the Origin Ring inside the Universe Hand. A service door opens onto the city’s original sky.";
    }
    element("loadout-story").textContent = story || "Archive clue · Reunite Renata with her identity track, or give the Engineer the Origin Ring and the Universe Hand.";
    selects.forEach((select, i) => { select.value = String(build[i] || 0); });
  }
  const readSelector = "0x20b82e68";
  const encode = value => BigInt(value).toString(16).padStart(64, "0");
  async function walletAction(action, slotIndex) {
    const parent = selected();
    const item = Number(selects[slotIndex]?.value || 0);
    const provider = window.ethereum;
    const lock = [character, ...controls.querySelectorAll("button, select"), element("check-equipment")];
    lock.forEach(control => { control.disabled = true; });
    try {
      if (!provider?.request) throw Error("Open the marketplace in a wallet browser.");
      if (await provider.request({method:"eth_chainId"}) !== mintConfig.chainId) throw Error("Select the collection network in your wallet.");
      const call = data => provider.request({method:"eth_call",params:[{to:mintConfig.address,data},"latest"]});
      const equipped = await Promise.all(slots.map(async (_, i) => {
        const result = await call(readSelector + encode(parent.id) + encode(i + 1));
        if (!/^0x[0-9a-f]{64}$/i.test(result)) throw Error("Equipment data is unavailable for this contract.");
        return Number(BigInt(result));
      }));
      element("chain-equipment").textContent = "On chain · " + (equipped.filter(Boolean).map(id => byId.get(id)?.name || "#" + id).join(", ") || "Empty loadout");
      if (action === "read") { status.textContent = "Equipped items refreshed."; return; }
      if (!item) throw Error("Select an edition in this slot first.");
      if (action === "equip" && equipped[slotIndex]) throw Error("Remove the current item before equipping another.");
      if (action === "unequip" && equipped[slotIndex] !== item) throw Error("Choose the currently equipped item to remove it.");
      const [from] = await provider.request({method:"eth_requestAccounts"});
      if (!from || await provider.request({method:"eth_chainId"}) !== mintConfig.chainId) throw Error("Check the wallet account and network.");
      const data = (action === "equip" ? "0x28257532" : "0xb512cffe") + encode(parent.id) + encode(item);
      const tx = {from, to:mintConfig.address, data};
      await provider.request({method:"eth_call",params:[tx,"latest"]});
      const hash = await provider.request({method:"eth_sendTransaction",params:[tx]});
      status.textContent = "Submitted " + hash + ". Read equipped items after confirmation.";
    } catch (error) { status.textContent = error.message || "Wallet operation failed."; }
    finally { lock.forEach(control => { control.disabled = false; }); }
  }
  slots.forEach(([title, category], i) => {
    const row = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = title + " ";
    const select = document.createElement("select");
    selects.push(select);
    select.add(new Option("Empty", 0));
    editions.filter(item => item.category === category).forEach(item => select.add(new Option(item.name, item.id)));
    select.onchange = () => {
      builds.set(selected().id, selects.map(control => Number(control.value)));
      render();
    };
    label.append(select);
    row.append(label);
    if (live) {
      for (const action of ["equip", "unequip"]) {
        const button = document.createElement("button");
        button.textContent = action === "equip" ? "Equip " + title : "Remove " + title;
        button.onclick = () => walletAction(action, i);
        row.append(button);
      }
    }
    controls.append(row);
  });
  character.onchange = () => { element("chain-equipment").textContent = ""; render(); };
  element("loadout-wallet").hidden = !live;
  element("check-equipment").onclick = () => walletAction("read");
  if (live) status.textContent = "Selections preview your loadout. Use the wallet buttons to change ownership.";
  render();
})();
