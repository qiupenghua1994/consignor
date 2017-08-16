/**
 * Created by Administrator on 2017/8/14.
 */
(function (angular) {

    function AuthorizeController($scope) {

        $scope.data = {
            type: 1
        };

        var data = [
            {name: '项目1', type: '类型1', status: '未开户', time: '2007/5/5'},
            {name: '项目2', type: '类型2', status: '已开户', time: '2007/5/5'}
        ]
        $scope.grid = {
            onGridReady: function () {
                $scope.grid.api.setRowData(data);
            },
            columnDefs: [
                {
                    headerName: '项目名称',
                    field: 'name'
                },
                {
                    headerName: '项目类型',
                    field: 'type'
                },
                {
                    headerName: '项目状态',
                    field: 'status'
                },
                {
                    headerName: '项目成立日期',
                    field: 'time'
                }

            ]
        }
    }

    angular.module('manage')
        .controller('AuthorizeController', AuthorizeController)
})(window.angular)