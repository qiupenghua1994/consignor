/**
 * Created by 仇鹏骅 on 2017/9/7.
 */

(function (angular, $) {

    function gfUploadDirective() {

        return function (scope, element, attrs) {

            var config = {
                url: 'http://localhost:8080/upload',
                autoProcessQueue: false,//自动上传
                maxFiles: 10,
                maxFilesize: 512,
                //maxFilesize: 100,
                //paramName: "uploadfile",
                //maxThumbnailFilesize: 10,
                //
                //parallelUploads: 2,

                dictResponseError: '服务器未响应：{{statusCode}}',
                //uploadMultiple:true,
                //parallelUploads:3,
                //maxFiles:3,
                //acceptedFiles:'.png,.txt'
            };

            var eventHandlers = {
                'addedfile': function (file) {
                    scope.file = file;
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function () {
                        scope.fileAdded = true;
                    });
                },

                'success': function (file, response) {
                }
            };

            dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function () {
                dropzone.processQueue();
            };

            scope.resetDropzone = function () {
                dropzone.removeAllFiles();
            }
        }
    }

    angular.module('myDirective')
        .directive('dropzone', gfUploadDirective)

}(window.angular, window.jQuery));