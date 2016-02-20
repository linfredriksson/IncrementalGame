var oldTime;
var numberOfClicks;
var money;
var notoriety;
var minionType;

function initiate()
{
	oldTime = new Date();
	numberOfClicks = 0;
	money = 100;
	notoriety = 0;
	minions = 0;
	minionType = {};

	addMinionType("minion", 10, 0.1);
	addMinionType("soldier", 20, 0.2);
	addMinionType("spy", 100, 1);
	addMinionType("diplomat", 1000, 3);
	addMinionType("Lorem", 100000, 0);
	addMinionType("Ipsum", 100000, 0);

	for(var type in minionType)
	{
		var div1 = document.createElement("div");
		div1.className = "minions";
		div1.innerHTML = type + ":";
		var div2 = document.createElement("div");
		div2.id = type;
		div2.innerHTML = "0";
		var div0 = document.createElement("div");
		div0.appendChild(div1);
		div0.appendChild(div2);
		document.getElementById("statistics2").appendChild(div0);
		test(type);
	}

	document.getElementById("click").onclick = click;

	updateValues();
	footerText();
	main();
}

function test(type)
{
	var button = document.createElement("button");
	/*button.appendChild(document.createTextNode(type+"<br>0"));*/
	button.innerHTML = type + "<br>0";
	button.id = type + "button";
	button.addEventListener("click", function(){addMinion(type); return false;});
	document.getElementById("recruit").appendChild(button);
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

function updateValues(dt)
{
	document.getElementById("clicks").innerHTML = numberOfClicks;
	document.getElementById("money").innerHTML = money;
	document.getElementById("notoriety").innerHTML = notoriety;
	for(var type in minionType)
	{
		document.getElementById(type).innerHTML = minionType[type].count;
		document.getElementById(type+"button").innerHTML = type + "<br>" + minionType[type].count;
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
		document.getElementById(type).innerHTML = minionType[type].count;
	}

	updateValues(dt);
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
	return false;
}
