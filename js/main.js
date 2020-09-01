/*定数定義*/
const coreSCENEWIDTH = 320;
const coreSCENEHEIGHT = 320;
const CHARACTORWIDTH = 32;
const CHARACTORHEIGHT = 32;
const CHARACTORFIRST_X = 0;
const CHARACTORFIRST_Y = 0;
const CHARACTORHP = 100;
const CHARACTORAP = 100;

/*メイン処理開始*/
enchant();

window.onload = function () {
  var core = new Core(coreSCENEWIDTH, coreSCENEHEIGHT);
  core.fps = 60;
  core.preload("./img/chara1.png");
  var scoremessage = new Label("up:↑ down:↓ left:← right:→");
  scoremessage.font = "16px Palatino";
  scoremessage.x = 10;
  scoremessage.y = 5;
  core.scale = 1;

  core.rootScene.addChild(scoremessage);

  core.onload = function () {
    var kuma = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
    kuma.image = core.assets["./img/chara1.png"];
    kuma.x = CHARACTORFIRST_X;
    kuma.y = CHARACTORFIRST_Y;
    kuma.hp = CHARACTORHP;
    kuma.ap = CHARACTORAP;
    core.rootScene.addChild(kuma);
    core.rootScene.backgroundColor = "#7ecef4";

    core.rootScene.addEventListener(Event.UP_BUTON_DOWN, function () {
      console.log("ok");
    });

    //フレームごとに実行
    core.rootScene.addEventListener(Event.ENTER_FRAME, function () {
      if (core.frame % core.fps == 0) {
        kuma.frame++;
      }
      if (kuma.frame === 3) {
        kuma.frame = 0;
      }
      //キー入力を受け付ける。
      if (kuma.y > 0) {
        if (core.input.up) {
          kuma.y -= 32;
        }
      }
      if (kuma.y < coreSCENEHEIGHT - CHARACTORHEIGHT) {
        if (core.input.down) {
          kuma.y += 32;
        }
      }
      if (kuma.x > 0) {
        if (core.input.left) {
          kuma.x -= 32;
        }
      }
      if (kuma.x < coreSCENEWIDTH - CHARACTORWIDTH) {
        if (core.input.right) {
          kuma.x += 32;
          console.log("kuma_x:" + kuma.x);
          showProps(core, "core");
          showProps(kuma, "kuma");
        }
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
