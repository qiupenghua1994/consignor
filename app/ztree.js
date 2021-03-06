/**
 * Created by 仇鹏骅 on 2017/9/4.
 */

(function (angular, $) {

    function gftreeInitDirective() {

        var treeId = 0;
        return {
            restrict: 'AE',
            scope: {
                opt: '=',
                obj: '=',
                value: '=',
                onChange: '&?'
            },
            controller: function ($scope, $element, $attrs, $conn, $q) {
                $scope.setting = initSetting();
                $scope.zNodesPromse = initNodes();


                function initSetting() {

                    var setting = {
                        callback: {
                            onClick: onClickCallBack,
                        }
                    };

                    function onClickCallBack(event, treeId, treeNode) {
                        setValue(treeNode);
                        if ($scope.onChange && $scope.onChange() && typeof $scope.onChange == 'function') {
                            $scope.onChange()(treeNode, treeId, event);
                        }
                    };
                    return setting;
                }

                function initNodes() {
                    var nodeDefer = $q.defer();
                    if ($scope.opt) {
                        var opt = $scope.opt;
                        if (opt.url) {
                            var q = $conn.bizGet(opt.url);
                            q.then(function (resp) {

                                var arr = getRoot(resp.data, 0, 'parentId', 'id');

                                function getRoot(data, val, parentName, idName) {
                                    var arr = [];
                                    for (var i in data) {
                                        if (data[i][parentName] === val) {
                                            arr.push(nodeData(data, data[i][idName], parentName, idName, data[i]));
                                        }
                                    }
                                    return arr;
                                }

                                function nodeData(data, val, parentName, idName, arr) {
                                    arr.children = [];
                                    for (var i in data) {
                                        if (data[i][parentName] == val) {
                                            var a = nodeData(data, data[i][idName], 'parentName', 'idName', data[i]);
                                            arr.children.push(a);
                                        }
                                    }
                                    if (!arr.children.length) {
                                        delete arr.children;
                                    }
                                    return arr;
                                }

                                nodeDefer.resolve(arr);
                            })
                        }
                    }
                    return nodeDefer.promise;
                }

                function setValue(treeNode) {
                    if (!treeNode) {
                        console.warn('树节点错误！');
                        return;
                    }
                    $scope.$apply(function () {
                        $scope.value = treeNode.id;
                        $scope.obj = treeNode;
                    });
                }
            },
            link: function (scope, ele, attr) {

                scope.zNodesPromse.then(function (zNodes) {
                    ele.siblings().attr('id', 'input_tree' + (treeId));
                    ele.attr('id', '_tree' + (treeId++));
                    var setting = scope.setting;
                    var zTreeObj = $.fn.zTree.init($(ele), setting, zNodes);
                })

            }
        }
    }

    function gftreeDirective() {

        var temp = '<ul gf-tree-init opt="opt" obj="obj" ng-model="value" class="ztree" ></ul>'


        return {
            restrict: 'A',
            template: temp,
            scope: {
                opt: '=',
                value: '=',
                obj: '=?',
                onChange: '&?'
            },
            controller: function () {

            },
            link: function () {

            }
        }
    }


    function gftreeInputDirective() {


        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）

        var temp = '<div style="position: relative">' +
            '<span class="down-button" ng-click="open($event)"></span>' +
            '<span class="clean-button"  ng-show="!opt.hideClean && value"  ng-click="clean($event)">&times</span>' +
            '<input placeholder="请选择" ng-model="obj.name" type="text" class="form-control input-sm readonly-pointer" ' +
            'ng-click="open($event)" readonly/>' +
            '<ul gf-tree-init opt="opt" value="value" obj="obj" on-change="onTreeChange" class="ztree" style="display: none"></ul></div>';


        function gfTreeInputController($scope, $attrs) {


            $scope.onTreeChange = function (treeNode, treeId, event) {
                closeTreeInput(treeId);
                if ($scope.onChange && $scope.onChange() && typeof $scope.onChange == 'function') {
                    $scope.onChange()(treeNode, treeId, event);
                }
            };

            $scope.treeIdNum = 0;

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
            $scope.clean = function (e) {
                $scope.obj = {};
                $scope.value = '';
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
        .directive('gfTreeInit', gftreeInitDirective)
        .directive('gfTree', gftreeDirective)
        .directive('gfTreeInput', gftreeInputDirective)

}(window.angular, window.jQuery));