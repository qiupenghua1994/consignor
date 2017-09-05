/**
 * Created by 仇鹏骅 on 2017/9/5.
 */
(function (angular) {

    function DemoController($scope) {

        //下拉列表
        $scope.selectOpt = {
            url: '../json/name.json',
            placeholder: '输或项目对应帐号关键字进行查询'
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

        //date-picker
        $scope.datePicker = '2017-05-05';
        $scope.dateOpt = {};

    }

    angular.module('demo', [])
        .controller('DemoController', DemoController)
}(window.angular));