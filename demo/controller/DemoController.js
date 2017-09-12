/**
 * Created by 仇鹏骅 on 2017/9/5.
 */
(function (angular) {

    function DemoController($scope) {

        //弹窗
        $scope.openDialog = function () {
            var q = App.showDialog('demo/view/dialog.html', 'DemoDialogController');
            q.then(function (resp) {

                $scope.dialogValue = resp;
            });
        }

        //上传弹窗
        $scope.openUploadDialog = function () {
            var q = App.showDialog('demo/view/upload.html', 'DemoUploadController');
            q.then(function (resp) {

                $scope.fileName = resp;
            });
        }

        //树
        $scope.treeOnChange = function (treeNode, treeId, event) {
            console.log(treeNode);
        };

        //下拉列表
        $scope.selectOpt = {
            url: '../json/name.json',
            placeholder: '输或项目对应帐号关键字进行查询'
        };

        $scope.selectOnChane = function (selectNode, event) {
            console.log(selectNode);
        };


        //单选按钮
        $scope.checkRadioList1 = [
            {id: 1, text: '收入'},
            {id: 2, text: '支出'},
            {id: 3, text: '全部'},
        ];
        $scope.checkRadioList2 = [
            {id: false, text: '单选'},
            {id: true, text: '多选'},
        ];

        //date-picker 日期
        $scope.datePickerStart = '2017-09-01';
        $scope.datePicker = '2017-09-05';
        $scope.dateOpt = {};
        $scope.dateOnChange = function (event) {
            console.log(event);
        }


    }

    function DemoDialogController($scope) {

        $scope.title = '这是标题';
        $scope.input = '';

        $scope.save = function () {
            $scope.$close($scope.input)
        };

        $scope.cancel = function () {
            $scope.$close($scope.input)
        };
    }

    function DemoUploadController($scope) {
        //上传组件

        $scope.partialDownloadLink = 'http://localhost:8080/download?filename=';
        $scope.filename = '';

        $scope.fileType = typeof $scope.file;
        $scope.uploadFile = function () {
            $scope.processDropzone();
        };

        $scope.reset = function () {
            $scope.resetDropzone();
        };

        $scope.cancel = function () {
            var str = '';
            angular.forEach($scope.files, function (item, value) {
                str += item.name;
            });
            $scope.$close(angular.copy(str))
        }
    }

    function DemoGridController($scope) {

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


    }

    angular.module('demo', [])
        .controller('DemoController', DemoController)
        .controller('DemoDialogController', DemoDialogController)
        .controller('DemoUploadController', DemoUploadController)
        .controller('DemoGridController', DemoGridController)
}(window.angular, window.jQuery));