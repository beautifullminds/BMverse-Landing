const assets = genesisAssets;
const categories = ['All assets', 'Characters', 'Relics', 'Territories'];
const inventoryKey = 'antverse-genesis-inventory';
let category = categories[0];
let inventory;
try {
  const saved = JSON.parse(localStorage.getItem(inventoryKey) || '[]');
  inventory = Array.isArray(saved) ? saved : [];
} catch {
  inventory = [];
}
const filters = document.querySelector('.filters');
const grid = document.querySelector('.grid');
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
const modal = document.querySelector('#modal');
const content = document.querySelector('#dialog-content');
const imagePath = asset => 'art/' + Number(asset.id) + '.webp';
const price = asset => asset.price.toFixed(2) + ' ETH';
const owns = asset => inventory.includes(asset.id);

function render() {
  const query = search.value.trim().toLowerCase();
  const results = assets.filter(asset =>
    (category === categories[0] || asset.category === category) &&
    [asset.name, asset.id, asset.category, asset.rarity, asset.trait].some(value => value.toLowerCase().includes(query))
  );
  if (sort.value === 'low') results.sort((a, b) => a.price - b.price);
  if (sort.value === 'high') results.sort((a, b) => b.price - a.price);
  document.querySelector('.count').textContent = results.length + (results.length === 1 ? ' asset' : ' assets');
  grid.innerHTML = results.map(asset => '<article class="card"><button class="art-button" data-id="' + asset.id + '" aria-label="View ' + asset.name + '"><img src="' + imagePath(asset) + '" alt="" loading="lazy"><span class="badge">' + asset.rarity + '</span></button><div class="card-body"><div class="meta"><span>' + asset.category + '</span><span>#' + asset.id + '</span></div><h3>' + asset.name + '</h3><div class="card-foot"><strong>' + price(asset) + '</strong><button class="outline" data-id="' + asset.id + '">' + (owns(asset) ? 'Collected' : 'View asset') + '</button></div></div></article>').join('') || '<p class="muted">No assets match your search.</p>';
}
categories.forEach(label => {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('aria-pressed', String(label === category));
  button.addEventListener('click', () => {
    category = label;
    for (const item of filters.children) item.setAttribute('aria-pressed', String(item === button));
    render();
  });
  filters.append(button);
});
search.addEventListener('input', render);
sort.addEventListener('change', render);

function details(asset) {
  content.innerHTML = '<img class="detail-art" src="' + imagePath(asset) + '" alt="' + asset.name + '"><p class="kicker">' + asset.category + ' · ' + asset.rarity + ' · #' + asset.id + '</p><h2 id="dialog-title" class="detail-title">' + asset.name + '</h2><p class="muted">' + asset.story + '</p><p>Trait · <strong>' + asset.trait + '</strong></p><div class="actions"><button class="primary" id="acquire">' + (owns(asset) ? 'View my collection' : 'Collect for ' + price(asset) + ' · Demo') + '</button></div><p class="muted" id="feedback" role="status">Demo acquisition. No payment is required.</p>';
  const acquire = content.querySelector('#acquire');
  acquire.addEventListener('click', () => {
    if (owns(asset)) {
      showCollection();
      return;
    }
    inventory.push(asset.id);
    let message = 'Added to your collection.';
    try {
      localStorage.setItem(inventoryKey, JSON.stringify(inventory));
    } catch {
      message = 'Added for this session. Browser storage is unavailable.';
    }
    render();
    acquire.textContent = 'View my collection';
    content.querySelector('#feedback').textContent = message;
  });
  if (!modal.open) modal.showModal();
}

function showCollection() {
  const owned = assets.filter(owns);
  content.innerHTML = '<p class="kicker">GENESIS · DEMO INVENTORY</p><h2 id="dialog-title" class="detail-title">My collection</h2>' + (owned.length ? '<ul>' + owned.map(asset => '<li>' + asset.name + ' · #' + asset.id + '</li>').join('') + '</ul>' : '<p class="muted">Your collection is empty. Open an asset in the marketplace to collect it.</p>');
  if (!modal.open) modal.showModal();
  modal.querySelector('.close').focus();
}
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-id]');
  if (button) details(assets.find(asset => asset.id === button.dataset.id));
});
document.querySelector('#collection').addEventListener('click', showCollection);
render();

const hero = document.querySelector('.hero');
let framePending = false;
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => {
    const bounds = hero.getBoundingClientRect();
    if (bounds.bottom > 0) hero.style.setProperty('--offset', Math.max(0, -bounds.top) * 0.24 + 'px');
    framePending = false;
  });
}, { passive: true });
