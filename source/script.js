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
	money = 1000000;
	notoriety = 0;
	minions = 0;
	minionType = [];
	buildingType = [];
	activityType = [];
	continents = [];

	addMinionType("Minion", 10, 0.2, 0.1);
	addMinionType("Soldier", 100, 0.2, 1);
	addMinionType("Spy", 1000, 0.2, 2);
	addMinionType("Diplomat", 2000, 0.2, 3);
	for(i = 0; i < minionType.length; ++i)
		createButton("recruit", i, minionType, addMinion);

	addBuildingType("Helipad", 10000, 0.2, 3);
	addBuildingType("Hangar", 20000, 0.2, 4);
	addBuildingType("Laboratory", 30000, 0.2, 5);
	addBuildingType("Armory", 40000, 0.2, 7);
	addBuildingType("Rocket Silo", 100000, 0.2, 9);
	addBuildingType("Death Lazer", 1000000, 0.2, 20);
	for(i = 0; i < buildingType.length; ++i)
		createButton("construct", i, buildingType, addBuilding);

	addActivityType("Smuggling", 10000, 0.2, 0.1);
	addActivityType("Kidnapping", 20000, 0.2, 0.1);
	addActivityType("Sabotage", 30000, 0.2, 0.2);
	for(i = 0; i < activityType.length; ++i)
		createButton("activity", i, activityType, addActivity);

	addContinent("Europe", 1000000, true);
	addContinent("Asia", 1000000, false);
	addContinent("North America", 1000000, false);
	addContinent("South America", 1000000, false);
	addContinent("Afrika", 1000000, false);
	addContinent("Oceania", 1000000, false);
	for(i = 0; i < continents.length; ++i)
		createButton("expand", i, continents, null);

	document.getElementById("click").onclick = click;
	document.getElementById("click").className = "button";

	footerText();
	/*updateValues();
	updateRecruitButtons();
	updateConstructButtons();
	updateActivityButtons();
	updateContinentButtons();*/
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
	for(i = 0; i < array.length; ++i)
	{
		var change = array[i].count * array[i].incomePerSecond * dt;
		notoriety += change;
		money += change;
	}
}

function createButton(boxID, arrayID, array, callbackFunc)
{
	var button = document.createElement("button");
	button.id = boxID + arrayID;
	button.className = "button";
	button.innerHTML = boxID + arrayID;
	if(callbackFunc !== null)
		button.addEventListener("click", function(){callbackFunc(arrayID); return false;});
	document.getElementById(boxID).appendChild(button);
}

function addMinionType(name, cost, icr, incomePerSecond)
{
	minionType.push({
		name: name,
		cost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomePerSecond: incomePerSecond,
		count: 0
	});
}

// will be used to increase income for a specific type of minion later, instead of working like minions
function addBuildingType(name, cost, icr, incomePerSecond)
{
	buildingType.push({
		name: name,
		cost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomePerSecond: incomePerSecond,
		increaseType: "", /* used to increase the income of a type of minion */
		increaseRate: 0, /* how much minion type is increased */
		count: 0
	});
}

// Will be used to increase total income per second later, instead of working like minions
function addActivityType(name, cost, icr, incomePerSecond)
{
	activityType.push({
		name: name,
		cost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomePerSecond: incomePerSecond,
		count: 0
	});
}

function addContinent(name, cost, presence)
{
	continents.push({
		name: name,
		cost: cost,
		presence: presence
	});
}

function updateValues()
{
	document.getElementById("clicks").innerHTML = numberWithCommas(numberOfClicks);
	document.getElementById("money").innerHTML = numberWithCommas(money.toFixed(3));
	document.getElementById("notoriety").innerHTML = numberWithCommas(notoriety.toFixed(3));
}

function updateRecruitButtons()
{
	for(i = 0; i < minionType.length; ++i)
		updateButton("recruit", minionType, i);
}

function updateConstructButtons()
{
	for(i = 0; i < buildingType.length; ++i)
		updateButton("construct", buildingType, i);
}

function updateActivityButtons()
{
	for(i = 0; i < activityType.length; ++i)
		updateButton("activity", activityType, i);
}

function updateContinentButtons()
{
	for(i = 0; i < continents.length; ++i)
		document.getElementById("expand" + i).innerHTML = continents[i].name;
}

function updateButton(boxID, array, arrayID)
{
	var obj = array[i];
	var className = "button";
	if(money < obj.currentCost)
		className += " buttonDeactivated";
	document.getElementById(boxID + i).className = className;
	document.getElementById(boxID + i).innerHTML = obj.name +
		"<br>-" + numberWithCommas(obj.currentCost) +
		"$<br>+" + obj.incomePerSecond +
		"$/s<br># " + obj.count;
}

function click()
{
	++money;
	++notoriety;
	++numberOfClicks;
	updateValues();
	return false;
}

function addMinion(arrayID)
{
	addInstance(minionType, updateRecruitButtons, arrayID);
}

function addBuilding(type)
{
	addInstance(buildingType, updateConstructButtons, type);
}

function addActivity(type)
{
	addInstance(activityType, updateActivityButtons, type);
}

function addInstance(array, callbackFunc, arrayID)
{
	var obj = array[arrayID];
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
