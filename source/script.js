var oldTime;
var numberOfClicks;
var money;
var incomeModifier;
var notoriety;
var minionType;
var buildingType;
var activityType;
var continents;

function initiate()
{
	oldTime = new Date();
	numberOfClicks = 0;
	money = 100000000;
	incomeModifier = 1;
	notoriety = 0;
	minions = 0;
	minionType = [];
	availableMinionTypes = 1;
	buildingType = [];
	availableBuildingTypes = 1;
	activityType = [];
	availableActivityTypes = 1;
	continents = [];

	addMinionType("Minion", 10, 0.2, 0.1);
	addMinionType("Soldier", 100, 0.2, 1);
	addMinionType("Spy", 1000, 0.2, 2);
	addMinionType("Diplomat", 2000, 0.2, 3);
	createButtons("recruit", minionType, addMinion, 3);

	addBuildingType("Helipad", 10000, 0.2, 0, 1);
	addBuildingType("Hangar", 20000, 0.2, 0, 1);
	addBuildingType("Laboratory", 30000, 0.2, 1, 1);
	addBuildingType("Armory", 40000, 0.2, 1, 1);
	addBuildingType("Rocket Silo", 100000, 0.2, 0, 1);
	addBuildingType("Death Lazer", 1000000, 0.2, 0, 1);
	createButtons("construct", buildingType, addBuilding, 4);

	addActivityType("Smuggling", 10000, 0.2, 0.1);
	addActivityType("Kidnapping", 20000, 0.2, 0.1);
	addActivityType("Sabotage", 30000, 0.2, 0.1);
	createButtons("activity", activityType, addActivity, 3);

	addContinent("Europe", 1000000, true);
	addContinent("Asia", 1000000, false);
	addContinent("North America", 1000000, false);
	addContinent("South America", 1000000, false);
	addContinent("Afrika", 1000000, false);
	addContinent("Oceania", 1000000, false);
	createButtons("expand", continents, null, 0);

	document.getElementById("click").onclick = click;
	document.getElementById("click").className = "button";

	footerText();
	main();
}

function main()
{
	var newTime = new Date();
	var dt = (newTime.getTime() - oldTime.getTime()) * 0.001;
	var time = newTime.getHours() + ":" + newTime.getMinutes() + ":" + newTime.getSeconds();
	document.getElementById("time").innerHTML = time;

	update(dt);
	updateValues();
	updateRecruitButtons();
	updateConstructButtons();
	updateActivityButtons();
	updateContinentButtons();

	oldTime = newTime;
	var t = setTimeout(main, 100);
}

function updateValues()
{
	document.getElementById("clicks").innerHTML = numberWithCommas(numberOfClicks);
	document.getElementById("money").innerHTML = numberWithCommas(money.toFixed(3));
	document.getElementById("notoriety").innerHTML = numberWithCommas(notoriety.toFixed(3));
	var income = 0;
	for(i = 0; i < availableMinionTypes; ++i)
		income += minionType[i].incomePerSecond * minionType[i].incomeModifier * minionType[i].count;
	document.getElementById("income").innerHTML = numberWithCommas(income.toFixed(3));
}

function update(dt)
{
	for(i = 0; i < minionType.length; ++i)
	{
		var change = minionType[i].count * minionType[i].incomePerSecond * minionType[i].incomeModifier * incomeModifier * dt;
		notoriety += change;
		money += change;
	}
}

function createButtons(boxID, array, callbackFunc, emptyLines)
{
	for(i = 0; i < array.length; ++i)
		createButton(boxID, i, array, callbackFunc, emptyLines);
}

function createButton(boxID, arrayID, array, callbackFunc, numberOfEmptyLines)
{
	var button = document.createElement("button");
	button.id = boxID + arrayID;
	button.className = "button buttonNotAvailable";
	button.innerHTML = "Locked<br>";
	for(var i = 0; i < numberOfEmptyLines; ++i)
		button.innerHTML += "<br>";
	if(callbackFunc !== null)
		button.addEventListener("click", function(){callbackFunc(arrayID); return false;});
	document.getElementById(boxID).appendChild(button);
}

