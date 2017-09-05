/**
 * Created by SEELE on 2017/1/8.
 * 指令集合
 */
(function (angular,$) {


    var dlgHeader = '<div class="modal-header">' +
        '<button type="button" class="close" ng-click="$dismiss()" aria-label="关闭"><span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-title" ng-bind="title"></h4>' +
        '</div>';
    var dlgFooter = '<div class="modal-footer">' +
        '        <button gf-button-save ng-show="$saveButton" type="button" class="btn btn-primary" ng-disabled="$form.$invalid ||$errorForm">' +
        '        <span ng-bind="$saveButton"></span>' +
        '        </button>' +
        '        <button gf-button-close ng-show="$cancelButton" type="button" class="btn btn-default">' +
        '        <span ng-bind="$cancelButton"></span>' +
        '        </button>' +
        '        </div>';
    gfFormDialogDirective.$inject = ['$compile','$templateRequest']
    function gfFormDialogDirective($compile,$templateRequest){
        return {
            restrict:'A',
            require:'?form',
            link:function(scope,elem,attrs,formController){
                elem.addClass('modal-body row');
                var eleHeader = attrs.eleHeader;

                if(eleHeader=='false'){
                    return
                }else{
                    eleHeader =angular.element(dlgHeader);
                    elem.before(eleHeader);

                    $compile(eleHeader)(scope);
                }


                var $dismiss = scope.$dismiss;
                scope.$dismiss = function (args) {
                    if(scope.cancel){
                        scope.cancel(args);
                    }else{
                        $dismiss(args);
                    }
                };

                if(angular.isUndefined(attrs.dlgFooter)||attrs.dlgFooter!='false'){
                    var saveButton = '保存';
                    var cancelButton = '取消';
                    if(angular.isDefined(attrs.saveButton)){
                        saveButton = attrs.saveButton;
                    }
                    if(angular.isDefined(attrs.cancelButton)){
                        cancelButton = attrs.cancelButton;
                    }

                    scope.$saveButton = saveButton === 'false'?'':saveButton;
                    scope.$cancelButton = cancelButton === 'false'?'':cancelButton;

                    var footerTemplateUrl = attrs.footerTemplateUrl;
                    if(footerTemplateUrl){
                        if(footerTemplateUrl=='false'){
                            return;
                        }
                        //使用自定义模版
                        $templateRequest(footerTemplateUrl,true).then(function(response){
                            if(scope.$$destroyed)return;
                            var eleFooter =angular.element(response);
                            elem.after(eleFooter);
                            $compile(eleFooter)(scope);
                        });
                    } else{
                        //使用默认模版
                        var eleFooter = angular.element(dlgFooter);
                        elem.after(eleFooter);
                        $compile(eleFooter)(scope);
                    }
                }

                if(formController){
                    scope.$form = formController;
                }

            },

        };
    }

    /**
     * 图标按钮指令封装
     * @param name
     * @param defaultFn
     * @param iconCls
     */
    function gfIconButtonDirectiveFactory(name,defaultFn,iconCls){
        return ['$parse',function($parse){
            var buttonDirective = {
                restrict:'A',
                link:function(scope,elem,attrs){
                    elem.addClass('gf-button');
                    var el = angular.element('<i class="'+iconCls+'"></i>');
                    elem.prepend(el);
                    if(attrs.ngClick){
                        return;
                    }

                    var fnExpr = attrs[name];
                    var fnOnClick = fnExpr? $parse[fnExpr]:scope[defaultFn];
                    if(!fnOnClick){
                        return;
                    }

                    elem.bind('click',function(evt){
                        if(elem.disabled){
                            return;
                        }
                        angular.$apply(scope,fnOnClick);
                    });
                }
            };
            return buttonDirective;
        }]
    }
//柱形图
    function eChartsDirective() {
        return{
            restrict:'AE',
            scope :{
                option:'='
            },
            template:'<div>这是柱图</div>',
            controller: function($scope){
            },
            link:function(scope,element,attr){

                scope.$watch('option', function () {
                    var chart =  element.find('div')[0];
                    var parent = element['context'];
                    //    console.log(parent.clientHeight+":"+parent.clientWidth);
                    chart.style.width =parent.clientWidth+'px';
                    chart.style.height =parent.clientHeight+'px';

                    var myChart = echarts.init(chart);

                    myChart.setOption(scope.option);
                    myChart.resize();
                },true)
            }
        };
    }

    /**
     *加载页签页面
     * @param $controller
     * @param $compile
     * @param $templateRequest
     * @param $q
     * @returns {{restrict: string, scope: {gfIncludeView: string, pageArgs: string, lazyLoad: string}, compile: Function}}
     */
    function gfIncludeViewDirective($controller,$compile,$templateRequest,$q){
        function loadController(page,scope,$element,$attr){
            var pageArgs = scope.pageArgs;
            var deferred = $q.defer();
            scope.$page = page;

            var q = App.utils.loadController(page.controller,page.depd);
            q.then(function () {
                var locals = {
                    $scope:scope,
                    $element:$element,
                    $attrs:$attrs,
                    args:pageArgs
                };

                var controller = $controller(page.controller,locals,false);
                if(angular.isFunction(controller.onLoadPage)){
                    controller.onLoadPage(page);
                }
                deferred.resolve(controller);
            });
            return deferred.promise;
        }

        function loadTemplate(templateUrl,scope,$element){
            var deferred = $q.defer();
            $templateRequest(templateUrl,true).then(function (html) {
                if(scope.$$destroyed) return;
                $element.html(html);
                $compile($element.contents())(scope);
                deferred.resolve();
            });
            return deferred.promise;
        }

        function compileIncludeView(scope,$element,$attr){
            var page = scope.gfIncludeView;
            if(!page.templateUrl){
                return;
            }
            $element.addClass('gf-include-view');
            var loaded = false;
            function doLoad(){
                if(page.controller){
                    loadController(page,scope,$element,$attr).then(function (controller){
                        loadTemplate(page.templateUrl,scope,$element).then(function () {
                            $element.data('$ngControllerController',controller);
                            $element.children().data('$ngControllerController',controller);
                        });
                    });
                }else{
                    loadTemplate(page.templateUrl,scope,$element);
                }
                loaded = true;
            }

            if(angular.isDefined(scope.lazyLoad)){
                var loadWatch = scope.$watch('lazyLoad', function (newView) {
                    if(scope.lazyLoad && !loaded){
                        doLoad();
                        //取消watch
                        loadWatch();
                    }
                });
            }else{
                doLoad();
            }

            scope.$on('$destroy', function () {
                $element.remove();
                $element = null;
            });
        }

        return {
            restrict:'A',
            scope:{
                'gfIncludeView':'<',
                'pageArgs':'<',
                'lazyLoad':'<'
            },
            compile: function (element,attr) {
                return compileIncludeView;
            }
        }
    }

    function gfBtnGroupDirective() {

        // track by $index 为了repeat 不出现 $$hashkey
        var btnTemp = '<button ng-repeat="item in data track by $index" ng-click="changeBtn($index)" type="button" class="btn btn-default" ng-class="{\'active\':dataFlag[$index]}">{{item.text}}</button>';


        return {
            restrict: 'AE',
            scope: {
                data: '=',//data = [{id:1,name:}]
                value: '=?',
                obj: '=?',
                multiple: '=?', //多选 boolean
            },
            template: btnTemp,
            controller: function ($scope) {
            },
            link: function (scope, element, attr) {
                element.addClass('btn-group');

                scope.dataFlag = [];
                initFlag();

                scope.changeBtn = function (index) {

                    var a = scope.dataFlag[index];
                    if (scope.multiple) {
                        scope.dataFlag[index] = !a;
                        scope.value = '';
                        scope.obj = [];
                        for (var i in scope.data) {
                            if (scope.dataFlag[i]) {
                                scope.value += scope.data[i].id + ',';
                                scope.obj.push(scope.data[i]);
                            }
                        }
                    } else {
                        initFlag();
                        scope.dataFlag[index] = !a;
                        scope.value = a != 0 ? '' : scope.data[index].id;
                        scope.obj = a != 0 ? [] : scope.data[index];
                    }
                }

                function initFlag() {
                    for (var i in scope.data) {
                        scope.dataFlag[i] = 0;
                    }
                }
            }
        }
    }


    angular.module('myDirective',[])
        .directive('gfFormDialog',gfFormDialogDirective)
        .directive('gfButtonSave',gfIconButtonDirectiveFactory('gfButtonSave','save','fa fa-check'))
        .directive('gfButtonClose',gfIconButtonDirectiveFactory('gfButtonClose','$dismiss','fa fa-close'))
        .directive('eCharts',eChartsDirective)
        .directive('gfInciudeView',gfIncludeViewDirective)
        .directive('gfBtnGroup', gfBtnGroupDirective)

})(window.angular,window.JQuery)