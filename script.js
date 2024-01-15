import monsters from "./gameProperties/monsters.js";
import weapons from "./gameProperties/weapons.js";
import comsumables from "./gameProperties/comsumables.js";
import playerInfo from "./gameProperties/playerInfo.js";

let playerStats = playerInfo;

// let xp = 0;
// let xpMultiplier = 1;
// let level = 1;
// let xpToNextLevel = 20;
// let health = 100;
// let gold = 10;
// let currentWeapon = 0;
// let fighting;
// let monsterHealth;
// let inventory = ["Stick"];

let firstMonster;
let secondMonster;
let firstMonsterText;
let secondMonsterText;

function pickMonsters() {
	const filteredMonsters = monsters.filter((m) => {
		return m.level >= playerStats.level - 6 && m.level <= playerStats.level + 6;
	});

	firstMonster =
		filteredMonsters[Math.floor(Math.random() * filteredMonsters.length)];
	secondMonster =
		filteredMonsters[Math.floor(Math.random() * filteredMonsters.length)];
	if (firstMonster === secondMonster) {
		pickMonsters();
	} else {
		firstMonsterText = firstMonster.name;
		secondMonsterText = secondMonster.name;
	}
}

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const levelText = document.querySelector("#levelText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const store = document.querySelector("#store");
const currentWeaponText = document.querySelector("#weaponText");
const requiredXpLevelUpText = document.querySelector("#requiredXpLevelUp");
const weaponDamageText = document.querySelector("#weaponDamageText");
const bestiaryButton = document.querySelector("#bestiaryButton");

const locations = [
	{
		name: "town square",
		"button text": ["Go to store", "Go to dungeon", "Fight dragon"],
		"button functions": [goStore, goCave, fightDragon],
		text: 'You are in the town square. You see a sign that says "Store".',
	},
	{
		name: "store",
		"button text": [
			"Go to town square",
			"Go to town square",
			"Go to town square",
		],
		"button functions": [goTown, goTown, goTown],
		text: "You enter the store.",
	},
	{
		name: "cave",
		"button text": [
			`Fight ${firstMonsterText}`,
			`Fight ${secondMonsterText}`,
			"Go to town square",
		],
		"button functions": [
			() => fightMonster(firstMonster),
			() => fightMonster(secondMonster),
			goTown,
		],
		text: "You enter the cave. You see some monsters.",
	},
	{
		name: "fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goTown],
		text: ` You are fighting a monster.`,
	},
	{
		name: "kill monster",
		"button text": [
			"Go to town square",
			"Go to town square",
			"Go to town square",
		],
		"button functions": [goTown, goTown, goTown],
		text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
	},
	{
		name: "lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You die. ☠️",
	},
	{
		name: "win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
	},
];

const SPECIAL_EFFECTS = [
	{
		name: "Double Shot",
		description: "Allows the archer to fire two arrows in quick succession.",
	},
	{
		name: "Piercing Shot",
		description:
			"The crossbow bolt can pierce through enemy armor, dealing additional damage.",
	},
	{
		name: "Critical Thrust",
		description:
			"Increases the chance of landing a critical hit with the rapier's thrusting attacks.",
	},
	{
		name: "Sniper Shot",
		description:
			"Increases the accuracy and damage of longbow shots from a distance.",
	},
	{
		name: "Impale",
		description:
			"The spear can impale and immobilize the enemy for a short duration.",
	},
	{
		name: "Whirlwind",
		description:
			"Allows the flail to perform a spinning attack, hitting multiple nearby enemies.",
	},
	{
		name: "Disarm",
		description:
			"The whip can be used to disarm opponents by targeting their weapons.",
	},
	{
		name: "Cleave",
		description:
			"The battleaxe can cleave through multiple enemies in a single swing.",
	},
	{
		name: "Versatile Strikes",
		description:
			"The halberd allows for versatile attacks, hitting enemies with different parts of the weapon.",
	},
	{
		name: "Smash",
		description:
			"The giant war maul can smash through shields and heavy armor with ease.",
	},
	{
		name: "Decapitate",
		description:
			"The executioner's guillotine has a chance to instantly decapitate the opponent.",
	},
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
	monsterStats.style.display = "none";
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];
	text.innerText = location.text;
}

