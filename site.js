const characters = {
  anton: {
    name: "Anton Antstein",
    role: "Cyber scientist",
    copy: "Anton studies the city’s energy systems from the rooftops, using portable holograms to map what keeps the towers alive."
  },
  sapphire: {
    name: "Sapphire Monarch",
    role: "Royal guardian",
    copy: "A winged guardian of the orbital halls, the Sapphire Monarch wears crystalline armor that catches the city’s blue light."
  },
  crimson: {
    name: "Crimson Sunburst",
    role: "Solar mystic",
    copy: "The Crimson Sunburst channels radiant energy through a sunburst crown and rings of red light."
  }
};

const menu = document.querySelector(".menu");
const nav = document.querySelector("#nav");

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
}

menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") === "false"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));

const profile = document.querySelector("#profile");
const artwork = document.querySelector("#profile-art");

document.querySelectorAll("[data-character]").forEach(card => {
  card.addEventListener("click", () => {
    const id = card.dataset.character;
    const character = characters[id];
    document.querySelector("#profile-title").textContent = character.name;
    document.querySelector("#profile-role").textContent = character.role.toUpperCase();
    document.querySelector("#profile-copy").textContent = character.copy;
    artwork.src = `assets/${id}.webp`;
    artwork.alt = `Three views of ${character.name}`;
    profile.showModal();
  });
});
