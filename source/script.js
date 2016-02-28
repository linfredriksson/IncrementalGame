var startTime;
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
	startTime = new Date();
	oldTime = new Date();
	numberOfClicks = 0;
	money = 0;
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
	addMinionType("Mercenary", 3000, 0.2, 4);
	addMinionType("Saboteurs", 4000, 0.2, 5);
	addMinionType("Technician", 6000, 0.2, 7);
	addMinionType("Physisist", 8000, 0.2, 9);
	createButtons("recruit", minionType, addMinion, 3);

	addBuildingType("Training Facility", 10000, 0.2, 0, 1);
	addBuildingType("Bomb Factory", 20000, 0.2, 1, 1);
	addBuildingType("Satelite", 30000, 0.2, 2, 1);
	addBuildingType("Helipad", 40000, 0.2, 3, 1);
	addBuildingType("Armory", 40000, 0.2, 4, 1);
	addBuildingType("Rocket Silo", 100000, 0.2, 5, 1);
	addBuildingType("Laboratory", 300000, 0.2, 6, 1);
	addBuildingType("Death Lazer", 1000000, 0.2, 7, 1);
	createButtons("construct", buildingType, addBuilding, 4);

	addActivityType("Smuggling", 10000, 0.2, 0.1);
	addActivityType("Kidnapping", 20000, 0.2, 0.1);
	addActivityType("Sabotage", 30000, 0.2, 0.1);
	addActivityType("Counterfeiting", 40000, 0.2, 0.1);
	createButtons("activity", activityType, addActivity, 3);

	addContinentType("Europe", 1000000000, 2, true);
	addContinentType("Asia", 1000000000, 2, false);
	addContinentType("North America", 1000000000, 2, false);
	addContinentType("South America", 1000000000, 2, false);
	addContinentType("Afrika", 1000000000, 2, false);
	addContinentType("Oceania", 1000000000, 2, false);
	createButtons("expand", continents, addContinent, 0);

	document.getElementById("click").onclick = click;

	footerText();
	main();
}

function main()
{
	var newTime = new Date();
	var dt = (newTime.getTime() - oldTime.getTime()) * 0.001;
	var sec_num = (newTime.getTime() - startTime.getTime()) * 0.001;
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
	document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds;

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
	var numberOfDecimals = 0;
	document.getElementById("clicks").innerHTML = numberWithCommas(numberOfClicks);
	document.getElementById("money").innerHTML = numberWithCommas(money.toFixed(numberOfDecimals));
	document.getElementById("notoriety").innerHTML = numberWithCommas(notoriety.toFixed(numberOfDecimals));
	var income = 0;
	for(i = 0; i < availableMinionTypes; ++i)
		income += minionType[i].incomePerSecond * minionType[i].incomeModifier * minionType[i].count;
	income = income * incomeModifier;
	document.getElementById("income").innerHTML = numberWithCommas(income.toFixed(numberOfDecimals));
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

function addContinentType(name, cost, incomeModifier, presence)
{
	continents.push({
		name: name,
		cost: cost,
		incomeModifier: incomeModifier,
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
	{
		var element = document.getElementById("expand" + i);
		var obj = continents[i];
		if(obj.presence == true)
		{
			element.className = "button buttonPresence";
			element.innerHTML = obj.name + "<br><br><br>";
		}
		else
		{
			var className = "button";
			if(money < obj.cost)
				className += " buttonDeactivated";
			element.className = className;
			element.innerHTML = obj.name +
				"<br>-" + numberWithCommas(obj.cost) +
				"<br>+" + obj.incomeModifier * 100 + "%";
		}
	}
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

function addContinent(arrayID)
{
	var obj = continents[arrayID];
	if(obj.presence == true || money < obj.cost)
		return false;
	money -= obj.cost;
	obj.presence = true;
	incomeModifier += obj.incomeModifier;
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
