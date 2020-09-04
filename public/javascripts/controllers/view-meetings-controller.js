meetingsApp.controller("ViewMeetingsController", function($scope, $http, $location){

	$http({
		method: 'GET',
		url: 'meetings',
	})
	.success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			$scope.events.push({
				"title" : data[i]['title'],
				"start" : new Date(data[i]['start']),
				"end" : new Date(data[i]['end']),
				"invitees": data[i]['invitees'],
				"type": data[i]['type'],
				"allDay": false,
				"id": data[i]['_id']
			});
		}
	})

	$scope.addMeeting = function($event) {
		$location.path('add');
	}

	$scope.alertOnEventClick = function(calEvent, allDay, jsEvent, view) {
		$scope.$apply(function() {
			$location.path('edit/' + calEvent.id);
		});
	}

	$scope.renderCalender = function(calendar) {
		calendar.fullCalendar('render');
	};

	$scope.changeView = function(view,calendar) {
		calendar.fullCalendar('changeView',view);
	};

	$scope.uiConfig = {
		calendar:{
			height: 450,
			editable: true,
			header:{
				left: 'title',
				center: 'month,basicWeek,basicDay,agendaWeek,agendaDay',
				right: 'today prev,next',
			},
			editable: false,
			slotEventOverlap: false,
			eventClick: $scope.alertOnEventClick,
			timezone: 'local',
			eventRender: function(event, element) {
	            element.qtip({
	                content: event.invitees.join("<br/>"),
	                style: {
	                    background: 'black',
	                    color: '#FFFFFF'
	                },
	                position: {
	                    corner: {
	                        target: 'center',
	                        tooltip: 'bottomMiddle'
	                    }
	                }
	            });
        	}
		}
	};

	$scope.events = [];

	$scope.eventSources = [$scope.events];

})
