/**
 * Created by qph on 2017/9/1.
 */
(function (angular, $) {

    function gfQueryListDirective() {
        var defaultOpt = {
            placeholder: "点击查询",
            //minimumInputLength: 2,　//最小查询参数
            multiple: false,
            allowClear: false,
            //theme:'classic',
            theme: 'bootstrap',
            templateResult: function (item) {
                return item.test;//注意此处的name，要和ajax返回数组的键值一样
            }, // 选择结果中的显示
            escapeMarkup: function (m) {
                return m;
            },//字符转义处理
            templateSelection: function (item) {
                return item.test;//注意此处的name
            }, // 搜索列表中的显示
        };
        var ajax = {
            url: "json/name.json",
            method: 'GET',
            dataType: 'json',
            delay: 1000,//延迟
            data: function (term, page) {
                return {
                    keyword: term,
                };
            },

            processResults: function (data, page) {
                console.log(data);
                return {
                    results: data.rows
                };
            }
        }

        return {
            restrict: 'AE',
            scope: {
                opt: '=',
            },
            controller: function ($scope, $attrs) {
                var vm = $scope;
                if (!vm.opt) {
                    return;
                }
                var opt = vm.opt;
                if (opt.url) {
                    ajax.url = opt.url;
                    opt.ajax = ajax;
                }
                vm.opt = angular.extend(defaultOpt, opt);
            },
            link: function (scope, ele, attr) {
                $(ele).select2(scope.opt);


            }
        }
    }

    angular.module('myDirective')
        .directive('gfSelect', gfQueryListDirective)

}(window.angular, window.jQuery));