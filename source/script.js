var oldTime;
var numberOfClicks;
var money;
var notoriety;
var minionType;
var buildingType;
var activityType;
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
	activityType = {};
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

	addActivityType("Smuggling", 10000, 0.2, 0.1);
	addActivityType("Kidnapping", 20000, 0.2, 0.1);
	addActivityType("Sabotage", 30000, 0.2, 0.2);
	for(var type in activityType)
		createButton("activity", type, addActivity);

	addContinent("Europe", 1000000, true);
	addContinent("Asia", 1000000, false);
	addContinent("North America", 1000000, false);
	addContinent("South America", 1000000, false);
	addContinent("Afrika", 1000000, false);
	addContinent("Oceania", 1000000, false);
	for(var cont in continents)
		createButton("expand", cont, null);

	document.getElementById("click").onclick = click;
	document.getElementById("click").className = "button";

	footerText();
	updateValues();
	updateRecruitButtons();
	updateConstructButtons();
	updateActivityButtons();
	updateContinentButtons();
	main();
}

function main()
{
	var newTime = new Date();
	var dt = (newTime.getTime() - oldTime.getTime()) * 0.001;
	var time = newTime.getHours() + ":" + newTime.getMinutes() + ":" + newTime.getSeconds();
	document.getElementById("time").innerHTML = time;

	update(minionType, dt);
	update(buildingType, dt);
	update(activityType, dt);
	updateValues();

	updateRecruitButtons();
	updateConstructButtons();
	updateActivityButtons();
	updateContinentButtons();

	oldTime = newTime;
	var t = setTimeout(main, 100);
}

function update(array, dt)
{
	for(var type in array)
	{
		var change = array[type].count * array[type].incomePerSecond * dt;
		notoriety += change;
		money += change;
	}
}

function createButton(boxID, type, callbackFunc)
{
	var button = document.createElement("button");
	button.id = type;
	button.className = "button";
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

// will be used to increase income for a specific type of minion later, instead of working like minions
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

// Will be used to increase total income per second later, instead of working like minions
function addActivityType(name, cost, icr, incomePerSecond)
{
	activityType[name] = {
		name: name,
		cost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomePerSecond: incomePerSecond,
		count: 0
	}
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
	updateButtons(minionType);
}

function updateConstructButtons()
{
	updateButtons(buildingType);
}

function updateActivityButtons()
{
	updateButtons(activityType);
}

function updateContinentButtons()
{
	for(var cont in continents)
	{
		document.getElementById(cont).innerHTML = cont;
	}
}

function updateButtons(array)
{
	for(var type in array)
	{
		document.getElementById(type).innerHTML = type +
			"<br>-" + numberWithCommas(array[type].currentCost) +
			"$<br>+" + array[type].incomePerSecond +
			"$/s<br># " + array[type].count;

		var className = "button";
		if(money < array[type].currentCost)
			className += " buttonDeactivated";
		document.getElementById(type).className = className;
	}
}

function click()
{
	++money;
	++notoriety;
	++numberOfClicks;
	updateValues();
	return false;
}

function addMinion(type)
{
	addInstance(minionType, updateRecruitButtons, type);
}

function addBuilding(type)
{
	addInstance(buildingType, updateConstructButtons, type);
}

function addActivity(type)
{
	addInstance(activityType, updateActivityButtons, type);
}

function addInstance(array, callbackFunc, type)
{
	var obj = array[type];
	if(money < obj.currentCost) return false;
	money -= obj.currentCost;
	++obj.count;
	obj.currentCost += Math.floor(obj.currentCost * obj.increaseCostRate);
	updateValues();
	callbackFunc();
	return false;
}

function footerText()
{
	document.getElementById("footer").innerHTML = "&copy; " + new Date().getFullYear() + ", Linus Fredriksson";
}

function numberWithCommas(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
