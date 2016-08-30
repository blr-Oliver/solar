angular.module('solar', [])
.const('G', 100)
.factory('weightedAverage', function(){
	/**
		Вычисляет средневзвешенный вектор направлений dirs с весами
		weights

		@param dirs
				список векторов
		@param weights
				список весов
		@return
				средневзвешенный вектор (центр масс)
	*/
	return function(dirs, weights){
		var cx = 0, cy = 0, m = 0;
		for(var i = 0; i < dirs.length; ++i){
			cx += dirs[i].x * weights[i];
			cy += dirs[i].y * weights[i];
			m += weights[i];
		}
		return { x: cx / m, y: cy / m };
	}
})
.factory('normalize', ['weightedAverage', function(weightedAverage){
	/**
		Нормализует значения свойства property во всем массиве так,
		чтобы его средневзвешенное по этому свойству и весам weight
		было равно (0, 0)

		@param planets
				список планет
		@param property
				имя свойства, которе нужно нормализовать
	*/
	return function(planets, property){
		var center = weightedAverage(
			planets.map(p => p[property]), //извлекаем массив свойств property
			planets.map(p => p.weight) //извлекаем массив масс
		);
		planets.forEach(function(p){ //производим коррекцию
			p[property].x -= center.x;
			p[property].y -= center.y;
		});
	}
}])
.factory('gravitation', ['G', function(G){
	/**
		Вычисляет силу притяжения между двумя планетами

		@param p1
				первая планета
		@param p1
				вторая планета
		@return вектор силы притяжения, направленный от первой планеты ко второй
	*/
	return function(p1, p2){
		var direction = {
			x: p2.coords.x - p1.coords.x,
			y: p2.coords.y - p1.coords.y
		};
		var r = Math.hypot(direction.x, direction.y);
		var value = G * p1.weight * p2.weight / (r * r);
		var multiplier = Math.sqrt(value / r);
		direction.x *= multiplier;
		direction.y *= multiplier;
		return direction;
	}
}])
.factory('emulate', ['weightedAverage', function(weightedAverage){
	/**
		Переводит планетарную систему на фиксированный отрезок времени вперед

		@param planets
				список планет
		@param dt
				смещение по времени
	*/
	return function(planets, dt){

	}
}])
.controller('SolarController', ['weightedAverage', 'normalize', function(weightedAverage, normalize){
	function createPlanet(x, y, speedX, speedY, m){
		return {
			coords : {x: x, y: y},
			speed: {x: speedX, y: speedY},
			weight: m
		};
	}
	this.planets = [
		createPlanet(0, 0, 0, 1, 900),
		createPlanet(1, 0, 0, -1, 100)
	];
	normalize(this.planets, 'coords');
	normalize(this.planets, 'speed');
	console.log(this.planets);
}]);