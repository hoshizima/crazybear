enchant();

window.onload = function () {
  var game = new Game(320, 320);
  game.fps = 30;
  game.preload("./img/chara1.png");
  var score = 0;
  var scoremessage = new Label("score:");
  var touchmessage = new Label("Touch the crazy bear!!");
  scoremessage.font = "16px Palatino";
  scoremessage.x = 10;
  scoremessage.y = 5;
  touchmessage.x = 10;
  touchmessage.y = 30;

  game.rootScene.addChild(scoremessage);
  game.rootScene.addChild(touchmessage);

  game.onload = function () {
    var kuma = new Sprite(32, 32);
    kuma.image = game.assets["./img/chara1.png"];
    kuma.x = 100;
    kuma.y = 120;
    game.rootScene.addChild(kuma);
    game.rootScene.backgroundColor = "#7ecef4";
    setInterval(function () {
      kuma.tl.moveTo(Math.random() * 320, Math.random() * 320, 30);
    }, 1000);
    //フレームごとに実行
    game.rootScene.addEventListener(Event.ENTER_FRAME, function () {
      kuma.frame++;
      if (kuma.frame === 3) {
        kuma.frame = 0;
      }

      scoremessage.text = "score:" + score;
    });
    // タッチイベント時に実行
    kuma.addEventListener(Event.TOUCH_START, function (e) {
      if (
        e.x > kuma.x &&
        e.x < kuma.x + 32 &&
        e.y > kuma.y &&
        e.y < kuma.y + 32
      ) {
        score++;
      }
    });
  };
  game.start();
};
