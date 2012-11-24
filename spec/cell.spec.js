describe("Cell being", function() {
	var cell;
	beforeEach(function() {
	    cell = new Cell(0);
	});
	
  	it("A cell has an id", function() {
    	expect(cell.id).toEqual(0);
  	});
	
  	it("A cell has neightbours", function() {
    	expect(cell.neightbours).toEqual(jasmine.any(Array));
  	});
	
  	it("A cell has 8 neightbours", function() {
		expect(cell.neightbours.length).toEqual(8);
  	});
	
  	it("We can count his alives neightbours", function() {
		expect(cell.countAliveNeightbours()).toEqual(0);
  	});
  
});

describe("Univers being", function() {
	var univers;
	beforeEach(function() {
	    univers = new Univers(50);
	});
	
  	it("An univers has an age", function() {
    	expect(univers.age).toEqual(jasmine.any(Number));
  	});
	
  	it("Method pos gives the correct position of a cell with 2 coordinates", function() {
    	expect(univers.pos(5,10)).toEqual(505);
  	});
	
  	it("Each part of univers is a alive, dead cell, or cell willbe", function() {
    	expect(univers.cells[univers.pos(1,1)] instanceof Cell).toBeTruthy();
  	});
  	
});

describe("Cells in univers", function() {
	var univers;
	beforeEach(function() {
	    univers = new Univers(50);
	    univers.add([
 	    	{x:23, y:24},
	    	{x:24, y:24},
	    	
	    	{x:26, y:26},
	    	{x:26, y:27},
	    	{x:26, y:28},
	    	
	    	{x:23, y:29},
	    	{x:24, y:28},
	    	{x:24, y:29},
	    	{x:24, y:30},
	    	{x:25, y:29}
	    ]);
	});
	
  	it("Alive cell is correctly add", function() {
    	expect(univers.cells[univers.pos(23, 24)].alive).toBeTruthy();
    	expect(univers.cells[univers.pos(24, 24)].alive).toBeTruthy();
    	expect(univers.cells[univers.pos(26, 26)].alive).toBeTruthy();
    	expect(univers.cells[univers.pos(26, 27)].alive).toBeTruthy();
  	});
  	
  	it("A cell has an unique id", function() {
  		var listId = new Array();
  		$.each(univers.cells, function(cell) {
  			if(cell instanceof Cell) { listId.push(cell.id); }
  		});
  		$.each(univers.cells, function(cell) {
  			if(cell instanceof Cell) { expect($.inArray(cell.id, listId)).toBeFalsy(); }
  		});
  	});
  	
  	it("Univers could process neightbours for a cell", function() {
  		var neightbours = univers.getNeightboursFor(univers.pos(24,29));
  		//console.log(univers.getNeightboursFor(univers.pos(24,29)));
  		expect(neightbours).toEqual(jasmine.any(Array));
  		expect(neightbours[0].alive).toBeFalsy();
  		expect(neightbours[1].alive).toBeTruthy();
  		expect(neightbours[2].alive).toBeFalsy();
  		expect(neightbours[3].alive).toBeTruthy();
  		expect(neightbours[4].alive).toBeTruthy();
  		expect(neightbours[5].alive).toBeFalsy();
  		expect(neightbours[6].alive).toBeTruthy();
  		expect(neightbours[7].alive).toBeFalsy();
  	});

  	it("A cell has alives neightbours", function() {
  		expect(univers.cells[univers.pos(24,29)].countAliveNeightbours()).toEqual(4);
  	}); 
  	
});

describe("Univers generation start and end life", function() {
	var univers, nbGen, vitesse = 500;
	beforeEach(function() {
	    univers = new Univers(50); 
	    nbGen = 10;
	    univers.add([
	    	{x:23, y:24},
	    	{x:24, y:24},
	    	
	    	{x:26, y:26},
	    	{x:26, y:27},
	    	{x:26, y:28},
	    	
	    	{x:23, y:29},
	    	{x:24, y:28},
	    	{x:24, y:29},
	    	{x:24, y:30},
	    	{x:25, y:29}
	    	
	    ]);
	});
	
  	it("NextGeneration has been called x times", function() {
    	jasmine.Clock.useMock();
	    univers.startLife(nbGen, vitesse);
	    spyOn(univers, "nextGeneration");
  		jasmine.Clock.tick((nbGen + 1) * univers.vitesse);
    	expect(univers.nextGeneration.callCount).toEqual(11);
  	});
	
  	it("- Asynchronous call - Life is running", function() {
  		runs( function () {
  			univers.startLife(nbGen, vitesse);
  		});
  		waitsFor( function () { return univers.age == 10; }, "age must be 10", (nbGen + 1) * univers.cycle);
  	});
  	
  	it("- Asynchronous call - Rule 1 : Any live cell with fewer than two live neighbours dies, as if caused by under-population", function () {
  		runs( function () {
  			univers.startLife(nbGen, vitesse);
  		});
  		waitsFor( function () { return univers.cells[univers.pos(23, 24)].alive === false; }, "cell dies", (1 * univers.cycle) + 1);	
  	});
  	
  	it("- Asynchronous call - Rule 2 : Any live cell with two or three live neighbours lives on to the next generation", function () {
  		runs( function () {
  			univers.startLife(nbGen, vitesse);
  		});
  		waitsFor( function () { return univers.cells[univers.pos(26, 27)].alive === true; }, "cell lives", (1 * univers.cycle) + 1);	
  	});
  	
  	it("- Asynchronous call - Rule 3 : Any live cell with more than three live neighbours dies, as if by overcrowding", function () {
  		runs( function () {
  			univers.startLife(nbGen, vitesse);
  		});
  		waitsFor( function () { return univers.cells[univers.pos(24, 29)].alive === false; }, "cell dies", (1 * univers.cycle) + 1);	
  	});
  	
  	it("- Asynchronous call - Rule 4 : Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction", function () {
  		runs( function () {
  			univers.startLife(nbGen, vitesse);
  		});
  		waitsFor( function () { return univers.cells[univers.pos(23, 29)].alive === true; }, "cell lives", (1 * univers.cycle) + 1);	
  	});
});