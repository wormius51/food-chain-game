const chainsContainer = document.getElementById('chains');
const chatContent = document.getElementById('chatContent');

var cellWidth = 128;
var cellHeight = 128;
var verticalPadding = 5;
var horizontalPadding = 5;

var columnHeights = [];
var selectedprey = null;
var speciesElements = [];

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var foodChians = JSON.parse(this.response);
        for (let i = 0; i < foodChians.length; i++) {
            for (let j = 0; j < foodChians[i].length; j++) {
                drawSpecies(foodChians[i][j], i, j);
            }
        }
    }
};
xhttp.open("GET", "/getFoodChains", true);
xhttp.send();


var socket = io();

socket.on('species-added', (data) => {
    drawSpecies(data, data.column, data.row);
});

socket.on('species-removed', (data) => {
    undrawSpecies(data);
});

socket.on('species-updated', (data) => {
    updateSpecies(data); 
});

socket.on('bad-request', (data) => {
    badRequest(data);
});

socket.on('comment-added', (data) => {
    addComment(data);
});

socket.on('masses-updated', (data) => {
    GenerateGraph([{"name":"Apples","color":"#FF0000","number":Math.floor(data[0])},
    {"name":"Jellow","color":"#00FF00","number":Math.floor(data[1])},
    {"name":"Snakeplant","color":"rgb(8, 8, 114)","number":Math.floor(data[2])}])
})

function addSpecies() {
    let data = {
        name: document.getElementById('name').value,
        preyID: selectedprey == null ? -1 : selectedprey.ID,
        column: selectedprey == null ? -1 : selectedprey.column,
        race: document.getElementById('race').value
    };
    socket.emit('add-species', data);
}

function drawSpecies(species, x, y) {
    if (!species) return;
    if (columnHeights[x] == undefined) columnHeights[x] = 1;
    else columnHeights[x]++;
    if (y == undefined) {
        console.log(species.preyID);
         y = columnHeights[x] - 1;
    }
    let div = document.createElement('DIV');
    div.className = 'species';
    div.style.position = 'absolute';
    div.style.left = (x * (cellWidth + horizontalPadding)) + "px";
    div.style.bottom = (y * (cellHeight + verticalPadding)) + "px";
    div.style.width = cellWidth + "px";
    div.style.height = cellHeight + "px";
    div.style.backgroundColor = species.preyID < 0 ? "green" : "red";
    div.id = species.ID;
    div.style.zIndex = -1;
    div.style.backgroundImage = "url(/images/" + species.image + ".png)";
    chainsContainer.appendChild(div);
    div.species = species;
    div.onclick = () => { setprey(div.species); setIsTyping(false); };
    div.onmouseenter = () => {showInfo(div.species); };
    let name = document.createElement('h2');
    name.innerText = species.name;
    name.style.overflow = 'hidden';
    name.style.height = '60px';
    div.appendChild(name);
    let biomass = document.createElement('h2');
    biomass.innerText = Math.floor(species.biomass);
    biomass.id = "biomass";
    div.style.animationName = species.preyID < 0 ? "producer-spawn" : "consumer-spawn";
    div.appendChild(biomass);
    speciesElements[species.ID] = div;
    let effect = document.createElement('img');
    effect.src = "/images/arrow.png";
    effect.className = "up-arrow";
    div.appendChild(effect);
}

function undrawSpecies(species) {
    let div = speciesElements[species.ID];
    div.remove();
}

function updateSpecies(species) {
    let div = speciesElements[species.ID];
    if (isElementInViewport(div)) {
        let img = div.childNodes[div.childNodes.length - 1];
        if (div.species.biomass < species.biomass) {
            img.className = "up-arrow";
        } else {
            img.className = "down-arrow";
        }
        img.style.animationName = "none";
        img.offsetHeight;
        img.style.animation = null;
        img.style.animationIterationCount = "1";
    }
    div.childNodes[1].innerText = Math.floor(species.biomass);
    div.species = species;
}

