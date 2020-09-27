/**
 * 定数定義
 */
const coreSCENEWIDTH = 640;
const coreSCENEHEIGHT = 640;
const SURFACEWIDTH = 640;
const SURFACEHEIGHT = 640;
const CHARACTORREALWIDTH = 46;
const CHARACTORREALHEIGHT = 34;
const CHARACTORWIDTH = 64;
const CHARACTORHEIGHT = 64;
const CHARACTORFIRST_X = 312;
const CHARACTORFIRST_Y = 223;
const CHARACTORHP = 100;
const CHARACTORAP = 100;
const MOVE_DISTANCE_X = 46;
const MOVE_DISTANCE_Y = 34;
const DAMAGE_REACTION_ARRAY = [
  [2, -2, 1, 0],
  [2, -2, 1, 0],
];
/**15X15のフィールドステータス配列 */
/**
 * 0:normal
 * 1:charactor
 * 2:enemy
 * 3:shield
 * 4:bullet
 */
var field_status_array = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
var charactorappearance_x = [];
var charactorappearance_y = [];
var enemies = [];
/*メイン処理開始*/
enchant();

window.onload = function () {
  /*HTML内要素を取得 */
  var hitpoint = document.getElementById("hitpoint");
  hitpoint.innerHTML = "HP：" + CHARACTORHP;
  var hitpointbar = document.getElementById("hitpointbar");
  var actionpoint = document.getElementById("actionpoint");
  actionpoint.innerHTML = "AP：" + CHARACTORAP;
  var actionpointbar = document.getElementById("actionpointbar");

  var gameview = document.getElementById("gameview");

  /*ゲームオブジェクトの作成、画像のプリロード*/
  var core = new Core(coreSCENEWIDTH, coreSCENEHEIGHT);
  core.fps = 30;
  core.preload("./img/cellgirl_body.png");
  core.preload("./img/cellgirl_ribbon.png");

  //ゲーム画面の拡大率を修正
  //core.scale = 1;

  //キーバインド
  core.keybind(16, "shift");
  core.keybind(17, "ctrl");
  core.keybind(32, "space");
  core.keybind(65, "a");
  core.keybind(67, "c");

  //Core（Game）のロード後処理
  core.onload = function () {
    /**タイトルシーンの作成 */
    var createTitleScene = function () {
      var scene = new Scene();
      var label = new Label("Click to start");
      label.textAlign = "center";
      label.color = "#ffffff";
      label.font = "40px impact";
      label.moveTo((core.width - label._boundWidth) / 2, 320);
      scene.addChild(label);
      scene.backgroundColor = "rgba(255,255,255,0.3)";
      scene.addEventListener(Event.TOUCH_START, function (e) {
        core.replaceScene(createGameScene());
      });
      return scene;
    };
    /**ゲームオーバーシーンの作成 */
    var createGameOverScene = function () {
      var scene = new Scene();
      var label = new Label("Game Over Click to Retry");
      label.textAlign = "center";
      label.color = "#ffffff";
      label.font = "25px impact";
      label.moveTo((core.width - label._boundWidth) / 2, 320);
      scene.addChild(label);
      scene.backgroundColor = "rgba(255,255,255,0.3)";
      scene.addEventListener(Event.TOUCH_START, function (e) {
        core.replaceScene(createTitleScene());
      });
      return scene;
    };

    /**
     * ゲームシーンの作成
     */
    var createGameScene = function () {
      var mainscene = new Scene();
      /*背景にマス目を表示*/
      var background = new Sprite(SURFACEWIDTH, SURFACEHEIGHT);
      var surface = new Surface(SURFACEWIDTH, SURFACEHEIGHT);
      background.image = surface;
      var context = surface.context;
      context.beginPath();
      context.strokeStyle = "rgb(255, 255, 255)";
      context.lineWidth = 1;
      for (var i = 0; i < 20; i++) {
        charactorappearance_x[i] = i * CHARACTORREALWIDTH;
        charactorappearance_y[i] = i * CHARACTORREALHEIGHT;
        context.moveTo(charactorappearance_x[i], 0);
        context.lineTo(charactorappearance_x[i], SURFACEHEIGHT);
        context.moveTo(0, charactorappearance_y[i]);
        context.lineTo(SURFACEWIDTH, charactorappearance_y[i]);
        context.closePath();
        context.stroke();
      }
      mainscene.addChild(background);

      initializationflag = false;
      hitpointbar.style.width = "100px";
      hitpoint.innerHTML = "HP:100";

      var kuma = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
      var ribbon = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
      var kuma_dummy = new Sprite(CHARACTORREALWIDTH, CHARACTORREALHEIGHT);
      kuma.image = core.assets["./img/cellgirl_body.png"];
      ribbon.image = core.assets["./img/cellgirl_ribbon.png"];
      kuma.x = CHARACTORFIRST_X;
      kuma.y = CHARACTORFIRST_Y;
      ribbon.x = CHARACTORFIRST_X;
      ribbon.y = CHARACTORFIRST_Y;
      kuma_dummy.x = kuma.x + (kuma.width - kuma_dummy.width) / 2;
      kuma_dummy.y = kuma.y + (kuma.height - kuma_dummy.height) / 2;
      kuma.hp = CHARACTORHP;
      kuma.ap = CHARACTORAP;
      kuma.isMoving = false;
      mainscene.addChild(kuma);
      mainscene.addChild(ribbon);
      mainscene.addChild(kuma_dummy);

      //kumaへイベント処理を追加
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
          this.vy =
            Number(core.input.down) * MOVE_DISTANCE_Y +
            -1 * Number(core.input.up) * MOVE_DISTANCE_Y;
          this.vx =
            Number(core.input.right) * MOVE_DISTANCE_X +
            -1 * Number(core.input.left) * MOVE_DISTANCE_X;

          /**
           * shiftを入力した際の処理
           */
          if (core.input.shift) {
            if (kuma.ap >= 10) {
              kuma.ap = kuma.ap - 10;
              actionpoint.innerHTML = "AP:" + kuma.ap;
              actionpointbar.style.width = String(kuma.ap) + "px";
              var shield = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
              shield.image = core.assets["./img/cellgirl_body.png"];
              shield.frame = 7;
              shield.x = kuma.x;
              shield.y = kuma.y;
              shield.hp = 100;
              mainscene.insertBefore(shield, kuma);
              var shield_dummy = new Sprite(
                CHARACTORREALWIDTH,
                CHARACTORREALHEIGHT
              );
              mainscene.addChild(shield_dummy);
            }
            if (core.input.space) {
              //shift+spaceの処理
              showProps(this, "kum");
            }
          }

          if (core.input.ctrl) {
            if (core.input.space) {
              //ctrl+spaceの処理
              core.mainscene.backgroundColor = "#000000";
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
        //リボン,ヒットボックスの位置を調整
        ribbon.x = this.x;
        ribbon.y = this.y;
        kuma_dummy.x = this.x + (this.width - kuma_dummy.width) / 2;
        kuma_dummy.y = this.y + (this.height - kuma_dummy.height) / 2;
      }); //kuma.addEventListener終了
      setInterval(() => {
        var enemy = createEnemy();
        var enemy_dummy = new Sprite(32, 32);
        enemy_dummy.x = enemy.x;
        enemy_dummy.y = enemy.y;
        mainscene.addChild(enemy);
        mainscene.addChild(enemy_dummy);
        enemy.addEventListener(Event.ENTER_FRAME, function () {
          enemy.x += enemy.speed;
          enemy_dummy.x += enemy.speed;
          if (enemy.x > 640) {
            mainscene.removeChild(enemy);
          }
          if (enemy_dummy.intersect(kuma_dummy)) {
            /**衝突時の処理 */
            mainscene.removeChild(enemy);
            mainscene.removeChild(enemy_dummy);
            kuma.hp -= 10;
            hitpoint.innerHTML = "HP:" + kuma.hp;
            hitpointbar.style.width = String(kuma.hp) + "px";
            gameviewshake();
            if (kuma.hp <= 0) {
              core.replaceScene(createGameOverScene());
            }
            //core.mainscene.addChild(hplabel);
          }
        });
      }, 100);
      return mainscene;
    }; //ゲームシーンの作成終了

    /**関数定義 */
    //ダメージを受けた際に画面を揺らす
    var gameviewshake = function () {
      var DAMAGE_REACTION_ARRAY_counter_top = 0;
      var DAMAGE_REACTION_ARRAY_counter_left = 0;
      setInterval(() => {
        gameview.style.top =
          String(DAMAGE_REACTION_ARRAY[0][DAMAGE_REACTION_ARRAY_counter_top]) +
          "px";
        gameview.style.left =
          String(DAMAGE_REACTION_ARRAY[1][DAMAGE_REACTION_ARRAY_counter_left]) +
          "px";
        DAMAGE_REACTION_ARRAY_counter_top++;
        DAMAGE_REACTION_ARRAY_counter_left++;
      }, 100);
    };

    core.replaceScene(createTitleScene());
  }; //core.onload処理終了
  core.start();
}; //window.onload処理終了
/**
 * 敵オブジェクトを作成します
 */
function createEnemy() {
  var enemy = new Label("密");
  enemy.font = "32px impact";
  enemy.color = "#ffffff";
  enemy.hitbox_x = 32;
  enemy.hitbox_y = 32;
  enemy.x = 0;
  enemy.y = charactorappearance_y[parseInt(Math.random() * 19)];

  //enemyインスタンスにプロパティを追加
  enemy.hp = 10;
  enemy.speed = 3 + Math.random() * 3;

  //敵配列にpushで追加
  enemies.push(enemy);

  return enemy;
}

/**
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Working_with_Objects
 * オブジェクト変数を引数に入れることでオブジェクト内のプロパティを表示する。
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
