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
            //endDate:'2017-09-09',
            //startDate:'2017-09-05'
        };

        return {
            restrict: 'AE',
            scope: {
                opt: '=',
                elem: '=?',
                onChange: '&?'
            },
            controller: function ($scope, $attrs) {

            },
            link: function (scope, ele, attr) {

                var opt;

                scope.$watch('opt', function () {
                    initDatePicker();
                    console.log(1);
                }, true);

                function initDatePicker() {
                    opt = angular.extend(defaultOpt, scope.opt);
                    $(ele).datepicker('destroy');
                    var a = $(ele).datepicker(opt);
                    $(ele).datepicker('update', scope.opt.defaultViewDate);
                    $(ele).datepicker().on('changeDate', changeDate);
                    scope.elem = ele;
                }

                function changeDate(e) {
                    if (scope.onChange() && typeof scope.onChange() == 'function') {
                        scope.onChange()(e);
                    }
                }
            }
        }
    }

    function gfDatePickerDirective() {
        var temp = '<div class="input-group date">' +
            '<input type="text" class="form-control  input-sm readonly-pointer"  ' +
            'ng-model="value" gf-date  opt="opt" elem="dateElem" on-change="onChange" readonly>' +
            '<div class="input-group-addon" ng-click="openDatePicker()">' +
            '<span class ="glyphicon glyphicon-th" ng-click="openDatePicker()"> </span> ' +
            '</div>' +
            '</div>';
        return {
            restrict: 'AE',
            template: temp,
            scope: {
                value: '=',
                opt: '=?',
                onChange: '=?',
                startDate: '=?',
                endDate: '=?',

            },
            controller: function ($scope, $attrs) {

                initOpt();
                $scope.openDatePicker = function () {
                    $($scope.dateElem).datepicker('show');
                };

                $scope.$watch(canChangeOpt, function () {
                })
                function initOpt() {
                    if (!$scope.opt) {
                        $scope.opt = {};
                    }

                    canChangeOpt();
                }

                function canChangeOpt() {
                    if ($scope.startDate) {
                        $scope.opt.startDate = $scope.startDate;
                    }
                    if ($scope.endDate) {
                        $scope.opt.endDate = $scope.endDate;
                    }
                    if ($scope.value) {
                        $scope.opt.defaultViewDate = $scope.value;
                    }
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