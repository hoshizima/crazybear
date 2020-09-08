/*定数定義*/
const coreSCENEWIDTH = 640;
const coreSCENEHEIGHT = 640;
const SURFACEWIDTH = 640;
const SURFACEHEIGHT = 640;
const CHARACTORWIDTH = 64;
const CHARACTORHEIGHT = 64;
const CHARACTORFIRST_X = -8;
const CHARACTORFIRST_Y = -15;
const CHARACTORHP = 100;
const CHARACTORAP = 100;
const MOVE_DISTANCE = 32;

/*メイン処理開始*/
enchant();

window.onload = function () {
  var core = new Core(coreSCENEWIDTH, coreSCENEHEIGHT);
  core.fps = 30;
  core.preload("./img/cellgirl_body.png");
  core.preload("./img/cellgirl_ribbon.png");
  //背景にマス目を表示。
  var background = new Sprite(SURFACEWIDTH, SURFACEHEIGHT);
  var surface = new Surface(SURFACEWIDTH, SURFACEHEIGHT);
  background.image = surface;
  var context = surface.context;
  context.beginPath();
  context.strokeStyle = "rgb(255, 255, 255)";
  context.lineWidth = 1;
  for (i = 1; i < 640; i = i + CHARACTORWIDTH) {
    context.moveTo((i * 6) / 8, 0);
    context.lineTo((i * 6) / 8, SURFACEHEIGHT);
    context.moveTo(0, i / 2);
    context.lineTo(SURFACEWIDTH, i / 2);
    context.closePath();
    context.stroke();
  }
  core.rootScene.addChild(background);

  //キャラクターの初期化が必要な場合に立つフラグ
  var initializationflag = false;

  var scoremessage = new Label("up:↑ down:↓ left:← right:→");
  scoremessage.font = "16px Palatino";
  scoremessage.x = 10;
  scoremessage.y = 5;

  //ゲーム画面の拡大率を修正
  core.scale = 1;
  //キーバインド
  core.keybind(16, "shift");
  core.keybind(17, "ctrl");
  core.keybind(32, "space");
  core.keybind(65, "a");
  core.keybind(67, "c");

  core.rootScene.addChild(scoremessage);

  core.onload = function () {
    var kuma = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
    var ribbon = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
    kuma.image = core.assets["./img/cellgirl_body.png"];
    ribbon.image = core.assets["./img/cellgirl_ribbon.png"];
    kuma.x = CHARACTORFIRST_X;
    kuma.y = CHARACTORFIRST_Y;
    ribbon.x = CHARACTORFIRST_X;
    ribbon.y = CHARACTORFIRST_Y;
    kuma.hp = CHARACTORHP;
    kuma.ap = CHARACTORAP;
    kuma.isMoving = false;
    core.rootScene.addChild(kuma);
    core.rootScene.addChild(ribbon);

    showProps(kuma, "kuma");

    //フレームごとに実行
    kuma.addEventListener(Event.ENTER_FRAME, function actions() {
      if (initializationflag) {
        kuma.scaleX = kuma.scaleY = ribbon.scaleX = ribbon.scaleY = 1;
      }
      if (core.frame % (core.fps / 2) == 0) {
        this.frame++;
      }
      if (core.frame % (core.fps / 3) == 0) {
        ribbon.frame++;
      }
      this.frame %= 3;
      ribbon.frame %= 3;
      //移動する
      if (this.isMoving) {
        this.moveBy(this.vx, this.vy);
        this.isMoving = false;
      } else {
        //移動距離の初期化
        this.vy = this.vx = 0;
        //キー入力を取得し移動を決定
        if (core.input.down) {
          this.vy = MOVE_DISTANCE;
        }
        if (core.input.up) {
          this.vy = -MOVE_DISTANCE;
        }
        if (core.input.left) {
          this.vx = -MOVE_DISTANCE;
        }
        if (core.input.right) {
          this.vx = MOVE_DISTANCE;
        }

        if (core.input.shift) {
          if (core.input.space) {
            //shift+spaceの処理
            core.rootScene.backgroundColor = "#ffffff";
          }
        }

        if (core.input.ctrl) {
          if (core.input.space) {
            //ctrl+spaceの処理
            core.rootScene.backgroundColor = "#000000";
          }
          if (core.input.a) {
            //ctrl+aの処理
            kuma.scaleX *= 10;
            kuma.scaleY *= 10;
            ribbon.scaleX *= 10;
            ribbon.scaleY *= 10;
            initializationflag = true;
          }
        }

        if (this.vy || this.vx) {
          this.isMoving = true;
          actions();
        }
      }
      //リボンの位置を調整
      ribbon.x = this.x;
      ribbon.y = this.y;

      //敵を出現させる
      if (Math.random() * 100 > 20) {
        var enemy = new Label("売上");
        enemy.font = "16px Palatino";
        enemy.x = 64;
        enemy.y = 64;
        core.rootScene.addChild(enemy);
      }
    });
  };
  core.start();
};

/*
https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Working_with_Objects
オブジェクト変数を引数に入れることでオブジェクト内のプロパティを表示する。
*/
function showProps(obj, objName) {
  var result = "";
  for (var i in obj) {
    // obj.hasOwnProperty() はオブジェクトのプロトタイプチェーンからプロパティを絞り込むために使用しています
    if (obj.hasOwnProperty(i)) {
      result += objName + "." + i + " = " + obj[i] + "\n";
    }
  }
  console.log(result);
}
