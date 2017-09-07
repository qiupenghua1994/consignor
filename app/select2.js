/**
 * Created by qph on 2017/9/1.
 */
(function (angular, $) {

    function gfSelectDirective() {
        var defaultOpt = {
            placeholder: "点击查询",
            //minimumInputLength: 2,　//最小查询参数
            multiple: false,
            allowClear: true,//多选时请关闭清除
            //theme:'classic',
            theme: 'bootstrap',
            //minimumResultsForSearch: Infinity,//隐藏搜索框
            templateResult: function (item) {
                return item.text;//注意此处的name，要和ajax返回数组的键值一样
            }, // 选择结果中的显示
            escapeMarkup: function (m) {
                return m;
            },//字符转义处理
            templateSelection: function (item) {
                return item.text;//注意此处的name
            }, // 搜索列表中的显示
        };
        var ajax = {
            url: "../json/name.json",
            method: 'GET',
            dataType: 'json',
            delay: 1000,//延迟
            data: function (term, page) {
                return {
                    keyword: term,
                };
            },
            processResults: function (data, page) {
                return {
                    results: data.rows
                };
            }
        }

        function gfSelectController($scope, $attrs) {

        }

        function gfSelectLink(scope, elem, attr) {

            scope.opt = initOption(scope);

            $(elem).select2(scope.opt);

            initListenEvent(scope, elem);

            function initOption(vm) {
                if (!vm.opt) {
                    return defaultOpt;
                }
                var opt = vm.opt;

                if (opt.url) {
                    setAjax();
                }

                opt = angular.extend(defaultOpt, opt);
                function setAjax() {
                    ajax.url = opt.url;
                    opt.ajax = ajax;
                }

                return opt;
            }

            function initListenEvent(vm, elem) {
                $(elem).on('select2:select', function (evt) {
                    if (evt.params.data) {
                        vm.obj = evt.params.data;
                        vm.value = evt.params.data.id;
                        vm.$apply();
                        if (vm.onChange() && typeof vm.onChange == 'function') {
                            vm.onChange()(evt.params.data, evt)
                        }
                    }
                });
            }
        }

        return {
            restrict: 'AE',
            priority: '100',
            scope: {
                opt: '=',
                value: '=',
                obj: '=?',
                onChange: '&?',
            },
            controller: gfSelectController,
            link: gfSelectLink,
        }
    }

    function gfSelectSearchDirective() {
        var temp = '<div class="gf-select2 gf-select2-sm">' +
            '<select opt="opt" gf-select value="value" obj="obj" on-change="onChange" style="width: 100%;">' +
            '<option></option>' +
            '</select></div>';

        function gfSelectSearchLink(scope, elem, attr) {

        }

        return {
            restrict: 'AE',
            template: temp,
            priority: '101',
            scope: {
                opt: '=',
                value: '=',
                obj: '=?',
                onChange: '=?',
            },
            controller: function () {

            },
            link: gfSelectSearchLink,

        }

    }

    function gfSelectDictDirective() {
        var temp = '<div class="gf-select2 gf-select2-sm">' +
            '<select opt="opt" gf-select value="value" obj="obj" on-change="onChange" style="width: 100%;">' +
            '<option></option>' +
            '</select></div>';

        function gfSelectDictLink(scope, elem, attr) {
            if (scope.opt) {
                scope.opt.minimumResultsForSearch = false
            }

            if (scope.dict) {
                var htmlobj = $.ajax({url: "../json/name.json", async: false});
                var data = htmlobj.responseJSON;
                //scope.opt.url=null;
                scope.opt.data = data.rows;
            }
        }

        function gfSelectDickController($scope, $element, $attrs) {
            if ($scope.opt) {
                $scope.opt.minimumResultsForSearch = Infinity
            }

            if ($scope.dict) {
                var htmlobj = $.ajax({url: "../json/name.json", async: false});
                var data = htmlobj.responseJSON;
                //
                $scope.opt.url = null;
                $scope.opt.data = data.rows;
            }
        }

        return {
            restrict: 'AE',
            template: temp,
            priority: '101',
            scope: {
                opt: '=',
                value: '=',
                obj: '=?',
                dict: '@',//字典名字
                onChange: '=?',
            },
            controller: gfSelectDickController,
            link: gfSelectDictLink,

        }

    }



    angular.module('myDirective')
        .directive('gfSelect', gfSelectDirective)
        .directive('gfSelectSearch', gfSelectSearchDirective)
        .directive('gfSelectDict', gfSelectDictDirective)

}(window.angular, window.jQuery));