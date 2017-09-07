/**
 * Created by 仇鹏骅 on 2017/9/5.
 */
(function (angular) {

    function DemoController($scope) {


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

    angular.module('demo', [])
        .controller('DemoController', DemoController)
}(window.angular, window.jQuery));