function createWeaponCard(weapon) {
	const card = document.createElement("div");
	card.classList.add("storeItemCard");
	card.style.backgroundColor = "purple";

	const title = document.createElement("h3");
	title.textContent = weapon.name;
	card.appendChild(title);

	const power = document.createElement("p");
	power.textContent = `Power: ${weapon.power}`;
	card.appendChild(power);

	const cost = document.createElement("p");
	cost.textContent = `Cost: ${weapon.cost}`;
	card.appendChild(cost);

	const description = document.createElement("p");
	description.textContent = `Description: ${weapon.description}`;
	card.appendChild(description);

	if (weapon.special) {
		const specialEffect = SPECIAL_EFFECTS.find(
			(effect) => effect.name === weapon.special
		);
		if (specialEffect) {
			const special = document.createElement("p");
			special.textContent = `Special Effect: ${specialEffect.description}`;
			card.appendChild(special);
		}
	}

	const buyButton = document.createElement("button");
	buyButton.textContent = "Buy";
	buyButton.addEventListener("click", () => {
		console.log(weapon);
		if (playerStats.gold < weapon.cost) {
			alert("You do not have enough gold to buy this weapon.");
			return;
		}
		playerStats.gold -= weapon.cost;
		goldText.innerText = playerStats.gold;
		playerStats.inventory.push(weapon?.name);
		console.log(playerStats.inventory);
		text.innerText += ` You now have a ${weapon?.name}. In your inventory you have: ${playerStats.inventory}`;
		currentWeaponText.innerText = weapon?.name;
		weaponDamageText.innerText = weapon?.power;
		playerStats.currentWeapon = weapons.indexOf(weapon);

		goTown();
		alert(`You bought ${weapon?.name}!`);
	});
	card.appendChild(buyButton);

	return card;
}

function createPotionCard(potion) {
	const card = document.createElement("div");
	card.classList.add("storeItemCard");
	card.style.backgroundColor = "red";

	const title = document.createElement("h3");
	title.textContent = potion.name;
	card.appendChild(title);

	const cost = document.createElement("p");
	cost.textContent = `Cost: ${potion.cost}`;
	card.appendChild(cost);

	const description = document.createElement("p");
	description.textContent = `Description: ${potion.description}`;
	card.appendChild(description);

	const buyButton = document.createElement("button");
	buyButton.textContent = "Buy";
	buyButton.addEventListener("click", () => {
		console.log(potion);
		if (playerStats.gold < potion.cost) {
			alert("You do not have enough gold to buy this potion.");
			return;
		}
		playerStats.gold -= potion.cost;
		goldText.innerText = playerStats.gold;
		playerStats.health += potion.heal;
		healthText.innerText = playerStats.health;
		alert(`You bought ${potion?.name}!`);
		goTown();
	});
	card.appendChild(buyButton);

	return card;
}

function displayWeapons() {
	const weaponStore = document.getElementById("store");

	// Hide already bought weapons
	const boughtWeapons = playerStats.inventory.map((weaponName) => {
		return weapons.find((weapon) => weapon.name === weaponName);
	});

	// Display only unbought weapons
	const unboughtWeapons = weapons.filter((weapon) => {
		return !boughtWeapons.includes(weapon);
	});

	unboughtWeapons.forEach((weapon) => {
		const card = createWeaponCard(weapon);
		weaponStore.appendChild(card);
	});
}

function displayPotions() {
	const potionStore = document.getElementById("store");

	comsumables.forEach((potion) => {
		const card = createPotionCard(potion);
		potionStore.appendChild(card);
	});
}

function toggleBestiary() {
	displayBestiary();
	const bestiary = document.getElementById("bestiary");
	if (bestiary.style.display === "none") {
		bestiary.style.display = "block";
	} else {
		bestiary.style.display = "none";
	}
}

function displayBestiary() {
	const bestiary = document.getElementById("bestiary");

	monsters.forEach((monster) => {
		const card = document.createElement("div");
		card.classList.add("bestiaryCard");

		const title = document.createElement("h3");
		title.textContent = monster.name;
		card.appendChild(title);

		const level = document.createElement("p");
		level.textContent = `Level: ${monster.level}`;
		card.appendChild(level);

		const description = document.createElement("p");
		description.textContent = `Description: ${monster.description}`;
		card.appendChild(description);

		bestiary.appendChild(card);
	});
}

function goTown() {
	if (store.style.display === "flex") {
		store.style.display = "none";
	}
	update(locations[0]);
}

function goStore() {
	update(locations[1]);
	store.style.display = "flex";
	displayPotions();
	displayWeapons();
}

function goCave() {
	pickMonsters();
	locations[2]["button text"][0] = `Fight ${firstMonsterText}`;
	locations[2]["button text"][1] = `Fight ${secondMonsterText}`;
	locations[2]["button functions"][0] = () => fightMonster(firstMonster);
	locations[2]["button functions"][1] = () => fightMonster(secondMonster);
	update(locations[2]);
	text.innerText = `You enter the cave. You see a ${firstMonsterText} and a ${secondMonsterText}.`;
}

function fightDragon() {
	if (playerStats.level < 25) {
		text.innerText = "You are not strong enough to fight the Ancient Dragon.";
		return;
	}
	playerStats.fighting = monsters.length - 1;
	goFight();
}

