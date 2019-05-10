const Species = require('./species');
const socketer = require('./socketer');

var biteSize = 0.05;
var minBite = 1;
var productionSize = 5;


function changeMass(index, change) {
    Species.getMasses()[index] += change;
    if (Species.getMasses()[index] < 0) Species.getMasses()[index] = 0;
}

var loopInterval;

function start() {
    if (!loopInterval) {
        loopInterval = setInterval(loop,1000);
    }
}

function loop() {
    Species.getSpeciess().forEach(element => {
        if (element.biomass > 0) {
            if (Math.random() > 0.9) {
                bite(element);
            }
        }
    });
    Species.setSpeciess(Species.getSpeciess().filter((element) => {
        if (element.biomass > 0) {
            return true;
        } else {
            socketer.removeSpecies(element);
            Species.removeSpecies(element);
        }
    }));
    socketer.updateMasses(Species.getMasses());
}

function bite(species) {
    if (species.preyID < 0) {
        species.biomass += productionSize;
        changeMass(species.race,productionSize);
        socketer.updateSpecies(species);
        return;
    }

    let prey = Species.getSpeciess().find((element) => {
        return element.ID == species.preyID;
    });
    if (prey) {
        let b = biteSize * species.biomass;
        if (b < minBite) b = minBite;
        prey.biomass -= b;
        species.biomass += b;
        changeMass(species.race,b);
        changeMass(prey.race, -b);
        socketer.updateSpecies(species);
        socketer.updateSpecies(prey);
    } else {
        let b = biteSize * species.biomass;
        if (b < minBite) b = minBite;
        species.biomass -= b;
        changeMass(species.race, -b);
        socketer.updateSpecies(species);
    }
}

module.exports.start = start;