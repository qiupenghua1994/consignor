/**
 * Created by qph on 2017/9/1.
 */
(function (angular, $) {

    function gfQueryListDirective() {
        var defaultOpt = {
            placeholder: "�����ѯ",
            //minimumInputLength: 2,��//��С��ѯ����
            multiple: false,
            allowClear: false,
            //theme:'classic',
            theme: 'bootstrap',
            templateResult: function (item) {
                return item.test;//ע��˴���name��Ҫ��ajax��������ļ�ֵһ��
            }, // ѡ�����е���ʾ
            escapeMarkup: function (m) {
                return m;
            },//�ַ�ת�崦��
            templateSelection: function (item) {
                return item.test;//ע��˴���name
            }, // �����б��е���ʾ
        };
        var ajax = {
            url: "json/name.json",
            method: 'GET',
            dataType: 'json',
            delay: 1000,//�ӳ�
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