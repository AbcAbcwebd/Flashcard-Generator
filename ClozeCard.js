var ClozeCard = function(text, cloze){
	this.cloze = cloze;
	this.fullText = text;
	this.partialText;
	this.findPartialText = function(){
		var localPartial = this.fullText.replace(this.cloze, "");
		if (localPartial){
			this.partialText = localPartial;
		} else {
			console.log("Please input proper cloze request.");
		}
	}
}

module.exports = ClozeCard;