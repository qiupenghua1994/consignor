/**
 * Created by Administrator on 2017/8/14.
 */
(function (angular) {

    function AuthorizeController($scope) {

        $scope.treeOpt = {
            url: 'json/tree.json'
        }

    }

    angular.module('manage')
        .controller('AuthorizeController', AuthorizeController)
})(window.angular)