function setprey(species) {
    selectedprey = species;
    document.getElementById('prey').innerText = species == null ? "Producer" : "prey: " + species.name;
}

function badRequest(message) {
    let info = document.getElementById("info");
    info.innerText = message;
}

function sendMessage() {
    let nickname = document.getElementById("nickname");
    let message = document.getElementById("message");
    let data = {
        nickname : nickname.value,
        message : message.value
    };
    message.value = "";
    socket.emit('say',data);
}

function addComment(comment) {
    let p = document.createElement('p');
    p.innerText = comment.nickname + ": " + comment.message;
    chatContent.prepend(p);
}

function showInfo(species) {
    info.innerHTML = "";
    let name = document.createElement('h3');
    name.innerText = "Name: " + species.name;
    let biomass = document.createElement('h3');
    let b = Math.floor(species.biomass);
    biomass.innerText = "Biomass: " + b;
    let prey = document.createElement('h3');
    if (species.preyID < 0) {
        prey.innerText = "Producer";
    } else {
        let preyElement = document.getElementById(species.preyID);
        if (preyElement) {
            prey.innerText = "Prey: " + preyElement.species.name;
        } else {
            prey.innerText = "No prey";
        }
    }
    let image = document.createElement('img');
    image.src = "/images/" + species.image + ".png";
    info.appendChild(name);
    info.appendChild(biomass);
    info.appendChild(prey);
    info.appendChild(image);
}

var loopInterval = setInterval(loop,5);
var w = false;
var s = false;
var a = false;
var d = false;

var isTyping = false;

function setIsTyping(b) {
    isTyping = b;
}

var verticalPosition = 0;
var horizontalPosition = 0;

var verticalVelocity = 0;
var horizontalVelocity = 0;

var verticalAcceleration = 0.1;
var horizontalAcceleration = 0.1;
var verticalDeceleration = 0.1;
var horizontalDeceleration = 0.1;

function keydown() {
	var evt = window.event;
	var chr = evt.keyCode;
	switch (chr) {
		case 87:
		w = true;
		break;
		
		case 83:
		s = true;
		break;
		
		case 65:
		a = true;
		break;
		
		case 68:
		d = true;
        break;
        
        case 13:
        sendMessage();
        break;
	}

}

function keyup() {
	var evt = window.event;
	var chr = evt.keyCode;
	switch (chr) {
		case 87:
		w = false;
		break;
		
		case 83:
		s = false;
		break;
		
		case 65:
		a = false;
		break;
		
		case 68:
		d = false;
		break;
	}
}

function loop() {
    if (isTyping) {
        w = false;
        s = false;
        a = false;
        d = false;
    }
    if (w) {
        verticalVelocity += verticalAcceleration;
    } else if (verticalVelocity > 0) {
        verticalVelocity -= verticalDeceleration;
        if (verticalVelocity < 0) verticalVelocity = 0;
    }
    if (s) {
        verticalVelocity -= verticalAcceleration;
    } else if (verticalVelocity < 0) {
        verticalVelocity += verticalDeceleration;
        if (verticalVelocity > 0) verticalVelocity = 0;
    }
    if (a) {
        horizontalVelocity -= horizontalAcceleration;
    } else if (horizontalVelocity < 0) {
        horizontalVelocity += horizontalDeceleration;
        if (horizontalVelocity > 0) horizontalVelocity = 0;
    }
    if (d) {
        horizontalVelocity += horizontalAcceleration;
    } else if (horizontalVelocity > 0) {
        horizontalVelocity -= horizontalDeceleration;
        if (horizontalVelocity < 0) horizontalVelocity = 0;
    }

    verticalPosition += verticalVelocity;
    horizontalPosition += horizontalVelocity;
    chainsContainer.style.bottom = (-verticalPosition) + "px";
    chainsContainer.style.left = (-horizontalPosition) + "px";
}

function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
    );
}