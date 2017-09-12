/**
 * Created by Administrator on 2017/8/14.
 */
(function (angular) {

    function AuthorizeController($scope) {

        $scope.treeOpt = {
            "setting": {"callback": {}},
            "zNodes": [{
                "name": "test1",
                "id": 1,
                "open": true,
                "children": [{"name": "test1_1", "id": 2}, {
                    "name": "test1_2",
                    "id": 3,
                    "children": [{"name": "test1_1", "id": 4}, {"name": "test1_2", "id": 5}]
                }]
            }, {
                "name": "test2",
                "id": 6,
                "open": true,
                "children": [{"name": "test2_1", "id": 7}, {"name": "test2_2", "id": 8}]
            }]
        }

    }

    angular.module('manage')
        .controller('AuthorizeController', AuthorizeController)
})(window.angular)