app.controller('WhiteBoardController',
    function ($scope, WhiteBoardService, $document, $firebase, $timeout, UserService, $filter, WHITE_BOARD_PROPERTIES) {

    UserService.getConnectedUsersRef().$bind($scope, "connectedUsers");
    WhiteBoardService.getComponents().$bind($scope, "components");

    $scope.$watch("connectedUsers", function(val) {
        $scope.nbConnectedUsers = _.size($filter('orderByPriority')($scope.connectedUsers));
    });

    $scope.$on("deleteComponent", function(event, componentKey) {
        delete $scope.components[componentKey];
        $scope.$apply();
    });

    /* Control mode management */

    var enableControlMode = function() {

        $scope.$broadcast("enableControlMode");
        $scope.isControlModeEnabled = true;
        WhiteBoardService.setControlModeEnabled(true);
        $scope.$apply();
    };

    var disableControlMode = function() {

        $scope.$broadcast("disableControlMode");
        $scope.isControlModeEnabled = false;
        WhiteBoardService.setControlModeEnabled(false);
        $scope.$apply();
    };

    $document.on("keydown", function(event) {

        if (WHITE_BOARD_PROPERTIES.isEnableControlModeEvent(event)) {
            enableControlMode();
        }
    });

    $document.on("keyup", function(event) {

        if (WHITE_BOARD_PROPERTIES.isDisableControlModeEvent(event)) {
            disableControlMode();
        }
    });

    $document.on('mouseenter', function(event) {

        if (WHITE_BOARD_PROPERTIES.isEnableControlModeEvent(event)) {
            enableControlMode();
        } else if ($scope.isControlModeEnabled) {
            disableControlMode();
        }
    });

    $document.on('mouseleave', function(event) {

        if (WHITE_BOARD_PROPERTIES.isDisableControlModeEvent(event)) {
            disableControlMode();
        }
    });

    /* Component add */

    var onClickOnWhiteBoard = function (event) {

        if (event.target.id == "whiteboard") {

            event.preventDefault();
            event.stopPropagation();

            WhiteBoardService.addTextComponent(event.offsetX, event.offsetY);
        }

        angular.element("#whiteboard").off('mouseup', onClickOnWhiteBoard);
        angular.element("#navbar").off('mouseup', onClickOnNavBar);
    };

    var onClickOnNavBar = function(event) {
        angular.element("#whiteboard").off('mouseup', onClickOnWhiteBoard);
        angular.element("#navbar").off('mouseup', onClickOnNavBar);
    };

    /* TODO : add component general function and just pass the type on clicking on text */
    $scope.addText = function() {

        angular.element("#whiteboard").on('mouseup', onClickOnWhiteBoard);
        angular.element("#navbar").on('mouseup', onClickOnNavBar);
    };

    /* Navigation bar zoom */

    var setNavbarZoom = function(zoom) {
        var h = document.getElementById("navbar");
        h.style.zoom = zoom;
    };

    setNavbarZoom(window.innerWidth/screen.width);

    $(window).resize(function() { setNavbarZoom(window.innerWidth/screen.width); });

    /* White Board Size */

    var getWhiteBoardSize = function() {
        return { height: ($document.height() - 51) + 'px', width: $document.width() + 'px' };
    };

    $scope.$watch(getWhiteBoardSize, function (newWhiteBoardSize) {
         $scope.whiteBoardSize = newWhiteBoardSize;
    }, true);

    /* Drag-scrollable white board */

    var startX, startY, startScrollLeft, startScrollTop;

    angular.element("#whiteboard").on('mousedown', function(event) {

        startX = event.screenX;
        startY = event.screenY;
        startScrollLeft = $("body").scrollLeft();
        startScrollTop = $("body").scrollTop();

        angular.element("#whiteboard").on('mousemove', onMouseMove);
        angular.element("#whiteboard").on('mouseup', onMouseUp);
    });

    var onMouseMove = function(event) {

        $("body").scrollLeft(startScrollLeft - (event.screenX - startX));
        $("body").scrollTop(startScrollTop - (event.screenY - startY));
    };

    var onMouseUp = function(event) {

        angular.element("#whiteboard").off('mousemove', onMouseMove);
        angular.element("#whiteboard").off('mouseup', onMouseUp);
    };
});