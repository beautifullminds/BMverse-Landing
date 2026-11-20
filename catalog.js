const grid = document.querySelector("#nft-grid");
const category = document.querySelector("#nft-category");
const count = document.querySelector("#catalog-count");
const detail = document.querySelector("#nft-detail");
const detailMedia = document.querySelector("#nft-detail-media");
const nftLink = document.querySelector("#nft-link");
let activeCollection = "all";

function artworkFor(item, showName = false) {
  if (item.image) {
    const image = new Image();
    image.src = item.image;
    image.alt = showName ? item.name : "";
    image.loading = showName ? "eager" : "lazy";
    image.addEventListener("error", () => image.replaceWith(unavailableArtwork()), { once: true });
    return image;
  }
  return unavailableArtwork();
}

function unavailableArtwork() {
  const placeholder = document.createElement("span");
  placeholder.className = "nft-placeholder";
  placeholder.textContent = "Artwork unavailable";
  return placeholder;
}

function openNFT(item) {
  detailMedia.replaceChildren(artworkFor(item, true));
  document.querySelector("#nft-name").textContent = item.name;
  document.querySelector("#nft-type").textContent = item.category;
  document.querySelector("#nft-collection").textContent = item.collection;
  nftLink.href = item.url;
  nftLink.textContent = item.url.includes("/item/") ? "View item on OpenSea" : "View collection on OpenSea";
  detail.showModal();
}

function createCard(item) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "nft-card";
  card.dataset.collection = item.collection;
  const media = document.createElement("span");
  media.className = "nft-media";
  media.append(artworkFor(item));
  const body = document.createElement("span");
  body.className = "nft-card-body";
  const label = document.createElement("span");
  label.className = "nft-meta";
  label.textContent = `${item.collection} · ${item.category}`;
  const name = document.createElement("strong");
  name.textContent = item.name;
  const action = document.createElement("span");
  action.className = "nft-action";
  action.textContent = "View details";
  body.append(label, name, action);
  card.append(media, body);
  card.addEventListener("click", () => openNFT(item));
  return card;
}

function collectionItems() {
  return nftCatalog.filter(item => activeCollection === "all" || item.collection === activeCollection);
}

function renderCatalog() {
  const items = collectionItems().filter(item => category.value === "all" || item.category === category.value);
  grid.replaceChildren(...items.map(createCard));
  count.textContent = `${items.length} ${items.length === 1 ? "collectible" : "collectibles"}`;
}

function selectCollection(collection) {
  activeCollection = collection;
  document.querySelector(`input[name="collection"][value="${collection}"]`).checked = true;
  const categories = [...new Set(collectionItems().map(item => item.category))].sort();
  category.replaceChildren(new Option("All categories", "all"), ...categories.map(name => new Option(name, name)));
  renderCatalog();
}

document.querySelectorAll('input[name="collection"]').forEach(input => {
  input.addEventListener("change", () => selectCollection(input.value));
});
document.querySelectorAll(".site-footer [data-collection]").forEach(link => {
  link.addEventListener("click", () => selectCollection(link.dataset.collection));
});
category.addEventListener("change", renderCatalog);
selectCollection("all");
