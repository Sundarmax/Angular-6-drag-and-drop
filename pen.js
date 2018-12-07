
(function() {
    var guid = 1;

    var app = angular.module('DragDropApp', ['ui.sortable']);

    app.controller('DragDropCtrl', function($scope) {
        $scope.dragElements = [{
            'Name': "Add Main Topic",
            'Type': "text"
        },
        {
            'Name': "Add Sub Topic",
            'Type': "text"
        }, 
        {
            'Name': "Add New Qn ",
            "Type": "textarea"
        },
        {
            'Name': "Add Sub Qn ",
            "Type": "textarea"
        },
        ];
        $scope.dragElements2 = [{
            'Name': "Main Topic M1",
            'Type': "text"
        },
        {
            'Name': "Sub Topic 1.1",
            'Type': "text"
        }, 
        {
            'Name': "Main Topic M2",
            "Type": "textarea"
        },
        {
            'Name': "Sub Topic 2.1",
            "Type": "textarea"
        },
        ];

        $scope.formFields = [];

        $scope.current_field = {};

        var createNewField = function() {
            return {
                'id': ++guid,
                'Name': '',
                'Settings': [],
                'Active': true,
                'ChangeFieldSetting': function(Value, SettingName) {
                    switch (SettingName) {
                        case 'Field Label':
                        case 'Short Label':
                        case 'Internal Name':
                            $scope.current_field.Name = Value;
                            $scope.current_field.Settings[0].Value = $scope.current_field.Name;
                            $scope.current_field.Settings[1].Value = $scope.current_field.Name;
                            $scope.current_field.Settings[2].Value = 'x' + $scope.current_field.Name.replace(/\s/g, '_');
                            break;
                        default:
                            break;
                    }
                },
                'GetFieldSetting': function(settingName) {
                    var result = {};
                    var settings = this.Settings;
                    $.each(settings, function(index, set) {
                        if (set.Name == settingName) {
                            result = set;
                            return;
                        }
                    });
                    if (!Object.keys(result).length) {
                        //Continue to search settings in the checkbox zone
                        $.each(settings[settings.length - 1].Options, function(index, set) {
                            if (set.Name == settingName) {
                                result = set;
                                return;
                            }
                        });
                    }
                    return result;

                }
            };
        }

        $scope.changeFieldName = function(Value) {
            $scope.current_field.Name = Value;
            $scope.current_field.Settings[0].Value = $scope.current_field.Name;
            $scope.current_field.Settings[1].Value = $scope.current_field.Name;
            $scope.current_field.Settings[2].Value = 'x' + $scope.current_field.Name.replace(/\s/g, '_');
        }

        $scope.removeElement = function(idx){
            if($scope.formFields[idx].Active) {
                $('#addFieldTab_lnk').tab('show');
                $scope.current_field = {};

            }
            $scope.formFields.splice(idx, 1);
        };

        $scope.addElement = function(ele, idx) {
            $scope.current_field.Active = false;

            $scope.current_field = createNewField();
            //Merge setting from template object
            angular.merge($scope.current_field, ele);

            if (typeof idx == 'undefined') {
                $scope.formFields.push($scope.current_field);
            } else {
                $scope.formFields.splice(idx, 0, $scope.current_field);
                $('#fieldSettingTab_lnk').tab('show');
            }

        };

        $scope.activeField = function(f) {
            $scope.current_field.Active = false;
            $scope.current_field = f;
            f.Active = true;
            $('#fieldSettingTab_lnk').tab('show');
        };

        $scope.formbuilderSortableOpts = {
            'ui-floating': true,

        };
    });

    app.directive('elementDraggable', ['$document', function($document) {
        return {
            link: function(scope, element, attr) {
                element.on('dragstart', function(event) {

                    event.originalEvent.dataTransfer.setData('templateIdx', $(element).data('index'));
                });
            }
        };
    }]);

    app.directive('elementDrop', ['$document', function($document) {
        return {
            link: function(scope, element, attr) {

                element.on('dragover', function(event) {
                    event.preventDefault();
                });

                $('.drop').on('dragenter', function(event) {
                    event.preventDefault();
                })
                element.on('drop', function(event) {
                    event.stopPropagation();
                    var self = $(this);
                    scope.$apply(function() {
                        var idx = event.originalEvent.dataTransfer.getData('templateIdx');
                        var insertIdx = self.data('index')
                        scope.addElement(scope.dragElements[idx], insertIdx);
                    });
                });
            }
        };
    }]);

})();

$(function() {
    // Code here
    var dh = $(document).height();
    $('#sidebar-tab-content').height(dh - 115);
    $('#main-content').height(dh - 10);
});