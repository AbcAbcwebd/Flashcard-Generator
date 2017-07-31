var ClozeCard = function(text, cloze){
	this.cloze = cloze;
	this.fullText = text;
	this.partialText;
	this.findPartialText = function(){
		var localPartial = this.fullText.replace(this.cloze, "_________");
		if (localPartial){
			this.partialText = localPartial;
		};
		if (this.partialText.indexOf("_________") < 0){
			console.log("Error: Phrase not found in sentence.");
            console.log("Please re-add flash card.");
		};
	};
};

module.exports = ClozeCard;