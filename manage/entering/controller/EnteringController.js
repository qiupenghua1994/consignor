/**
 * Created by Administrator on 2017/8/14.
 */
(function (angular) {

    function EnteringController($scope){

        $scope.data ={
            type:1
        };
    }

    angular.module('manage')
        .controller('EnteringController',EnteringController)
})(window.angular)