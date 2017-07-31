var ClozeCard = function(text, cloze){
	this.cloze = cloze;
	this.fullText = text;
	this.partialText;
	this.findPartialText = function(){
		var localPartial = this.fullText.replace(this.cloze, "_________");
		if (localPartial){
			this.partialText = localPartial;
		};
	}
}

module.exports = ClozeCard;