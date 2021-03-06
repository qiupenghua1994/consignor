/**
 * Created by SEELE on 2017/1/8.
 * 公共方法
 */
var App = function ($,angular,window) {


    var user = 111;
    var isLogin = null;
    var debug = false;
    var notification = null;//提示框

    var globals = {
        controllerProvider:null,
        $q:null,
        $uibModal:null,
        $modalStack:null,
        $start:null,
        $rootScope:null,
        $ocLazyLoad:null,
        $q:null,
    };


    function setuser(aa) {
        user = copy(aa);
    }

    //打开路由页面
    function router(urlName,args) {
        globals.$start.go(urlName,{args:args});
    }


    var dialog = function () {


        //对话框默认参数
        var defaultDialogOptions = {size:'md',keyboard:true,backdrop:'static'};

        function showModal(templateUrl,controller,args,options) {
            if(null === globals.$uibModal) {
                return;
            }
            var dlg={
                templateUrl:templateUrl,
                controller:controller
            };

            dlg = angular.extend({},defaultDialogOptions,options,dlg);

            return showModalDialog(dlg,args);
        }

        function showModalDialog(dlg,args){
            if(null===globals.$uibModal){
                return;
            }
            dlg = angular.extend({},defaultDialogOptions,dlg);
            if(args){
                if(angular.isArray(args)){
                    dlg.resolve = {
                        'args':function(){
                            return args;
                        }
                    }
                }else{
                    dlg.resolve = {'args':args};
                }
            }
            return globals.$uibModal.open(dlg);
        }


        return {
            showModal:showModal,
            showModalDialog:showModalDialog
        }
    }();

    function showDialog(templateUrl,controller,args,options){
        var dlg = dialog.showModal(templateUrl,controller,args,options);
        return dlg?dlg.result:null;
    }
    //提示框
    function notify(str){


        if(notification != null){
            notification.dismiss();
        }
        notification = new NotificationFx({
            message : '<p>'+str+'</p>',
            layout : 'growl',
            effect : 'slide',
            type : 'notice', // notice, warning, error or success
            onClose : function() {

            }
        });

        notification.show();

    }

    var utils= function () {


        var defaultLoadOption = {
            isLoaded:false,
            cache:!debug,
            insertBefore:'#ng_load_plugins_before',
            files:[]
        };

        /**
         * 动态加载js或css文件
         * @param opts
         * @returns {d.promise|Function|*|promise}
         */
        function lazyLoad(opts){
            var deferred = globals.$q.defer();

            if(!globals.$ocLazyLoad){
                deferred.reject();
                return deferred.promise;
            }
            opts = angular.extend({},defaultLoadOption,opts);

            var loaded = opts.isLoaded;
            if(typeof loaded === 'function'){
                loaded = loaded(opts);
            }
            if(loaded){
                deferred.resolve();
                return deferred.promise;
            }
            return globals.$ocLazyLoad.load(opts);
        }

        /**
         * 判断是否已加载了指定的Controller
         * @param controllerName
         * @returns {*}
         */
        function isControllerLoaded(controllerName){
            return globals.controllerProvider.has(controllerName);
        }

        /**
         * 动态加载Controller
         * @param controllerName
         * @param files
         * @returns {d.promise|Function|*|promise}
         */
        function loadController(controllerName,files){
            return lazyLoad({
                isLoaded:isControllerLoaded(controllerName),
                files:files
            })
        }


        function clearFormDate($form){
            for(var name in $form){
                var m = $form[name];
                if(m && m.hasOwnProperty('$viewValue')){
                    m.$setViewValue('');
                    m.$render();
                }
            }
            $form.$setPristine();
        }

        return {
            clearFormDate:clearFormDate,
            lazyLoad:lazyLoad,
            loadController:loadController,
            isControllerLoaded:isControllerLoaded

        }
    }();









    return{
        user:user,
        isLogin:isLogin,
        globals:globals,
        showDialog:showDialog,
        router:router,
        notify:notify,
        utils:utils,

    }

}(window.jQuery,window.angular,window);
