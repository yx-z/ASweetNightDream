/* @author: Yx-Z
 * @plugindesc: Create a new CAR vehicle
 *
 */
Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle('boat');
    this._vehicles[1] = new Game_Vehicle('ship');
    this._vehicles[2] = new Game_Vehicle('airship');
    this._vehicles[3] = new Game_Vehicle('car');
};

Game_Vehicle.prototype.isCar = function() {
    return this._type === 'car';
};

var initSpeed = Game_Vehicle.prototype.initMoveSpeed;
Game_Vehicle.prototype.initMoveSpeed = function() {
	if (this.isCar()) this.setMoveSpeed(5);
	else initSpeed.call();
    }
};

var isPassable = Game_Vehicle.prototype.isMapPassable;
Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    
};


