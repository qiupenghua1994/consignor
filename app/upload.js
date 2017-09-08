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
                addRemoveLinks: true,//显示删除按钮
                maxFilesize: 512,
                //maxFilesize: 100,
                //paramName: "uploadfile",
                //maxThumbnailFilesize: 10,
                //parallelUploads:3,
                //maxFiles:3,
                //acceptedFiles:'.png,.txt'
                //parallelUploads: 2,

                dictResponseError: '服务器未响应：{{statusCode}}',
                dictRemoveFile: '删除',
                dictDefaultMessage: "Drop files here to upload",
                dictFallbackMessage: "浏览器不支持.",
                dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
                dictFileTooBig: "文件太大 ({{filesize}}MiB). 最大值: {{maxFilesize}}MiB.",
                dictInvalidFileType: "你不能上传此类型文件.",
                dictCancelUpload: "取消上传",
                dictCancelUploadConfirmation: "确定取消上传?",
                dictRemoveFileConfirmation: null,
                dictMaxFilesExceeded: "上传文件数量超出最大值.",
                uploadMultiple: true,

            };

            var eventHandlers = {
                'addedfile': function (file) {
                    console.log(file);
                    scope.file = file;
                    if (this.files[1] != null) {
                        //this.removeFile(this.files[0]);
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