function addMinionType(name, cost, icr, incomePerSecond)
{
	minionType.push({
		name: name,
		initialCost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomePerSecond: incomePerSecond,
		incomeModifier: 1.0,
		count: 0
	});
}

function addBuildingType(name, cost, icr, increaseType, incomeModifier)
{
	buildingType.push({
		name: name,
		initialCost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		increaseType: increaseType, /* used to increase the income of a type of minion */
		increaseModifier: incomeModifier, /* how much minion type is increased */
		count: 0
	});
}

function addActivityType(name, cost, icr, incomeModifier)
{
	activityType.push({
		name: name,
		initialCost: cost,
		currentCost: cost,
		increaseCostRate: icr,
		incomeModifier: incomeModifier,
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

function updateRecruitButtons()
{
	for(i = 0; i < availableMinionTypes; ++i)
		updateMinionButton("recruit", minionType, i);
	if(availableMinionTypes < minionType.length && minionType[availableMinionTypes - 1].count > 0)
		++availableMinionTypes;
}

function updateConstructButtons()
{
	for(i = 0; i < availableBuildingTypes; ++i)
		updateConstructButton("construct", buildingType, i);
	if(availableBuildingTypes < buildingType.length && buildingType[availableBuildingTypes - 1].count > 0)
		++availableBuildingTypes;
}

function updateActivityButtons()
{
	for(i = 0; i < availableActivityTypes; ++i)
		updateActivityButton("activity", activityType, i);
	if(availableActivityTypes < activityType.length && activityType[availableActivityTypes - 1].count > 0)
		++availableActivityTypes;
}

function updateContinentButtons()
{
	for(i = 0; i < continents.length; ++i)
		document.getElementById("expand" + i).innerHTML = continents[i].name;
}

function updateConstructButton(boxID, array, arrayID)
{
	var obj = array[i];
	var className = "button";
	if(money < obj.currentCost)
		className += " buttonDeactivated";
	document.getElementById(boxID + i).className = className;
	document.getElementById(boxID + i).innerHTML = obj.name +
		"<br>-" + numberWithCommas(obj.currentCost) +
		"<br>" + minionType[obj.increaseType].name +
		"<br>+" + obj.increaseModifier * 100 + "%" +
		"<br># " + obj.count;
}

function updateMinionButton(boxID, array, arrayID)
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

function updateActivityButton(boxID, array, arrayID)
{
	var obj = array[i];
	var className = "button";
	if(money < obj.currentCost)
		className += " buttonDeactivated";
	document.getElementById(boxID + i).className = className;
	document.getElementById(boxID + i).innerHTML = obj.name +
		"<br>-" + numberWithCommas(obj.currentCost) +
		"<br>+" + obj.incomeModifier * 100 + "%" +
		"<br># " + obj.count;
}

function addMinion(arrayID)
{
	addInstance(arrayID, availableMinionTypes, minionType);
	return false;
}

function addBuilding(arrayID)
{
	if(!addInstance(arrayID, availableBuildingTypes, buildingType))
		return false;
	minionType[buildingType[arrayID].increaseType].incomeModifier += buildingType[arrayID].increaseModifier;
	return false;
}

function addActivity(arrayID)
{
	if(!addInstance(arrayID, availableActivityTypes, activityType))
		return false;
	incomeModifier += activityType[arrayID].incomeModifier;
}

function addInstance(arrayID, totalAvaliable, array)
{
	var obj = array[arrayID];
	if(arrayID >= totalAvaliable || money < obj.currentCost)
		return false;
	money -= obj.currentCost;
	++obj.count;
	obj.currentCost += Math.floor(obj.currentCost * obj.increaseCostRate);
	return true;
}

function click()
{
	money += incomeModifier;
	++notoriety;
	++numberOfClicks;
	updateValues();
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
