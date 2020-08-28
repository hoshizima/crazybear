const GAMESCENEWIDTH=320;
const GAMESCENEHEIGHT=320;
const CHARACTORWIDTH=32;
const CHARACTORHEIGHT=32;
const CHARACTORFIRST_X=0;
const CHARACTORFIRST_Y=0;

enchant();

window.onload = function () {
  var game = new Game(GAMESCENEWIDTH, GAMESCENEHEIGHT);
  game.fps = 60;
  game.preload("./img/chara1.png");
  var scoremessage = new Label("up:↑ down:↓ left:← right:→");
  scoremessage.font = "16px Palatino";
  scoremessage.x = 10;
  scoremessage.y = 5;

  game.rootScene.addChild(scoremessage);

  game.onload = function () {
    var kuma = new Sprite(CHARACTORWIDTH, CHARACTORWIDTH);
    kuma.image = game.assets["./img/chara1.png"];
    kuma.x = CHARACTORFIRST_X;
    kuma.y = CHARACTORFIRST_Y;
    game.rootScene.addChild(kuma);
    game.rootScene.backgroundColor = "#7ecef4";

  
    //フレームごとに実行
    game.rootScene.addEventListener(Event.ENTER_FRAME, function () {
      kuma.frame++;
      if (kuma.frame === 3) {
        kuma.frame = 0;
      }
          //キー入力を受け付ける。
  if(kuma.y>0){
    if(game.input.up){
      kuma.y-=32;
    }
  }
  if(kuma.y<GAMESCENEHEIGHT-CHARACTORHEIGHT){
    if(game.input.down){
      kuma.y+=32;
    }
  }
  if(kuma.x>0){
    if(game.input.left){
      kuma.x-=32;
    }
  }
  if(kuma.x<GAMESCENEWIDTH-CHARACTORWIDTH){
    if(game.input.right){
      kuma.x+=32;
    }
  }
    });
  };
  game.start();
};
