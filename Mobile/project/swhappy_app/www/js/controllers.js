angular.module('starter.controllers', [])

.controller('SurveyCtrl', function($scope) {})

.controller('DashCtrl', function($scope) {})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
