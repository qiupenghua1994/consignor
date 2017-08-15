/**
 * Created by SEELE on 2017/8/6.
 */
(function (angular,$) {

    var app = angular.module('login',
        [
            'ngCookies'
            ,'ui.router'
            ,'ui.bootstrap'
        ]);
    app.config(function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('login');
        $stateProvider.state('login', {
            url:'/login',
            templateUrl: 'module/login/view/login.html',
            controller: 'LoginController'
        }).state('regist', {
            url:'/regist',
            templateUrl: 'module/login/view/regist.html',
            controller: 'LoginController'
        })
    })
}(window.angular,window.jQuery));

