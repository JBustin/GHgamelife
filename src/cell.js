window.Cell = (function () {
	// attributes
	var constructor = function (id, alive) {
		this.id = id;
		if(alive) {
			this.alive = alive;
		} else {
			this.alive = false;
		}
		this.neightbours = new Array(null, null, null, null, null, null, null, null);
	};
	
	// methods
	constructor.prototype = {
		countAliveNeightbours: function () {
			var count = 0;
			for(var i in this.neightbours) {
				if(this.neightbours[i] instanceof Cell) {
					if(this.neightbours[i].alive) {
						count++;
					}
				}
			}
			return count;
		}
	};
	
	return constructor;
})();


window.Univers = (function () {
	// attributes
	var constructor = function (card) {
		this.nbCells = (card * card) + (2 * card) - 1;
		this.card = card;
		this.age = 0;	
		this.cells = new Array();
		for(var i = 0; i <= this.nbCells; i++) {
			this.cells[i] = new Cell(i);
		}
	};
	
	// methods
	constructor.prototype = {
		pos: function (x, y) {
			return x + (this.card * y);
		},
		add: function (positions) {
			var index = 0;
			for(var i in positions) {
				index = this.pos(positions[i].x, positions[i].y);
				this.cells[index].alive = true;
			}
			this.resfreshNeightbours();
		},
		fetch: function (index) {
			return this.cells[index];
		},
		getNeightboursFor: function (index) {
			return new Array(
				this.getNLB(index),
				this.getNCB(index),
				this.getNRB(index),
				this.getNL(index),
				this.getNR(index),
				this.getNLT(index),
				this.getNCT(index),
				this.getNRT(index)
			);
		},
		resfreshNeightbours: function () {
			for(var i = 0; i <= this.nbCells; i++) {
				this.cells[i].neightbours = this.getNeightboursFor(i);
			}
		},
		
		/** GENERATIONS **/
		startLife: function (nbGen, vitesse) {
			var that = this;
			this.vitesse = vitesse;
			this.nbGen = nbGen;
			this.life = setInterval(function(){ that.nextGeneration(); }, this.vitesse);
		},
		
		nextGeneration: function () {
			if(this.nbGen > 0) {
				var cellsClone = $.extend({}, this.cells);			
				for(var i in this.cells) {
					switch(this.cells[i].countAliveNeightbours()) {
						case 0 : case 1 : case 4 : case 5 : case 6 : case 7 : case 8 : cellsClone[i].alive = false; break;	// rule 1, 3
						case 3 : cellsClone[i].alive = true; break;	// rule 4
					}
				}
				this.cells = cellsClone;

				this.nbGen--;
				this.age++;
				$(document).trigger("nextGen");
			} else {
				this.stopLife();
				$(document).trigger("stopGen");
			}
		},
		
		stopLife: function () {
			clearInterval(this.life);
		},
		
		/** NEIGHTBOURS GETTERS **/
		getNLB: function (index) {
			if(index >= this.card && index % this.card != 0) {
				return this.cells[index - this.card - 1];
			} else {
				return null;
			}
		},
		getNCB: function (index) {
			if(index >= this.card) {
				return this.cells[index - this.card];
			} else {
				return null;
			}
		},
		getNRB: function (index) {
			if(index >= this.card && (index + 1) % this.card != 0) {
				return this.cells[index - this.card + 1];
			} else {
				return null;
			}
		},
		getNL: function (index) {
			if(index % this.card != 0) {
				return this.cells[index - 1];
			} else {
				return null;
			}
		},
		getNR: function (index) {
			if((index + 1) % this.card != 0) {
				return this.cells[index + 1];
			} else {
				return null;
			}
		},
		getNLT: function (index) {
			if(index < (this.nbCells - this.card) && index % this.card != 0) {
				return this.cells[index + this.card - 1];
			} else {
				return null;
			}
		},
		getNCT: function (index) {
			if(index < (this.nbCells - this.card)) {
				return this.cells[index + this.card];
			} else {
				return null;
			}
		},
		getNRT: function (index) {
			if(index < (this.nbCells - this.card) && (index + 1) % this.card != 0) {
				return this.cells[index + this.card + 1];
			} else {
				return null;
			}
		}
	};
	
	return constructor;
})();

window.GameOfLife = (function () {
	// attributes
	var constructor = function (card, elt, cells) {
		var univers = new Univers(card), pcells = cells;
		this.elt = elt;
		$.extend(this, univers);
		if(cells) {
			this.add(pcells);
		}
		this.display();
	};
	// methods
	constructor.prototype = {
		display: function () {
			var str = "<table>";
			for(var i in this.cells) {
				if(i % this.card === 0) 		{ str += "<tr>"; }
				str += '<td';
				if(this.cells[i].alive) 		{ str += ' class="alived"'; }
				str += '></td>';
				if((i+1) % this.card === 0) 	{ str += "</tr>"; }
			}
			str += "</table>";
			$(this.elt).html(str);
		},
		
		messenger: function (str) {
			$(this.elt).append(str);
		},
		
		start: function (nbGen, vitesse) {
			var that = this;
			this.startLife(nbGen, vitesse);
			$(document).bind("nextGen", function () {
				that.display();
			});
			$(document).bind("stopGen", function () {
				that.messenger("DONE !!");
			});
		}
	};
	
	return constructor;
})();