(function (angular) {
	'use strict';

	// use angular
	// 创建模块
	var mod = angular.module('mytodos',[]);
	// 控制器
	mod.controller('myController',['$scope','$location','$window',function($scope,$location,$window){
		// 输入文本框model
		$scope.innerText = '';

		// 持久性存储
		var storage = $window.localStorage;
		console.log(storage);
		$scope.todos = storage['my_todos'] ? JSON.parse(storage['my_todos']) : [];
		var saveTodos = function() {
			storage['my_todos'] = JSON.stringify($scope.todos);
		};
		console.log($scope.todos);
		// 解决$$hashKey相同的问题
		for(var i = 0;i < $scope.todos.length;i++){
			$scope.todos[i].$$hashKey = Math.random();
		}

		$scope.toggle = function(){
			saveTodos();
		};
		// 初始list值model
		//$scope.todos = [ // 数组储存list数据
		//	{id:1,text:'学习',completed:true},
		//	{id:2,text:'吃饭',completed:false},
		//	{id:3,text:'睡觉',completed:false}
		//];
		// json形式储存数据二
		$scope.todos2 = {
			1:{id:1,text:'学习',completed:true},
			2:{id:2,text:'刷牙',completed:false},
			3:{id:3,text:'洗脸',completed:false}
		};

		// 添加TODO
		$scope.add = function(){
			if ($scope.innerText === ''){ //判断输入为空不添加
				return;
			}
			$scope.todos.push({id:Math.random(),text:$scope.innerText,completed:false}); //Math.random()规避ID重复
			saveTodos();
			$scope.innerText = ''; // 添加完清空文本框

		};

		// 删除todo
		$scope.remove = function(id){
			// zhao找到点击删除的list，通过id,遍历todos
			for(var i = 0;i < $scope.todos.length;i++){
				if(id === $scope.todos[i].id){
					$scope.todos.splice(i,1);
					break;
				}
			}
			saveTodos();
		};

		// 清空已完成completed
		$scope.clear = function(){
			var arr = [];
			for(var i = 0;i < $scope.todos.length;i++){
				if($scope.todos[i].completed === false){
					arr.push($scope.todos[i]);
				}
			}
			$scope.todos = arr;
			saveTodos();
		};
		// 是否有已完成项
		$scope.hasCompleted = function(){
			// 判断 每一项
			for(var i = 0;i < $scope.todos.length;i++){
				if($scope.todos[i].completed === true){
					return true;
				}
			}
			return false;
		};

		// 全选/取消完成
		var now = true;
		$scope.toggleAll = function(){
			for(var i = 0;i < $scope.todos.length;i++){
				$scope.todos[i].completed = now;
			}
			now = !now;
			saveTodos();
		};

		// 修改编辑todo  根据ID找到编辑的list
		$scope.currentID = -1; // 定义存放当前id模型
		$scope.editing = function(id){
			// 找到当前ID
			$scope.currentID = id;
		};
		$scope.save = function(){
			$scope.currentID = -1; // 编辑完成后正常显示
		};

		// 帅选todos：自己的粗糙算法,传入value
		$scope.did = '';
		$scope.all = function(){
			$scope.did = '';
		};
		$scope.active = function(){
			$scope.did = false;
		};
		$scope.completed = function(){
			$scope.did = true;
		};
		// 筛选todos二：利用锚点，传入{}
		$scope.complete = {};
		$scope.loc = $location;
		$scope.$watch('loc.$$hash',function(now,old){
			console.log(now);
			switch (now){
				case '/' :
					$scope.complete = {};
					break;
				case '/active' :
					$scope.complete = {completed:false};
					break;
				case '/completed':
					$scope.complete = {completed:true};
					break;
			}
		});
		// 过滤器默认使用模糊匹配，所以出现不精确问题，使用自定义比较函数
		$scope.equalCompare = function(source,target){
			//console.log(source);
			//console.log(target);
			return source === target;
		}
	}]);
})(angular);
