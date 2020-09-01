/*定数定義*/
const coreSCENEWIDTH = 640;
const coreSCENEHEIGHT = 640;
const CHARACTORWIDTH = 64;
const CHARACTORHEIGHT = 64;
const CHARACTORFIRST_X = 0;
const CHARACTORFIRST_Y = 0;
const CHARACTORHP = 100;
const CHARACTORAP = 100;
const MOVE_DISTANCE = 64;

/*メイン処理開始*/
enchant();

window.onload = function ()
{
  var core = new Core(coreSCENEWIDTH, coreSCENEHEIGHT);
  core.fps = 60;
  core.preload("./img/cellgirl_body.png");
  core.preload("./img/cellgirl_ribbon.png");
  var scoremessage = new Label("up:↑ down:↓ left:← right:→");
  scoremessage.font = "16px Palatino";
  scoremessage.x = 10;
  scoremessage.y = 5;
  core.scale = 1;

  core.rootScene.addChild(scoremessage);

  core.onload = function ()
  {
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
    core.rootScene.addChild(kuma);
    core.rootScene.addChild(ribbon);
    core.rootScene.backgroundColor = "#7ecef4";

    core.rootScene.addEventListener(Event.UP_BUTON_DOWN, function ()
    {
      console.log("ok");
    });

    //フレームごとに実行
    core.rootScene.addEventListener(Event.ENTER_FRAME, function ()
    {
      if (core.frame % (core.fps / 2) == 0)
      {
        kuma.frame++;
      }
      if (core.frame % (core.fps / 3) == 0)
      {
        ribbon.frame++;
      }
      if (kuma.frame === 3)
      {
        kuma.frame = 0;
      }
      if (ribbon.frame === 3)
      {
        ribbon.frame = 0;
      }
      //キー入力を受け付ける。
      if (kuma.y > 0)
      {
        if (core.input.up)
        {
          kuma.y -= MOVE_DISTANCE;
        }
      }
      if (kuma.y < coreSCENEHEIGHT - CHARACTORHEIGHT)
      {
        if (core.input.down)
        {
          kuma.y += MOVE_DISTANCE;
        }
      }
      if (kuma.x > 0)
      {
        if (core.input.left)
        {
          kuma.x -= MOVE_DISTANCE;
        }
      }
      if (kuma.x < coreSCENEWIDTH - CHARACTORWIDTH)
      {
        if (core.input.right)
        {
          kuma.x += MOVE_DISTANCE;
          console.log("kuma_x:" + kuma.x);
          showProps(core, "core");
          showProps(kuma, "kuma");
        }
      }
      //リボンの位置を調整
      ribbon.x = kuma.x;
      ribbon.y = kuma.y;
    });
  };
  core.start();
};

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
