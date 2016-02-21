var oldTime;
var numberOfClicks;
var money;
var notoriety;
var minionType;
var buildingType;
var continents;

function initiate()
{
	oldTime = new Date();
	numberOfClicks = 0;
	money = 0;
	notoriety = 0;
	minions = 0;
	minionType = {};
	buildingType = {};
	continents = {}

	addMinionType("Minion", 10, 0.2, 0.1);
	addMinionType("Soldier", 100, 0.1, 1);
	addMinionType("Spy", 1000, 0.1, 2);
	addMinionType("Diplomat", 2000, 0.1, 3);

	for(var type in minionType)
		createRecruitButton(type);

	addBuildingType("Helipad", 10000, 3);
	addBuildingType("Hangar", 20000, 4);
	addBuildingType("Laboratory", 30000, 5);
	addBuildingType("Armory", 40000, 7);
	addBuildingType("Rocket Silo", 100000, 9);
	addBuildingType("Death Lazer", 1000000, 20);

	for(var type in buildingType)
		createBuildingButton(type);

	addContinent("Europe", 1000000, true);
	addContinent("Asia", 1000000, false);
	addContinent("North America", 1000000, false);
	addContinent("South America", 1000000, false);
	addContinent("Afrika", 1000000, false);
	addContinent("Oceania", 1000000, false);

	for(var cont in continents)
		createContinentButton(cont);

	document.getElementById("click").onclick = click;

	footerText();
	updateValues();
	updateRecruitButtons();
	updateConstructButtons();
	updateContinentButtons();
	main();
}

function createRecruitButton(type)
{
	var button = document.createElement("button");
	button.id = type;
	button.addEventListener("click", function(){addMinion(type); return false;});
	document.getElementById("recruit").appendChild(button);
}

function createBuildingButton(type)
{
	var button = document.createElement("button");
	button.id = type;
	button.addEventListener("click", function(){addBuilding(type); return false;});
	document.getElementById("construct").appendChild(button);
}

function createContinentButton(type)
{
	var button = document.createElement("button");
	button.id = type;
	/*button.addEventListener("click", function(){; return false;});*/
	document.getElementById("expand").appendChild(button);
}

/* USE THIS INSTEAD OF OTHER CREATE BUTTONS LATER */
function createButton(boxID, type)
{
	var button = document.createElement("button");
	button.id = type;
	/*button.addEventListener("click", function(){; return false;});*/
	document.getElementById(bodID).appendChild(button);
}

function addMinionType(name, cost, icr, incomePerSecond)
{
	minionType[name] = {
		name: name,
		cost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomePerSecond: incomePerSecond,
		count: 0
	};
}

function addBuildingType(name, cost, incomePerSecond)
{
	buildingType[name] = {
		name: name,
		cost: cost,
		incomePerSecond: incomePerSecond,
		increaseType: "", /* used to increase the income of a type of minion */
		increaseRate: 0, /* how much minion type is increased */
		count: 0
	};
}

function addContinent(name, cost, presence)
{
	continents[name] = {
		name: name,
		cost: cost,
		presence: presence
	};
}

function updateValues()
{
	document.getElementById("clicks").innerHTML = numberWithCommas(numberOfClicks);
	document.getElementById("money").innerHTML = numberWithCommas(money.toFixed(3));
	document.getElementById("notoriety").innerHTML = numberWithCommas(notoriety.toFixed(3));
}

function updateRecruitButtons()
{
	for(var type in minionType)
	{
		document.getElementById(type).innerHTML = type +
			"<br>-" + numberWithCommas(minionType[type].currentCost) +
			"$<br>+" + minionType[type].incomePerSecond +
			"$/s<br># " + minionType[type].count;
	}
}

function updateConstructButtons()
{
	for(var type in buildingType)
	{
		document.getElementById(type).innerHTML = type +
			"<br>-" + numberWithCommas(buildingType[type].cost) +
			"$<br>+" + buildingType[type].incomePerSecond +
			"$/s<br># " + buildingType[type].count;
	}
}

function updateContinentButtons()
{
	for(var cont in continents)
	{
		document.getElementById(cont).innerHTML = cont;
	}
}

function main()
{
	var newTime = new Date();
	var dt = (newTime.getTime() - oldTime.getTime()) * 0.001;
	var time = newTime.getHours() + ":" + newTime.getMinutes() + ":" + newTime.getSeconds();
	document.getElementById("time").innerHTML = time;

	for(var type in minionType)
	{
		var add = minionType[type].count * minionType[type].incomePerSecond * dt;
		money += add;
		notoriety += add;
	}

	updateValues();

	oldTime = newTime;
	var t = setTimeout(main, 100);
}

function footerText()
{
	document.getElementById("footer").innerHTML = "&copy; " + new Date().getFullYear() + ", Linus Fredriksson";
}

function click()
{
	++money;
	++numberOfClicks;
	++notoriety;
	updateValues();
	return false;
}

function addMinion(type)
{
	var obj = minionType[type];
	if (money < obj.currentCost) return false;
	money -= obj.currentCost;
	++obj.count;
	obj.currentCost += Math.floor(obj.currentCost * obj.increaseCostRate);
	updateValues();
	updateRecruitButtons();
	return false;
}

function addBuilding(type)
{
	if (money < buildingType[type].cost) return false;
	++buildingType[type].count;
	money -= buildingType[type].cost;
	updateValues();
	updateConstructButtons();
	return false;
}

function numberWithCommas(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
