/*定数定義*/
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

var charactorappearance_x = [];
var charactorappearance_y = [];
var enemies = [];

/*メイン処理開始*/
enchant();

window.onload = function ()
{
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
  for (var i = 0; i < 20; i++)
  {
    charactorappearance_x[i] = i * CHARACTORREALWIDTH;
    charactorappearance_y[i] = i * CHARACTORREALHEIGHT;
    context.moveTo(charactorappearance_x[i], 0);
    context.lineTo(charactorappearance_x[i], SURFACEHEIGHT);
    context.moveTo(0, charactorappearance_y[i]);
    context.lineTo(SURFACEWIDTH, charactorappearance_y[i]);
    context.closePath();
    context.stroke();
  }
  core.rootScene.addChild(background);

  //キャラクターの初期化が必要な場合に立つフラグ
  var initializationflag = false;

  //ゲーム画面の拡大率を修正
  core.scale = 1;
  //キーバインド
  core.keybind(16, "shift");
  core.keybind(17, "ctrl");
  core.keybind(32, "space");
  core.keybind(65, "a");
  core.keybind(67, "c");

  core.onload = function ()
  {
    var kuma = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
    var ribbon = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
    var enemies = (kuma.image = core.assets["./img/cellgirl_body.png"]);
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

    //kumaへイベント処理を追加
    kuma.addEventListener(Event.ENTER_FRAME, function actions()
    {
      if (initializationflag)
      {
        kuma.scaleX = kuma.scaleY = ribbon.scaleX = ribbon.scaleY = 1;
      }
      if (core.frame % (core.fps / 2) == 0)
      {
        this.frame++;
      }
      if (core.frame % (core.fps / 3) == 0)
      {
        ribbon.frame++;
      }
      this.frame %= 3;
      ribbon.frame %= 3;
      //移動する
      if (this.isMoving)
      {
        this.moveBy(this.vx, this.vy);
        this.isMoving = false;
      } else
      {
        //移動距離の初期化
        this.vy = this.vx = 0;
        //キー入力を取得し移動を決定
        if (core.input.down)
        {
          this.vy = MOVE_DISTANCE_Y;
        }
        if (core.input.up)
        {
          this.vy = -MOVE_DISTANCE_Y;
        }
        if (core.input.left)
        {
          this.vx = -MOVE_DISTANCE_X;
        }
        if (core.input.right)
        {
          this.vx = MOVE_DISTANCE_X;
        }

        if (core.input.shift)
        {
          if (core.input.space)
          {
            //shift+spaceの処理
            core.rootScene.backgroundColor = "#ffffff";
          }
        }

        if (core.input.ctrl)
        {
          if (core.input.space)
          {
            //ctrl+spaceの処理
            core.rootScene.backgroundColor = "#000000";
          }
          if (core.input.a)
          {
            //ctrl+aの処理
            kuma.scaleX *= 10;
            kuma.scaleY *= 10;
            ribbon.scaleX *= 10;
            ribbon.scaleY *= 10;
            initializationflag = true;
          }
        }

        if (this.vy || this.vx)
        {
          this.isMoving = true;
          actions();
        }
      }
      //リボンの位置を調整
      ribbon.x = this.x;
      ribbon.y = this.y;
    });//kuma.addEventListener終了

    for (var i = 0; i < 10; i++)
    {
      enemies[i].addEventListener(Event.ENTER_FRAME, function ()
      {
        core.rootScene.addChild(createEnemy());
      });
    }
    //enemyにイベント処理を実行
    enemies.forEach(function (enemy)
    {
      enemy.addEventListener(Event.ENTER_FRAME, function ()
      {
        enemy.x += enemy.speed;
        if (enemy.x > 640)
        {
          deleteEnemy();
        }
      });
    });
  };//core.onload処理終了
  core.start();
};

function createEnemy()
{
  var enemy = new Label("密");
  enemy.font = "32px Palatino";
  enemy.color = "#ffffff";
  enemy.x = charactorappearance_x[parseInt(Math.random() * 13)];
  enemy.y = charactorappearance_y[parseInt(Math.random() * 16)];

  //enemyインスタンスにプロパティを追加
  enemy.hp = 10;
  enemy.speed = 0.5;

  //敵配列にpushで追加
  enemies.push(enemy);

  return enemy;
}

function deleteEnemy(i)
{
  enemies.splice(i, 1);
}

/*
https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Working_with_Objects
オブジェクト変数を引数に入れることでオブジェクト内のプロパティを表示する。
*/
function showProps(obj, objName)
{
  var result = "";
  for (var i in obj)
  {
    // obj.hasOwnProperty() はオブジェクトのプロトタイプチェーンからプロパティを絞り込むために使用しています
    if (obj.hasOwnProperty(i))
    {
      result += objName + "." + i + " = " + obj[i] + "\n";
    }
  }
  console.log(result);
}
