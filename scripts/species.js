var maxNameLength = 30;

var currentID = 0;

var speciess = [];
var foodChains = [];

var startingBoimass = 100;
var images = ["apple", "jellow","snakeplant"];
var abilities = ["none","shoot-left","shoot-right"]
var masses = [0,0,0];
/**
 * Returns a new species that preys on the
 * species with the given ID. Allso adds it to the 
 * speciess list.
 * @param {String} name The name of the species
 * @param {Number} preyID The ID of the prey species.
 * Negative number to make this a producer species.
 */
function Species(name,preyID, column, race, ability) {
    if (!ability || isNaN(ability) || ability < 0 || ability > ability.length - 1) {
        ability = 0;
    }
    if (!race || isNaN(race) || race < 0 || race > images.length - 1) {
        race = Math.floor(Math.random() * images.length);
    }
    if (name.length > maxNameLength) return;
    if (isNaN(preyID) || preyID === "") preyID = 0;
    let species = {
        ID : currentID,
        name : name,
        preyID : preyID,
        biomass : startingBoimass,
        image : images[race],
        race : race,
        ability : abilities[ability]
    };
    currentID++;
    speciess.push(species);
    if (isNaN(column)) column = 0;
    if (column >= 0) {
        species.column = column;
        let placed = false;
        for (let i = 0; i < foodChains[column].length; i++) {
            if (foodChains[column][i] == undefined) {
                foodChains[column][i] = species;
                placed = true;
                species.row = i;
                break;
            }
        }
        if (!placed) {
            species.row = foodChains[column].length;
            foodChains[column].push(species);
        }
    } else {
        let placed = false;
        for (let i = 0; i < foodChains.length; i++) {
            if (foodChains[i][0] == undefined) {
                foodChains[i][0] = species;
                placed = true;
                species.column = i;
                break;
            }
        }
        if (!placed) {
            foodChains.push([species]);
            species.column = foodChains.length - 1;
        }
        species.row = 0;
    }
    masses[species.race] += species.biomass;
    return species;
}

function removeSpecies(species) {
    for (let i = 0; i < foodChains[species.column].length; i++) {
        if (foodChains[species.column][i]) {
            if (foodChains[species.column][i].ID == species.ID) {
                foodChains[species.column][i] = undefined;
                break;
            }
        }
    }
}

module.exports = Species;
module.exports.getSpeciess = () => {return speciess;};
module.exports.setSpeciess = (s) => {speciess = s;};
module.exports.getMasses = () => {return masses};
module.exports.foodChains = foodChains;
module.exports.removeSpecies = removeSpecies;