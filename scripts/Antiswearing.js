//ANTISWEARING MODULE BY KAT PURPY

/////////////SWEARING STUFF//////////////
swear_words = JSON.parse(require("fs").readFileSync("./Antiswearing.swears.json"))["swears"];

//////////////////////////////////////

////////////////SITE STUFF/////////////
site_mask=JSON.parse(require("fs").readFileSync("./Antiswearing.sitesmask.json"))["sitemask"];
///////////////////////////////////////

///////////////DATA FOR MASK RESOLVING//////////
word_masks = JSON.parse(require("fs").readFileSync("./Antiswearing.wordmasks.json"));
///////////////////////////////////////////////



function init(){
	loadmask();
}


/////////////////////////

function Contains(Text,Pattern){
	if(Text.toLowerCase().search(Pattern) !=-1){
		return true;
	}else{
		return false;
	}
}
function ContainsLink(Text){
	var RESULT = false;
	site_mask.forEach(function(item,index,array){
		if(Contains(Text,item))RESULT = true;
	})
	return RESULT;
}
/////////////////////////






function Antiswear_ContainsSwearingWord(Text){
	var RESULT = false;
	swear_words.forEach(function(item,index,array){
		if(Contains(Text,item))RESULT = true;
	})
	return RESULT;
}


function Antiswear_Check(text){
  text = text.replace(/\s+/g, '');
  text = text.replace(/\*/g, '');
  
  text=unmask(text);
  text = text.replace(/\s+/g, '');
  text = text.replace(/\*/g, '');
  return Antiswear_ContainsSwearingWord(text);
  
}
function Antiswear_Check_4link(text){
	text = text.replace(/\s+/g, '');
  text = text.replace(/\*/g, '');
  
  return ContainsLink(text);
}

///////////////////////////UNMASKING STUFF///////////////////

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var word_masks;////// = JSON.parse(require("fs").readFileSync("word_masks.json"));



function loadmask(){
	
};
	//console.log(word_masks);

function getmask(){return word_masks;}


function unmask(word){
	word = word.toUpperCase();
	for(var pattern in word_masks["word_mask"]){
	word_masks["word_mask"][pattern].forEach((mask,id,array)=>{
	var IsFinished = false;
	var times = 0;
	word = word.replaceAll(mask,pattern);
	});}
	return word.toLowerCase();
}


function unitest(){
	var TEST_WORDS = ["f u c k me","d1ck hurt$","h o l y  f$%@%%#uck","www.pornhub.com"];
	
	for(var owo in TEST_WORDS){
	console.log(TEST_WORDS[owo] + " is swear? - " + Antiswear_Check(TEST_WORDS[owo]));
	console.log(TEST_WORDS[owo] + " is link? - " + Antiswear_Check_4link(TEST_WORDS[owo]));
	}
	
}
init();

module.exports.Check4Link = Antiswear_Check_4link;
module.exports.Check4Swear = Antiswear_Check;
module.exports.Unittest = unitest;