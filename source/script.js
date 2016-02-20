var oldTime;
var numberOfClicks;
var money;
var notoriety;
var minionType;
var buildingType;
var continent;

function initiate()
{
	oldTime = new Date();
	numberOfClicks = 0;
	money = 0;
	notoriety = 0;
	minions = 0;
	minionType = {};
	buildingType = {};
	continent = {}

	addMinionType("Minion", 10, 0.1);
	addMinionType("Soldier", 20, 0.2);
	addMinionType("Spy", 100, 1);
	addMinionType("Diplomat", 1000, 3);

	for(var type in minionType)
		createRecruitButton(type);

	addBuildingType("Helipad");
	addBuildingType("Hangar");
	addBuildingType("Laboratory");
	addBuildingType("Armory");
	addBuildingType("Rocket Silo");
	addBuildingType("Death Lazer");

	for(var type in buildingType)
		createBuildingButton(type);

	addContinent("Europe", 1000000, true);
	addContinent("Asia", 1000000, false);
	addContinent("North America", 1000000, false);
	addContinent("South America", 1000000, false);
	addContinent("Afrika", 1000000, false);
	addContinent("Oceania", 1000000, false);

	for(var cont in continent)
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
	/*button.addEventListener("click", function(){; return false;});*/
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

function addMinionType(name, cost, incomePerSecond)
{
	minionType[name] = {
		name: name,
		cost: cost,
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
	continent[name] = {
		name: name,
		cost: cost,
		presence: presence
	};
}

function updateValues()
{
	document.getElementById("clicks").innerHTML = numberOfClicks;
	document.getElementById("money").innerHTML = money;
	document.getElementById("notoriety").innerHTML = notoriety;
}

function updateRecruitButtons()
{
	for(var type in minionType)
	{
		document.getElementById(type).innerHTML = type +
			"<br>-" + minionType[type].cost +
			"$<br>+" + minionType[type].incomePerSecond +
			"$/s<br># " + minionType[type].count;
	}
}

function updateConstructButtons()
{
	for(var type in buildingType)
	{
		document.getElementById(type).innerHTML = type + "<br>0";
	}
}

function updateContinentButtons()
{
	for(var cont in continent)
	{
		document.getElementById(cont).innerHTML = cont;
	}
}

function main()
{
	var newTime = new Date();
	var dt = (newTime.getTime() - oldTime.getTime()) * 0.001;
	var time = newTime.getHours() + ":" + newTime.getMinutes() + ":" + newTime.getSeconds();
	document.getElementById("txt").innerHTML = time;
	document.getElementById("dt").innerHTML = dt;

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
	if (money < minionType[type].cost) return false;
	++minionType[type].count;
	money = money - minionType[type].cost;
	updateValues();
	updateRecruitButtons();
	return false;
}
