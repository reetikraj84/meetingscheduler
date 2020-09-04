meetingsApp.controller("AddMeetingController", function($scope, $http, $location, $routeParams, $resource, toastr){
	function isNewMeeting() {
		return $routeParams.meetingId == null
	}

	function addInterview(starttime,endtime,userlist,users,usermap,Interviews){
	    var can = true;
	    for(var x in userlist)
	    {
	    	console.log(users);
	    	console.log(x);
	      let userid=users[x];
	      console.log(Object.keys(users));
	      if(usermap[userid]){
	        for(var i=0;i<usermap[userid].length;i++){
	          console.log("Start time of other meeting:",(Interviews[usermap[userid][i]])["starttime"]);
	          console.log("End time of other meeting:",(Interviews[usermap[userid][i]])["endtime"]);
	          console.log(Date.parse((Interviews[usermap[userid][i]])["starttime"]));
	          console.log(Date.parse((Interviews[usermap[userid][i]])["endtime"]));
	          if((Date.parse(Interviews[usermap[userid][i]])["starttime"]) >=Date.parse(endtime) || Date.parse((Interviews[usermap[userid][i]])["endtime"])<=Date.parse(starttime))
	          continue;
	          else
	          can=false;
	        }
	    
	      }
	      
	    }
	    console.log(can);
	    if(can)
	    	return true;
	    else
	    	return false;
  }

	if(isNewMeeting()) {

		$scope.headerText = "Add Meeting";
		$scope.startTimeObj = new Date();
		$scope.endTimeObj = new Date();

		$scope.save = function($event) {
			var meeting = {};
			meeting.title = $scope.title;
			meeting.type = $scope.type;
			meeting.start = $scope.startTimeObj.toISOString();
			meeting.end = $scope.endTimeObj.toISOString();
			meeting.invitees = $scope.invitees.map(a => a.name);
			let users = {};
			let usermap={};
			let Interviews={};
			$http({
				method: 'GET',
				url: 'meetings',
			})
			.success(function(data, status, headers, config) {
				var count=1;
				for(var i = 0; i < data.length; i++) {
					for (var j = 0; j < (data[i])['invitees'].length; j++) {
						if(!((((data[i])['invitees'])[j]) in users)) {
							users[((data[i])['invitees'])[j]]=count;
							count++;
						}
					}
				}
				for(var i = 0;i < Object.values(users).length;i++) {
					for(var j = 0; j < data.length; j++) {
						if((data[j])['invitees'].indexOf((Object.keys(users))[i]) > -1) {
							if(usermap[(Object.values(users))[i]] != undefined)
								usermap[(Object.values(users))[i]].push(data[j]._id);
							else
								usermap[(Object.values(users))[i]] = [(data[j]._id)];
						}
					}
				}
				for(var i = 0; i < data.length; i++) {
					Interviews[data[i]._id]={'starttime': data[i].start, 'endtime': data[i].end};
				}
			});
			if(addInterview(meeting.start,meeting.end,meeting.invitees,users,usermap,Interviews)) {
				$http({
					method: 'POST',
					url: 'meetings',
					data: meeting
				})
				.success(function(data, status, headers, config) {
					toastr.success('Meeting created successfully.'); 
					$location.path('view')
				})
				.error(function(data, status, headers, config) {
					toastr.error(data['message'], 'Could not create!');
				});
			}
			else {
				toastr.error("Timings are clashing with existing meetings for invitees.");
			}
		}

	} else {
		$scope.headerText = "Edit Meeting";
		$http({
			method: 'GET',
			url: 'meetings/' + $routeParams.meetingId,
		})
		.success(function(data, status, headers, config) {
			$scope.title = data['title'];
			$scope.type = data['type'];
			$scope.status = data['status'];
			$scope.invitees = data['invitees'];
			$scope.startTimeObj = new Date(data['start']);
			$scope.endTimeObj = new Date(data['end']);
			//$scope.agenda = data['agenda']
		})

		$scope.save = function($event) {
			var meeting = {};
			meeting.title = $scope.title;
			meeting.type = $scope.type;
			meeting.start = $scope.startTimeObj.toISOString();
			meeting.end = $scope.endTimeObj.toISOString();
			meeting.invitees = $scope.invitees.map(a => a.name);

			$http({
			method: 'PUT',
			url: 'meetings/' + $routeParams.meetingId,
				data: meeting
			})
			.success(function(data, status, headers, config) {
				toastr.success('Meeting updated successfully.');
				$location.path('view')
			})
			.error(function(data, status, headers, config) {
				toastr.error(data['message'], 'Could not update!');
			})
		}
	}

	$scope.back = function($event) {
		$location.path('view')
	}

	$scope.deleteMeeting = function($event) {
		$http({
			method: 'DELETE',
			url: 'meetings/' + $routeParams.meetingId,
		})
		.success(function(data, status, headers, config) {
			// $location.path('view')
		})
	};

	// Types are hardcoded.
	$scope.types = ['INTERVIEW', 'DECISION', 'REVIEW', 'BRAINSTORM', 'INFORMATIONAL', 'STATUS', 'GENERAL']

})
