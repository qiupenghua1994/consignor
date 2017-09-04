/**
 * Created by Administrator on 2017/8/14.
 */
(function (angular, $) {

    function AccountController($scope, $rootScope) {

        $rootScope.$state.go('account_query.detail');
    }

    function AccountBalanceController($scope) {
        var data = [
            {
                name: '项目1',
                type: '类型1',
                account: '100,222.00',
                accountName: '上海交大',
                status: '未开户',
                time: '2007/5/5',
                income: '100,222.00',
                outcome: '22,222.00',
                balance: '78,000.00'
            },
            {
                name: '项目2',
                type: '类型2',
                account: '130,222.00',
                accountName: '上海交大',
                status: '未开户',
                time: '2007/5/5',
                income: '100,222.00',
                outcome: '22,222.00',
                balance: '78,000.00'
            },

        ];
        $scope.grid = {
            autoFit: true,
            onGridReady: function () {
                $scope.grid.api.setRowData(data);
            },
            columnDefs: [
                {
                    headerName: '交易日期',
                    field: 'time'
                },
                {
                    headerName: '当日余额',
                    field: 'account'
                },
                {
                    headerName: '收入',
                    field: 'income'
                },
                {
                    headerName: '支出',
                    field: 'outcome'
                },
                {
                    headerName: '轧差',
                    field: 'balance'
                }

            ]
        };

        $scope.data = {};
        $scope.selectOpt = {
            placeholder: '输入项目名称或项目对应帐号关键字进行查询'
        }

        $scope.setDate = function (num) {
            var today = new Date();
            $scope.data.end = new Date();
            $scope.data.start = new Date(today.setDate(today.getDate() - num));

        }

    }

    function AccountDetailController($scope) {
        var data = [
            {
                name: '项目1',
                type: '类型1',
                account: '11236545',
                accountName: '上海交大',
                status: '未开户',
                time: '2007/5/5',
                income: '100,222.00',
                outcome: '22,222.00',
                balance: '78,000.00'
            },
            {
                name: '项目2',
                type: '类型1',
                account: '11236545',
                accountName: '上海交大',
                status: '未开户',
                time: '2007/5/5',
                income: '100,222.00',
                outcome: '22,222.00',
                balance: '78,000.00'
            },

        ];
        $scope.grid = {
            autoFit: true,
            onGridReady: function () {
                $scope.grid.api.setRowData(data);
            },
            columnDefs: [
                {
                    headerName: '交易日期',
                    field: 'time'
                },
                {
                    headerName: '对方账户',
                    field: 'account'
                },
                {
                    headerName: '对方户名',
                    field: 'accountName'
                },
                {
                    headerName: '收入',
                    field: 'income'
                },
                {
                    headerName: '支出',
                    field: 'outcome'
                },
                {
                    headerName: '余额',
                    field: 'balance'
                },
                {
                    headerName: '操作',
                    field: 'evt'
                }

            ]
        }

        $scope.dateOpt = {};

        $scope.time = '2017-05-05';
        $scope.data = {};
        $scope.selectOpt = {
            placeholder: '输入项目名称或项目对应帐号关键字进行查询'
        }

        $scope.setDate = function (num) {
            var today = new Date();
            $scope.data.end = new Date();
            $scope.data.start = new Date(today.setDate(today.getDate() - num));
        }

        $scope.directionList = [
            {id: 1, name: '收入'},
            {id: 2, name: '支出'},
            {id: 3, name: '全部'},
        ];


    }

    angular.module('manage')
        .controller('AccountController', AccountController)
        .controller('AccountBalanceController', AccountBalanceController)
        .controller('AccountDetailController', AccountDetailController)
})(window.angular, window.jQuery)