init();
var stage, stageWidth, stageHeight;	// 画面サイズ
var snow;							// 雪
var snowArray = [];					// 雪の配列
var bigSnow;						// 至近距離の雪
var bigSnowArray = [];				// 至近距離の雪の配列
var snowfall = 10;					// 降雪量
var wind = 0;						// 風向き
var count = 0;						// カウンター
var mx;								// マウスのx座標
var vx = 0;							// 速度x軸
var vy = 0;							// 速度y軸

function init() {
  stage = new createjs.Stage("myCanvas");
  window.addEventListener("resize", handleResize);
  handleResize();
  //スマホセンサー
  window.addEventListener("deviceorientation", deviceorientationHandler);
  if (createjs.Touch.isSupported() === true) {
    createjs.Touch.enable(stage);	// タッチ操作を有効にする
  }
  //tickイベント
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", handleTick);
}

//画面のリサイズ処理
function handleResize(event) {
  // 画面幅・高さを取得
  var stageWidth = window.innerWidth;
  var stageHeight = window.innerHeight;
  // Canvas要素の大きさを画面幅・高さに合わせる
  stage.canvas.width = stageWidth;
  stage.canvas.height = stageHeight;
  stage.update();					// 画面更新する
}

//ジャイロセンサー感知
function deviceorientationHandler(event) {
  var gamma = event.gamma;		// Y軸
  wind = gamma * 0.01;			//風向きに反映
}

function handleTick(event) {
  count += 1;						// フレームを増やす
  discrimination();				// デバイスの判別
  emitSnow();						// 雪の描写
  fallSnow();
  emitBigSnow();					// 至近距離の雪の描写
  fallBigSnow();
  stage.update(); 
}

//デバイスの判別
function discrimination() {
  var ua = navigator.userAgent.toLowerCase();
  var isiPhone = (ua.indexOf('iphone') > -1);											// iPhone
  var isiPad = (ua.indexOf('ipad') > -1);												// iPad
  var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);		// Android
  var isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);	// Android Tablet
  var desktop = isiPhone || isiPad || isAndroid || isAndroidTablet;
  if(!desktop){
    mx = stage.mouseX;//風向きをマウスの位置によって変える
    if (mx < stage.canvas.width / 2) {
      wind = -0.1;
    }
    else {
      wind = 0.1;
    }
  }
}

//雪の量を調節
function emitSnow() {
  for(var i = 0; i < snowfall; i++) {
    if (count % (Math.floor(200 / snowfall)) === 0) {
      drawSnow();
    }
  }
}

//雪の描写
function drawSnow() {
  var size = Math.random() * 4;   
  snow = new createjs.Shape();
  snow.graphics
    .beginFill("#FFFFFF")
    .drawCircle(0, 0, size);
  snow.x = Math.random() * ((stage.canvas.width * 3) / 2 - (-stage.canvas.width / 2)) + (-stage.canvas.width / 2);
  snow.y = 0;
  snow.vx = 0;
  snow.vy = 0;
  snow.angle = 0;
  snow.type = Math.random();		//雪の種類にタイプをつける
  var blurStrong = size * 2;		//雪をぼかす
  var blurFilter = new createjs.BlurFilter(blurStrong, blurStrong, 2);
  snow.filters = [blurFilter];
  if (size > 1) {					//1より大きいサイズの雪にぼかしを入れる
    snow.cache(-size, -size, size * 2, size * 2); 
  }
  stage.addChild(snow);
  snowArray.push(snow);
}

//雪を落とす
function fallSnow() {
  for(var i = 0; i < snowArray.length; i++){
    var snow = snowArray[i];
    // typeAの雪
    if (snow.type < 0.3) {
      snow.vy += 0.2;				// 速度
      snow.vx += wind + 0.005;
    }
    //typeBの雪
    else if (0.3 <= snow.type && snow.type < 0.6) {
      snow.vy += 0.4;				//速度
      snow.vx += wind;
    }
    //typeCの雪
    else if (0.6 <= snow.type && snow.type < 1) {
      snow.vy += 0.8;//速度
      snow.vx += wind - 0.005;        
    }
    // 摩擦
    snow.vy *= 0.95;
    snow.vy *= 0.99;
    //反映
    snow.x += snow.vx;
    snow.y += snow.vy;
    //キャンバスから消えたら消す
    var rule = snow.x > stage.canvas.width || snow.y > stage.canvas.height || snow.x < -stage.canvas.width;
    if (rule) {
      stage.removeChild(snow);
      snowArray.splice(i , 1);
    }
  }
}

//至近距離の雪の調節
function emitBigSnow() {
  for(var i = 0; i < 1; i++){
    if(count % (Math.floor(100 / snowfall)) === 0) {
      drawBigSnow(i);
    } 
  }
}

//至近距離の雪の描写
function drawBigSnow(){
  var size = 12 * Math.random() + 10;       
  bigSnow = new createjs.Shape();
  bigSnow.graphics
    .beginFill("#FFFFFF")
    .drawCircle(0, 0, size);
  bigSnow.x = Math.random() * ((stage.canvas.width * 3) / 2 - (-stage.canvas.width / 2)) + (-stage.canvas.width / 2);
  bigSnow.y = 0;
  bigSnow.vx = 0;
  bigSnow.vy = 0;
  bigSnow.angle = 0;
  bigSnow.type = Math.random();	//雪の種類にタイプをつける
  var blurStrong = size * 2;		//ぼかす
  var blurFilter = new createjs.BlurFilter(blurStrong, blurStrong, 2);
  bigSnow.filters = [blurFilter];
  bigSnow.cache(-size, -size, size * 2, size * 2);
  stage.addChild(bigSnow);
  bigSnowArray.push(bigSnow);
}

//至近距離の雪を落とす
function fallBigSnow(){
  for (var i = 0; i < bigSnowArray.length; i++) {
    var bigSnow = bigSnowArray[i];
    bigSnow.vx += wind*10;		//速度
    bigSnow.vy += 1;
    bigSnow.vx *= 0.99;			//摩擦
    bigSnow.vy *= 1.01;
    bigSnow.x += bigSnow.vx;	//反映
    bigSnow.y += bigSnow.vy;
    //キャンバスから消えたら消す
    var rule = bigSnow.x > stage.canvas.width || bigSnow.y > stage.canvas.height || bigSnow.x < 0;
    if(rule){
      stage.removeChild(bigSnow);
      bigSnowArray.splice(i , 1);
    }
  }
}