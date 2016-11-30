class Editor {

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        var preloading = new PreLoading();
        preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        this.getLocalVersion();
    }

    getLocalVersion() {
        var remote = new flower.Remote(this.getLocalVersionBack, this);
        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(remote.remoteClientId);
        msg.writeUInt(200);
        msg.writeUInt(remote.id);
        remote.send(msg);
    }

    getLocalVersionBack(cmd, msg) {
        this.localVersion = msg.readUTF();

        var remote = new flower.Remote(this.getServerVersionBack, this);
        var msg = new flower.VByteArray();
        msg.writeUInt(20000);
        msg.writeUInt(remote.id);
        remote.send(msg);
    }

    getServerVersionBack(cmd, msg) {
        var version = msg.readUTF();
        if (this.localVersion != version) {
            software.Alert.show("工具版本太低，请更新 svn 之后重启服务");
        } else {
            this.start();
        }
    }


    start() {
        var stage = flower.Stage.getInstance();
        var ui = new flower.UIParser();
        ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        //ui.parseUIAsync("modules/dungeonEditor/Main.xml");
        stage.addChild(ui);
    }
}
