/**
 * Created by 仇鹏骅 on 2017/9/4.
 */

(function (angular, $) {

    function gfDateDirective() {
        $.fn.datepicker.dates.zh = {
            days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysShort: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin: ["一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            clear: "清除",
            format: "yyyy-mm-dd",
            titleFormat: "yyyy MM", /* Leverages same syntax as 'format' */
            weekStart: 0
        };
        var defaultOpt = {
            language: 'zh',
            format: 'yyyy-mm-dd',
            autoclose: true,
            //clearBtn:true,
            //todayBtn:true,
            todayHighlight: true,
        };

        return {
            restrict: 'AE',
            scope: {
                opt: '=',

            },
            controller: function ($scope, $attrs) {
                var vm = $scope;


                vm.opt = angular.extend(defaultOpt, vm.opt);
            },
            link: function (scope, ele, attr) {
                var a = $(ele).datepicker(scope.opt);
                debugger
            }
        }
    }

    function gfDatePickerDirective() {
        var temp = '<div class="input-group data">' +
            '<input class="form-control  input-sm"  ng-model="value" gf-date  opt="opt">' +
            '<div class="input-group-addon">' +
            '<span class="glyphicon glyphicon-th"></span> ' +
            '</div>' +
            '</div>';
        return {
            restrict: 'AE',
            template: temp,
            scope: {
                value: '=',
                opt: '=',
            },
            controller: function ($scope, $attrs) {
                if ($scope.value) {
                    $scope.opt.defaultViewDate = $scope.value;
                }
            },
            link: function (scope, ele, attr) {
            }
        }
    }

    angular.module('myDirective')
        .directive('gfDate', gfDateDirective)
        .directive('gfDatePicker', gfDatePickerDirective)

}(window.angular, window.jQuery));