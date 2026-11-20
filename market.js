const $ = id => document.getElementById(id);
const collections = ['All items', 'Cyber City', 'ANTVERSE', 'BM Jewels'];
const grid = $('grid');
const dialog = $('detail');
let collection = collections[0];
let savedOnly = false;
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('bmverse-saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored);
} catch {}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(label, callback, className) {
  const node = element('button', label, className);
  node.type = 'button';
  node.addEventListener('click', callback);
  return node;
}

function link(label, href, className) {
  const node = element('a', label, className);
  node.href = href;
  return node;
}

function artwork(url, name, lazy = false) {
  const image = element('img');
  image.src = url;
  image.alt = name;
  if (lazy) image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.replaceWith(element('p', 'Artwork unavailable', 'empty-art'));
  }, { once: true });
  return image;
}

function detail(item, showCyber) {
  const visual = element('div');
  const mediaFrame = element('div');
  function displayArtwork(cyber) {
    mediaFrame.replaceChildren(artwork(cyber ? item.cyberImage : item.image, item.name));
  }
  displayArtwork(showCyber);
  visual.append(mediaFrame);
  if (item.cyberImage) {
    const toggle = button('', () => {
      showCyber = !showCyber;
      updateArtwork();
    });
    function updateArtwork() {
      displayArtwork(showCyber);
      toggle.textContent = showCyber ? 'Show original artwork' : 'Show Cyber City artwork';
    }
    updateArtwork();
    visual.append(toggle);
  }
  if (item.original) {
    const original = element('details');
    original.append(element('summary', 'Original character turnaround'), artwork(item.original, item.name + ' turnaround', true));
    visual.append(original);
  }
  if (item.imageUrl && item.image !== item.imageUrl) visual.append(link('Original OpenSea media', item.imageUrl));
  if (item.animationUrl) {
    const media = element('p');
    media.append(link('Open original audio or animation', item.animationUrl));
    visual.append(media);
  }
  const info = element('div');
  const title = element('h2', item.name);
  title.id = 'item-title';
  info.append(element('p', item.collection + ' · ' + item.category, 'eyebrow'), title);
  if (item.description) info.append(element('p', item.description, 'description'));
  if (item.attributes?.length) {
    const traits = element('dl', null, 'traits');
    for (const trait of item.attributes) {
      const pair = element('div');
      pair.append(element('dt', trait.traitType), element('dd', String(trait.value)));
      traits.append(pair);
    }
    info.append(element('h3', 'Traits'), traits);
  }
  if (item.url) {
    const facts = element('dl', null, 'facts');
    for (const [label, value] of Object.entries({
      Network: item.chain, Contract: item.contractAddress, 'Token ID': item.tokenId,
      Standard: item.standard, Supply: item.totalSupply
    })) {
      if (value != null) facts.append(element('dt', label), element('dd', String(value)));
    }
    info.append(element('h3', 'Token details'), facts);
    const metadata = element('details');
    const source = { ...item };
    for (const key of ['image', 'cyberImage', 'category', 'collection']) delete source[key];
    metadata.append(element('summary', 'Source metadata'), element('pre', JSON.stringify(source, null, 2)));
    info.append(metadata);
    if (item.enforcement?.isDisabled || item.enforcement?.status === 'DISABLED') info.append(element('p', 'Trading disabled on OpenSea.'));
    info.append(link('View on OpenSea', item.url, 'primary'));
  }
  const layout = element('div', null, 'detail-grid');
  layout.append(visual, info);
  $('item-detail').replaceChildren(layout);
  dialog.showModal();
}

function card(item) {
  const node = element('article', null, 'card');
  const showCyber = collection === 'Cyber City' && Boolean(item.cyberImage);
  const view = button('', () => detail(item, showCyber), 'open');
  const body = element('span', null, 'body');
  body.append(element('small', showCyber ? 'Cyber City' : item.collection), element('strong', item.name), element('span', item.category));
  view.append(artwork(showCyber ? item.cyberImage : item.image, '', true), body);
  const favorite = button('', () => {
    if (saved.has(item.id)) saved.delete(item.id);
    else saved.add(item.id);
    try { localStorage.setItem('bmverse-saved', JSON.stringify([...saved])); } catch {}
    if (savedOnly) {
      render();
      $('saved').focus();
    } else {
      syncFavorite();
    }
  }, 'favorite');
  function syncFavorite() {
    const active = saved.has(item.id);
    favorite.textContent = active ? '♥' : '♡';
    favorite.setAttribute('aria-pressed', String(active));
    favorite.setAttribute('aria-label', 'Save ' + item.name);
  }
  syncFavorite();
  node.append(view, favorite);
  return node;
}

function inCollection(item) {
  return collection === collections[0] || item.collection === collection ||
    (collection === 'Cyber City' && Boolean(item.cyberImage) && item.name !== 'Anton Antstein');
}

function render() {
  const query = $('search').value.trim().toLowerCase();
  const category = $('category').value;
  const sort = $('sort').value;
  const result = marketItems.filter(item => {
    if (!inCollection(item)) return false;
    if (category && item.category !== category) return false;
    if (savedOnly && !saved.has(item.id)) return false;
    return [item.name, item.tokenId, ...(item.attributes || []).flatMap(t => [t.traitType, t.value])]
      .join(' ').toLowerCase().includes(query);
  });
  if (sort !== 'featured') result.sort((a, b) => a.name.localeCompare(b.name) * (sort === 'asc' ? 1 : -1));
  $('count').textContent = result.length + (result.length === 1 ? ' item' : ' items');
  grid.replaceChildren(...result.map(card));
  if (!result.length) grid.append(element('p', 'No items match your filters.', 'muted'));
}

function updateCategories() {
  const previous = $('category').value;
  const options = [...new Set(marketItems.filter(inCollection).map(item => item.category))].sort();
  $('category').replaceChildren(new Option('All categories', ''), ...options.map(name => new Option(name, name)));
  if (options.includes(previous)) $('category').value = previous;
}

for (const name of collections) {
  const tab = button(name, () => {
    collection = name;
    for (const option of $('collections').children) option.setAttribute('aria-pressed', String(option === tab));
    updateCategories();
    render();
  });
  tab.setAttribute('aria-pressed', String(collection === name));
  $('collections').append(tab);
}
$('search').addEventListener('input', render);
$('sort').addEventListener('change', render);
$('category').addEventListener('change', render);
$('saved').addEventListener('click', () => {
  savedOnly = !savedOnly;
  $('saved').setAttribute('aria-pressed', String(savedOnly));
  render();
});
$('close').addEventListener('click', () => dialog.close());

function showAccounts(accounts) {
  const account = accounts[0];
  $('wallet').textContent = account ? account.slice(0, 6) + '…' + account.slice(-4) : 'Connect wallet';
  $('wallet-status').hidden = true;
}

const wallet = window.ethereum;
wallet?.on?.('accountsChanged', showAccounts);
wallet?.request({method: 'eth_accounts'}).then(showAccounts).catch(() => {});
$('wallet').addEventListener('click', async () => {
  const status = $('wallet-status');
  try {
    if (!wallet) throw new Error('Open BMverse in an Ethereum wallet browser or install an Ethereum wallet extension.');
    showAccounts(await wallet.request({method: 'eth_requestAccounts'}));
  } catch (error) {
    status.textContent = error.code === 4001 ? 'Wallet connection canceled.' : error.message;
    status.hidden = false;
  }
});
updateCategories();
render();
