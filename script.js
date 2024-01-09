import monsters from "./gameProperties/monsters.js";
import weapons from "./gameProperties/weapons.js";
import comsumables from "./gameProperties/comsumables.js";

let xp = 0;
let xpMultiplier = 1;
let level = 1;
let xpToNextLevel = 20;
let health = 100;
let gold = 10;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stick"];

let firstMonster;
let secondMonster;
let firstMonsterText;
let secondMonsterText;

function pickMonsters() {
	const filteredMonsters = monsters.filter((m) => {
		return m.level >= level - 6 && m.level <= level + 6;
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
		"button functions": [goTown, goTown, easterEgg],
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
	{
		name: "easter egg",
		"button text": ["2", "8", "Go to town square?"],
		"button functions": [pickTwo, pickEight, goTown],
		text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
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
		if (gold < weapon.cost) {
			alert("You do not have enough gold to buy this weapon.");
			return;
		}
		gold -= weapon.cost;
		goldText.innerText = gold;
		inventory.push(weapon?.name);
		console.log(inventory);
		text.innerText += ` You now have a ${weapon?.name}. In your inventory you have: ${inventory}`;
		currentWeaponText.innerText = weapon?.name;
		weaponDamageText.innerText = weapon?.power;
		currentWeapon = weapons.indexOf(weapon);

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
		if (gold < potion.cost) {
			alert("You do not have enough gold to buy this potion.");
			return;
		}
		gold -= potion.cost;
		goldText.innerText = gold;
		health += potion.heal;
		healthText.innerText = health;
		alert(`You bought ${potion?.name}!`);
		goTown();
	});
	card.appendChild(buyButton);

	return card;
}

function displayWeapons() {
	const weaponStore = document.getElementById("store");

	// Hide already bought weapons
	const boughtWeapons = inventory.map((weaponName) => {
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
	if (level < 25) {
		text.innerText = "You are not strong enough to fight the Ancient Dragon.";
		return;
	}
	fighting = monsters.length - 1;
	goFight();
}

function fightMonster(monster) {
	update(locations[3]);
	monsterStats.style.display = "block";
	fighting = monsters.indexOf(monster);
	monsterHealth = monster.health;
	monsterName.innerText = monster.name;
	monsterHealthText.innerText = monsterHealth;
	text.innerText =
		"You are fighting a " + monster.name + ". " + monster.description;
	console.log(monster);
}

function attack() {
	const weaponPower = weapons[currentWeapon].power;
	const randomXp = Math.floor(Math.random() * level) + 2;

	let damageDealt =
		playerSpecialHit(weaponPower, weapons[currentWeapon].special) + randomXp;

	console.log("You did", damageDealt, "damage.");

	text.innerText = "The " + monsters[fighting].name + " attacks.";
	health -= getMonsterAttackValue(monsters[fighting].level);

	if (isMonsterHit()) {
		text.innerText +=
			" You attack it with your " +
			weapons[currentWeapon].name +
			"." +
			" You deal " +
			damageDealt +
			" damage.";
		monsterHealth -= damageDealt;
	} else {
		text.innerText += " You miss.";
	}
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;
	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		fighting === monsters[monsters.length - 1] ? winGame() : defeatMonster();
	}
	if (Math.random() <= 0.1 && inventory.length !== 1) {
		text.innerText += " Your " + inventory.pop() + " breaks.";
		currentWeapon--;
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
		Math.floor(Math.random() * xp);
	return hit > 0 ? hit : 0;
}

function isMonsterHit() {
	return Math.random() > 0.2 || health < 20;
}

function dodge() {
	text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function earnXp() {
	const baseXpGained = Math.floor(
		monsters[fighting].level * Math.random() * 10
	);
	console.log("baseXpGained", baseXpGained);
	const xpGained = baseXpGained * xpMultiplier;
	console.log("xpGained", xpGained);

	xp += xpGained;
	xpText.innerText = xp;

	if (xp >= xpToNextLevel) {
		levelUp();
		alert("You leveled up!");
	}
}

function levelUp() {
	level++;
	xpMultiplier += 0.1;
	xpToNextLevel += Math.floor(xpToNextLevel * 3.4);
	requiredXpLevelUpText.innerText = xpToNextLevel;

	levelText.innerText = level;
	xpText.innerText = xp;
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * Math.random() * 8) + 1;
	goldText.innerText = gold;
	xpText.innerText = xp;
	earnXp();
	update(locations[4]);
	console.log("xp", xp);
}

function lose() {
	update(locations[5]);
}

function winGame() {
	update(locations[6]);
}

function restart() {
	level = 1;
	xpMultiplier = 1;
	xpToNextLevel = 20;
	xp = 0;
	health = 100;
	gold = 10;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	levelText.innerText = level;
	goTown();
}

function easterEgg() {
	update(locations[7]);
}

function pickTwo() {
	pick(2);
}

function pickEight() {
	pick(8);
}

function pick(guess) {
	let numbers = [];
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11));
	}
	text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
	for (let i = 0; i < 10; i++) {
		text.innerText += numbers[i] + "\n";
	}
	if (numbers.indexOf(guess) !== -1) {
		text.innerText += "Right! You win 20 gold!";
		gold += 20;
		goldText.innerText = gold;
	} else {
		text.innerText += "Wrong! You lose 10 health!";
		health -= 10;
		healthText.innerText = health;
		if (health <= 0) {
			lose();
		}
	}
}
