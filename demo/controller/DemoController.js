/**
 * Created by 仇鹏骅 on 2017/9/5.
 */
(function (angular) {

    function DemoController($scope) {

        //下拉列表
        $scope.selectOpt = {
            placeholder: '输入项目名称或项目对应帐号关键字进行查询'
        };
        //单选按钮
        $scope.directionList = [
            {id: 1, name: '收入'},
            {id: 2, name: '支出'},
            {id: 3, name: '全部'},
        ];

        //date-picker
        $scope.datePicker = '2017-05-05';
        $scope.dateOpt = {};

    }

    angular.module('demo', [])
        .controller('DemoController', DemoController)
}(window.angular));