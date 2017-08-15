/**
 * Created by SEELE on 2017/8/7.
 */
(function (angular) {

    var app = angular.module('login',
        [
            'ngCookies'
            , 'ui.router'
            , 'ui.bootstrap'
            , 'myFactory'
        ]);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('login');
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'login/view/login.html',
            controller: 'LoginController'
        }).state('regist', {
            url: '/regist',
            templateUrl: 'login/view/regist.html',
            controller: 'LoginController'
        })
    });

    function LoginController($scope, $cookies, $conn) {

        $scope.user = {
            account:'',
            pwd:''
        };
        $scope.loginBtn = function () {
            setCookie('user', {name: '管理', age: 13});
            //login($scope.user);
            toIndex()
        };
        $scope.registBtn = function () {
            setCookie('user', {name: '管理', age: 13});
            //login($scope.user);
            toIndex()
        };
        function login(user) {
            var q = $conn.biz('login', user);
            q.then(function (resp) {
                setCookie('user', resp);
            });
        }
        //设置cookie
        function setCookie(name, value) {
            if (value) {
                $cookies.putObject(name, value, {expires: new Date(new Date().getTime() + 5000000)});
                //$cookies.putObject(name,value);
            } else {
                $cookies.putObject(name, value, {expires: new Date(new Date().getTime() + 5000000)});
            }
        };
        //获取cookie
        function getCookie() {
            var user = $cookies.getObject("user");
            if (!user) {
                return;
            }
            if (user.account) {
                $scope.user = user;
                $scope.loginClick();
            }
        };
        //跳到首页
        function toIndex(){
            window.location.href = "/index.html";
        }
    }



    angular.module('login')
        .controller('LoginController', LoginController)
}(window.angular));