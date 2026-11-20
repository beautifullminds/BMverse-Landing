const characters = {
  "anton": {
    "name": "Anton Antstein",
    "role": "Cyber scientist",
    "copy": "View Anton Antstein from the front, at a three-quarter angle, and in profile."
  },
  "engineer": {
    "name": "Gold-Black Engineer",
    "role": "Drone engineer",
    "copy": "View Gold-Black Engineer from the front, at a three-quarter angle, and in profile."
  },
  "crimson": {
    "name": "Crimson Sunburst",
    "role": "Solar mystic",
    "copy": "View Crimson Sunburst from the front, at a three-quarter angle, and in profile."
  },
  "sapphire": {
    "name": "Sapphire Monarch",
    "role": "Royal guardian",
    "copy": "View Sapphire Monarch from the front, at a three-quarter angle, and in profile."
  },
  "coral": {
    "name": "Coral Insectoid",
    "role": "Cyber City character",
    "copy": "View Coral Insectoid from the front, at a three-quarter angle, and in profile."
  },
  "jade": {
    "name": "Jade Orbital Guardian",
    "role": "Orbital guardian",
    "copy": "View Jade Orbital Guardian from the front, at a three-quarter angle, and in profile."
  },
  "emerald": {
    "name": "Emerald Sage",
    "role": "Energy sage",
    "copy": "View Emerald Sage from the front, at a three-quarter angle, and in profile."
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
