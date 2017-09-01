/**
 * Created by Administrator on 2017/8/14.
 */
(function (angular) {

    function EnteringController($scope){

        $scope.data ={
            type:1
        };

        $scope.file = {};
        $scope.$watch('file', function () {
            console.log($scope.file);
        })

        $scope.change = function (a) {
            var a = $scope.data.file;
            console.log(a)
        }

    }

    angular.module('manage')
        .controller('EnteringController',EnteringController)
})(window.angular)