function fightMonster(monster) {
	update(locations[3]);
	monsterStats.style.display = "block";
	playerStats.fighting = monsters.indexOf(monster);
	playerStats.monsterHealth = monster.health;
	monsterName.innerText = monster.name;
	monsterHealthText.innerText = playerStats.monsterHealth;
	text.innerText =
		"You are fighting a " + monster.name + ". " + monster.description;
	console.log(monster);
}

function attack() {
	const weaponPower = weapons[playerStats.currentWeapon].power;
	const randomXp = Math.floor(Math.random() * playerStats.level) + 2;

	let damageDealt =
		playerSpecialHit(weaponPower, weapons[playerStats.currentWeapon].special) +
		randomXp;

	console.log("You did", damageDealt, "damage.");

	text.innerText = "The " + monsters[playerStats.fighting].name + " attacks.";
	playerStats.health -= getMonsterAttackValue(
		monsters[playerStats.fighting].level
	);

	if (isMonsterHit()) {
		text.innerText +=
			" You attack it with your " +
			weapons[playerStats.currentWeapon].name +
			"." +
			" You deal " +
			damageDealt +
			" damage.";
		playerStats.monsterHealth -= damageDealt;
	} else {
		text.innerText += " You miss.";
	}
	healthText.innerText = playerStats.health;
	monsterHealthText.innerText = playerStats.monsterHealth;
	if (playerStats.health <= 0) {
		lose();
	} else if (playerStats.monsterHealth <= 0) {
		playerStats.fighting === monsters.length - 1 ? winGame() : defeatMonster();
	}
	if (Math.random() <= 0.1 && playerStats.inventory.length !== 1) {
		text.innerText += " Your " + playerStats.inventory.pop() + " breaks.";
		playerStats.currentWeapon--;
	}
}

function playerSpecialHit(weaponPower, special) {
	const activateChance = 0.1;
	let newWeaponPower;

	if (special === null) return weaponPower;

	if (activateChance >= Math.random()) {
		if (special === "Double Shot") {
			newWeaponPower = weaponPower * 2;
			alert(" Double shot!");
		}
		if (special === "Piercing Shot") {
			newWeaponPower = weaponPower * 1.5;
			alert(" Piercing shot!");
		}
		if (special === "Critical") {
			newWeaponPower = weaponPower * 3;
			alert(" Critical hit!");
		}

		weaponPower = newWeaponPower;
	}

	return weaponPower;
}

function getMonsterAttackValue(level) {
	const hit =
		level * Math.floor(Math.random() * (2.5 - 1 + 1) + 1) -
		Math.floor(Math.random() * playerStats.xp);
	return hit > 0 ? hit : 0;
}

function isMonsterHit() {
	return Math.random() > 0.2 || playerStats.health < 20;
}

function dodge() {
	text.innerText =
		"You dodge the attack from the " + monsters[playerStats.fighting].name;
}

function earnXp() {
	const baseXpGained = Math.floor(
		monsters[playerStats.fighting].level * Math.random() * 10
	);
	console.log("baseXpGained", baseXpGained);
	const xpGained = baseXpGained * playerStats.xpMultiplier;
	console.log("xpGained", xpGained);

	playerStats.xp += xpGained;
	xpText.innerText = playerStats.xp;

	if (playerStats.xp >= playerStats.xpToNextLevel) {
		levelUp();
		alert("You leveled up!");
	}
}

function levelUp() {
	playerStats.level++;
	playerStats.xpMultiplier += 0.1;
	playerStats.xpToNextLevel += Math.floor(playerStats.xpToNextLevel * 3.4);
	requiredXpLevelUpText.innerText = playerStats.xpToNextLevel;

	levelText.innerText = playerStats.level;
	xpText.innerText = playerStats.xp;
}

function defeatMonster() {
	playerStats.gold +=
		Math.floor(monsters[playerStats.fighting].level * Math.random() * 8) + 1;
	goldText.innerText = playerStats.gold;
	xpText.innerText = playerStats.xp;
	earnXp();
	update(locations[4]);
	console.log("xp", playerStats.xp);
}

function lose() {
	update(locations[5]);
}

function winGame() {
	update(locations[6]);
}

function restart() {
	playerStats.level = 1;
	playerStats.xpMultiplier = 1;
	playerStats.xpToNextLevel = 20;
	playerStats.xp = 0;
	playerStats.health = 100;
	playerStats.gold = 10;
	playerStats.currentWeapon = 0;
	playerStats.inventory = ["stick"];
	goldText.innerText = playerStats.gold;
	healthText.innerText = playerStats.health;
	xpText.innerText = playerStats.xp;
	levelText.innerText = playerStats.level;
	goTown();
}
