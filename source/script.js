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
	money = 100000;
	notoriety = 0;
	minions = 0;
	minionType = {};
	buildingType = {};
	continents = {}

	addMinionType("Minion", 10, 0.2, 0.1);
	addMinionType("Soldier", 100, 0.2, 1);
	addMinionType("Spy", 1000, 0.2, 2);
	addMinionType("Diplomat", 2000, 0.2, 3);

	for(var type in minionType)
		createButton("recruit", type, addMinion);

	addBuildingType("Helipad", 10000, 0.2, 3);
	addBuildingType("Hangar", 20000, 0.2, 4);
	addBuildingType("Laboratory", 30000, 0.2, 5);
	addBuildingType("Armory", 40000, 0.2, 7);
	addBuildingType("Rocket Silo", 100000, 0.2, 9);
	addBuildingType("Death Lazer", 1000000, 0.2, 20);

	for(var type in buildingType)
		createButton("construct", type, addBuilding);

	addContinent("Europe", 1000000, true);
	addContinent("Asia", 1000000, false);
	addContinent("North America", 1000000, false);
	addContinent("South America", 1000000, false);
	addContinent("Afrika", 1000000, false);
	addContinent("Oceania", 1000000, false);

	for(var cont in continents)
		createButton("expand", cont, null);
	/*createContinentButton(cont);*/

	document.getElementById("click").onclick = click;

	footerText();
	updateValues();
	updateRecruitButtons();
	updateConstructButtons();
	updateContinentButtons();
	main();
}

function createButton(boxID, type, callbackFunc)
{
	var button = document.createElement("button");
	button.id = type;
	if(callbackFunc !== null)
		button.addEventListener("click", function(){callbackFunc(type); return false;});
	document.getElementById(boxID).appendChild(button);
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

function addBuildingType(name, cost, icr, incomePerSecond)
{
	buildingType[name] = {
		name: name,
		cost: cost,
		currentCost: cost,
		increaseCostRate: icr,
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
			"<br>-" + numberWithCommas(buildingType[type].currentCost) +
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
		var change = minionType[type].count * minionType[type].incomePerSecond * dt;
		money += change;
		notoriety += change;
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
	var obj = buildingType[type];
	if (money < obj.cost) return false;
	money -= obj.currentCost;
	++obj.count;
	obj.currentCost += Math.floor(obj.currentCost * obj.increaseCostRate);
	updateValues();
	updateConstructButtons();
	return false;
}

function numberWithCommas(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
