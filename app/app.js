/**
 * Created by SEELE on 2016/11/20.
 */


(function (angular,$) {

    window.agGrid.initialiseAgGridWithAngular1(angular);

    var app = angular.module('app',
        [
            'ngCookies'
            ,'ui.router'
            ,'ui.bootstrap'
            , 'manage'
            , 'person'
            , 'demo'
            , 'oc.lazyLoad'
            ,'agGrid'
            ,'myDirective'
            ,'myFactory'
            ,'filter'
            ,'ngFileUpload'

        ]);

    angular.module('manage', []);
    angular.module('person', []);


    var loadPromise;
    var lazyLoadFiles=[
        'controller/PerInfoCtrl.js',
        'manage/User/Controller/UserCtrl.js',
    ];


    //扩展api,
    function extendAngularApi(){
        //用于指令中原生方法的脏检查,判断是否需要用脏检查方法
        angular.$apply = function (scope,fn) {
            if(scope.$root.$$phase){
                if(fn){
                    fn();
                }
            }else{
                scope.$apply(fn);
            }
        };

        var injector = angular.injector(['ng']);
        var $timeout = injector.get('$timeout');
        injector = null;

        angular.getAttrVal = getAttrVal;
        function getAttrVal($attrs,name,defaultVal,defaultVal2){
            var val = $attrs[name];
            return angular.isDefined(val)?val:(angular.isDefined(defaultVal)?defaultVal:defaultVal2);
        }

        angular.getIntAttr = getIntAttr;
        function getIntAttr($attrs,name,defaultVal,defaultVal2){
            return parseInt(getAttrVal($attrs,name,defaultVal,defaultVal2));
        }

        angular.getBoolAttr = getBoolAttr;
        function getBoolAttr($attrs,name,defaultVal,defaultVal2){
            var val = getAttrVal($attrs,name,defaultVal,defaultVal2);
            return val != 0 && val!= 'false';
        }


        function unbindElemEvents(elem){
            elem.unbind();
            elem.children().each(function (i,subElem) {
                unbindElemEvents($(subElem));
            })
        }
        angular.$unbind = unbindElemEvents;

        function initElementCache(){
            function ElementCache(scope){
                this.elements={};
                var self = this;
                scope.$on('$destory', function () {
                    self.clear();
                    self.elements=null;
                    self = null;
                });
                scope = null;
            }

            ElementCache.prototype.getElem = function (key) {
                return this.elements(key);
            };

            ElementCache.prototype.addElem= function (key,elem) {
                var existsElem = this.elements[key];
                if(existsElem){
                    unbindElemEvents(existsElem);
                    delete this.elements[key];
                }
                this.elements[key]=elem;
            };

            ElementCache.prototype.createElem = function (key,html) {
                var elem = angular.element(html);
                this.addElem(key,elem);
                return elem;
            };

            ElementCache.prototype.clear = function () {
                angular.forEach(this.elements, function (elem) {
                    unbindElemEvents(elem);
                });
                this.elements={};
            };

            angular.$createElementCache = function (scope) {
                return new ElementCache(scope);
            };

            window.onbeforeunload= function () {
                console.log('unload');
                var vm = App.globals.$rootScope;
                if(!vm){
                    return;
                }
                if(vm.$elemCache){
                    vm.$elemCache.clear();
                    vm.$elemCache.null;

                }
            }
        }
        initElementCache();
    }
    /**
     * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
     * 这里的run方法只会在angular启动的时候运行一次。
     * @param  {[type]} $rootScope
     * @param  {[type]} $state
     * @param  {[type]} $stateParams
     * @return {[type]}
     */
    app.run(runInit);
    runInit.$inject= ['$cookies','$rootScope','$state','$stateParams','$uibModal','$uibModalStack','$ocLazyLoad','$conn','$q'];
    function runInit($cookies,$rootScope,$state,$stateParams,$uibModal,$uibModalStack,$ocLazyLoad,$conn,$q) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        function initGlobals(){
            var globals = App.globals;
            globals.$uibModal = $uibModal;
            globals.$uibModalStack = $uibModalStack;
            globals.$start = $state;
            globals.$ocLazyLoad = $ocLazyLoad;
            globals.$q = $q;
        }
        initGlobals();
        extendAngularApi();

        App.login = function () {
            $rootScope.$emit('login');
        };
        App.isLogin = function () {
            if($rootScope.user) {
                if(!$rootScope.user.account){
                    App.notify('请先登录');
                    return false;
                }
            }else{
                App.notify('请先登录');
                return false
            }
            return true;
        };

        //loadPromise = App.utils.lazyLoad({
        //    isLoaded:App.utils.isControllerLoaded('PerInfoActivityCtrl'),
        //    files:lazyLoadFiles
        //});

        if(getCookie('user')){
            $rootScope.user = getCookie('user')
        }else{
            // window.location.href = "/login.html";
        }


        //用于验证刷新回话是否过期
        if(top.location.hash != '#/login'){
            //  loadPromise.then(loadSession);
        }

        function loadSession(){
            console.info("loadSession");
            var p = $conn.biz("getSession");//获取session
            p.then(function(resp){
                try{
                    if(resp && resp.user){
                        $rootScope.user = resp.user;
                        $rootScope.$emit('login',resp.user);
                    }else{
                       //App.goLogin();//登录跳转
                    }
                }catch(e){
                    console.error("load seeesion error"+e);
                    onLoadError();
                }
            },onLoadError);
            return p;
        }

        function onLoadError(){
            //错误处理
        }
        //获取cookie
        function getCookie(name) {
            var user = $cookies.getObject(name);
            if (!user) {
                return;
            }
            return user;
        };

    }

    app.config(function ($stateProvider,$urlRouterProvider,$controllerProvider) {

        App.globals.controllerProvider = $controllerProvider;

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('/',{
            url:'/',
            templateUrl: 'manage/home/view/home.html',
            controller: 'HomeController',
        })
            .state('entering_one',{
                url:'/entering_one',
                templateUrl:'manage/entering/view/main.html',
                controller:'EnteringController'
            })
            .state('entering_tail',{
                url:'/entering_tail',
                templateUrl:'manage/entering/view/tail.html',
                controller:'EnteringController'
            })
            .state('interior_term', {
                url: '/interior_term',
                templateUrl: 'manage/authorize/view/term.html',
                controller: 'AuthorizeController'
            })
            .state('project_list', {
                url: '/project_list',
                templateUrl: 'manage/project/view/main.html',
                controller: 'AccountDetailController'
            })
            .state('account_query', {
                url: '/account_query',
                templateUrl: 'manage/account/view/main.html',
                controller: 'AccountController'
            })
            .state('account_query.detail', {
                url: '/',
                templateUrl: 'manage/account/view/detail.html',
                controller: 'AccountDetailController'
            })
            .state('account_query.balance', {
                url: '/',
                templateUrl: 'manage/account/view/balance.html',
                controller: 'AccountBalanceController'
            })
            .state('demo', {
                url: '/demo',
                templateUrl: 'demo/view/demo.html',
                controller: 'DemoController'
            })
            .state('demoGrid', {
                url: '/demoGrid',
                templateUrl: 'demo/view/grid.html',
                controller: 'DemoGridController'
            })
    })


}(window.angular,window.jQuery));


//var data = JSON.parse($stateParams.args); //字符转对象
//var ste=JSON.stringify(data)  //转成string
//$state.go('exam', {args: ste});//发起路由请求
//
//params:{args:null},
//resolve:{
//    args: ['$stateParams', function($stateParams){
//        var data = JSON.parse($stateParams.args); //字符转对象
//        return {name :data};
//    }]
//}



