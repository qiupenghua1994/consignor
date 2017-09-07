/**
 * Created by 仇鹏骅 on 2017/9/4.
 */

(function (angular, $) {

    function gftreeDirective() {

        var treeId = 0;
        return {
            restrict: 'AE',
            scope: {
                opt: '=',
                value: '=',
            },
            controller: function ($scope, $attrs) {

            },
            link: function (scope, ele, attr) {
                ele.siblings().attr('id', 'input_tree' + (treeId));
                ele.attr('id', '_tree' + (treeId++));
                var setting = scope.opt.setting;
                var zNodes = scope.opt.zNodes;
                var zTreeObj = $.fn.zTree.init($(ele), setting, zNodes);
            }
        }
    }


    function gftreeInputDirective() {


        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes = [
            {
                name: "test1", id: 1, open: true, children: [
                {name: "test1_1", id: 2}, {
                    name: "test1_2", id: 3, children: [
                        {name: "test1_1", id: 4}, {name: "test1_2", id: 5}]
                }]
            },
            {
                name: "test2", id: 6, open: true, children: [
                {name: "test2_1", id: 7}, {name: "test2_2", id: 8}]
            }
        ];


        var temp = '<div style="position: relative"><p class="down-button" ng-click="open($event)"></p><input placeholder="请选择" ng-model="showText" type="text" class="form-control input-sm readonly-pointer" ' +
            'ng-click="open($event)" readonly/>' +
            '<ul gf-tree opt="opt" value="value" class="ztree" style="display: none"></ul></div>';


        function gfTreeInputController($scope, $attrs) {

            var setting = initSetting();


            $scope.treeIdNum = 0;
            $scope.opt = {
                setting: setting,
                zNodes: zNodes,
            };
            $scope.open = function (e) {
                var ele = angular.element(e.target);
                var idNum = e.target.id.match(/_tree\d+/i);
                idNum = idNum ? idNum.toString() : null;
                var parent = ele.parent();
                var flag = parent.children('ul').css('display') == 'none';
                if (flag) {
                    parent.children('ul').slideDown("fast");
                    $("body").bind("mousedown", onBodyDown(idNum));
                    var spanId = 'p[id=\'input' + idNum + '\'] ';
                    $(spanId).css('border-color', ' transparent transparent #999999 transparent ');
                    $(spanId).css('top', '9px');
                    reSize(parent);
                } else {
                    parent.children('ul').fadeOut("fast");
                    var spanId = 'p[id=\'input' + idNum + '\'] ';
                    $(spanId).css('border-color', ' #999999 transparent transparent  transparent ');
                    $(spanId).css('top', '13px');
                    $("body").unbind("mousedown", onBodyDown(idNum));
                }
            };

            function reSize(elem) {
                var width = elem.children('input').css('width');
                elem.children('ul').css('width', width);
            }

            //当打开input时初始化焦点事件
            function onBodyDown(idNum) {
                return function (e) {
                    var bindNum = e.target.id.match(/_tree\d+/i);
                    bindNum = bindNum ? bindNum.toString() : null;
                    if (bindNum != idNum) {
                        closeTreeInput(idNum)
                    }
                }
            }

            function closeTreeInput(treeId) {
                $('#' + treeId).fadeOut("fast");
                var spanId = 'p[id=\'input' + treeId + '\'] ';
                $(spanId).css('border-color', ' #999999 transparent transparent transparent');
                $(spanId).css('top', '13px');
                $("body").unbind("mousedown", onBodyDown(treeId));
            }

            function setValue(treeNode) {
                if (!treeNode) {
                    console.warn('树节点错误！');
                    return;
                }
                $scope.$apply(function () {
                    $scope.value = treeNode.id;
                    $scope.showText = treeNode.name;
                    $scope.obj = treeNode;
                });
            }

            function initSetting() {
                var setting = {
                    callback: {
                        onClick: onClickCallBack,
                    }
                };

                function onClickCallBack(event, treeId, treeNode) {
                    setValue(treeNode);
                    closeTreeInput(treeId);
                    if ($scope.onChange() && typeof $scope.onChange == 'function') {
                        $scope.onChange()(treeNode, treeId, event);
                    }
                };



                return setting;
            }
        }


        return {
            restrict: 'AE',
            template: temp,
            scope: {
                opt: '=?',
                value: '=',
                obj: '=?',
                onChange: '&?'
            },
            controller: gfTreeInputController,
            link: function (scope, ele, attr) {

            }
        }


    }


    angular.module('myDirective')
        .directive('gfTree', gftreeDirective)
        .directive('gfTreeInput', gftreeInputDirective)

}(window.angular, window.jQuery));