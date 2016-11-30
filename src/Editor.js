"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Editor = function () {
    function Editor() {
        _classCallCheck(this, Editor);

        flower.start(this.ready.bind(this));
    }

    _createClass(Editor, [{
        key: "ready",
        value: function ready() {
            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            this.getLocalVersion();
        }
    }, {
        key: "getLocalVersion",
        value: function getLocalVersion() {
            var remote = new flower.Remote(this.getLocalVersionBack, this);
            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(remote.remoteClientId);
            msg.writeUInt(200);
            msg.writeUInt(remote.id);
            remote.send(msg);
        }
    }, {
        key: "getLocalVersionBack",
        value: function getLocalVersionBack(cmd, msg) {
            this.localVersion = msg.readUTF();

            var remote = new flower.Remote(this.getServerVersionBack, this);
            var msg = new flower.VByteArray();
            msg.writeUInt(20000);
            msg.writeUInt(remote.id);
            remote.send(msg);
        }
    }, {
        key: "getServerVersionBack",
        value: function getServerVersionBack(cmd, msg) {
            var version = msg.readUTF();
            if (this.localVersion != version) {
                software.Alert.show("工具版本太低，请更新 svn 之后重启服务");
            } else {
                this.start();
            }
        }
    }, {
        key: "start",
        value: function start() {
            var stage = flower.Stage.getInstance();
            var ui = new flower.UIParser();
            ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
            //ui.parseUIAsync("modules/dungeonEditor/Main.xml");
            stage.addChild(ui);
        }
    }]);

    return Editor;
}();