// debug
if (true) {
    window.addEventListener('load',function(){
        sceneManager = new SceneManager();
        sceneManager.cross();
    });
}

function setStundby(){
    ax = 0;
    ay = -9;
    az = 0;
}
function setBang(){
    ax = 9;
    ay = 0;
    az = 0;
}

// 定数
var STATUS_CONST = {
    'standby'   : 'STANDBY',
    'countDown' : 'COUNT_DOWN',
    'duel'      : 'DUEL',
    'chicken'   : 'CHICKEN',
    'finish'    : 'FINISH'
};

// 銃撃時間
var bangSpeed = null;
var _count;
// 初期ステータス
var status = STATUS_CONST.standby;
// カウントダウン
var i = 0;
// 端末状態
var ax = null;
var ay = null;
var az = null;
var sceneManager;
var SceneManager = function() {
    var self = this;
    this.cutin = function() {
        gid('scene_cutin').style.display = "block";
        // カットイン効果音・4秒
        playAudio('asset/se/cutin.mp3');
        setTimeout(function() {
            gid('scene_cutin').style.display = "none";
            self.duel();
        },4000);
    };
    this.duel = function() {
        gid('scene_duel').style.display = "block";
        $('.vh_center').verticalMiddle();
        $('.countdown').verticalMiddle();
        playAudio('asset/se/gun_setup.mp3');
        // 準備待ち
        isGetReady();
    };
    this.cross = function() {
        if(gid('scene_duel')){
            gid('scene_duel').style.display = "none";
        }
        gid('scene_cross').style.display = "block";
        var _bullet_1p = gid('slideLeftBullet');
        var _bullet_2p = gid('slideRightBullet');
        function switchScene(){
           //self.result();
        }
        _bullet_1p.addEventListener("webkitAnimationEnd", switchScene,false);
        _bullet_1p.addEventListener("animationend", switchScene,false);
        _bullet_1p.addEventListener("oanimationend", switchScene,false);
        _bullet_1p.className = _bullet_1p.className.replace('slideLeftBullet','');
        _bullet_1p.className += ' slideLeftBullet';
        _bullet_2p.className = _bullet_2p.className.replace('slideRightBullet','');
        _bullet_2p.className += ' slideRightBullet';
    };
    this.result = function(resultType) {
        gid('scene_result').style.display = "block";
        if(resultType === 'win'){
            gid('scene_result_win').style.display = "block";
            var _win = gid('scene_result_win_image');
            _win.className += ' magictime animationWin';
        }
    };
};

var gid = function(id){
    return document.getElementById(id);
}



$(function(){
// PhoneGapの読み込み完了まで待つ
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    sceneManager = new SceneManager();
    sceneManager.result();
    // 一定の間隔ごとにデバイスの加速度情報を取得
    var options = { frequency: 4 };
    navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}
})


function countDown() {
    // 速さ重視でリテラル書いちゃう
    if(i === 4) {
        status = STATUS_CONST.duel;
        bangReady();
        _count = gid('count_3');
        _count.parentNode.removeChild(_count);
        return;
    }
    else if(i > 0) {
        _count = gid('count_'+(i-1));
        if(_count){
           _count.parentNode.removeChild(_count);
        }
    }
    if(status !== STATUS_CONST.countDown) {
        return;
    }

    var current = gid('count_'+i);
    current.style.display = 'block';
    current.className = current.className+" fadeIn";
    if(i == 0) {
        playAudio('asset/se/ready.mp3');
    }
    i++;
    current.addEventListener("webkitAnimationEnd", countDown,false);
    current.addEventListener("animationend", countDown,false);
    current.addEventListener("oanimationend", countDown,false);
}


function rundomTime() {
}

// onSuccess: 現在の加速度情報を取得
function onSuccess(acceleration) {
    ax = acceleration.x;
    ay = acceleration.y;
    az = acceleration.z;
    // データを表示
    var htmltxt = "x: "+ax+"<br>y: "+ay+"<br>z: "+az;
    $("#info").html(htmltxt);
}

// onError: 加速度情報の取得に失敗
function onError() {
    alert("エラー発生");
}

// 構えの体勢かどうか
function isGetReady() {
    if(status !== STATUS_CONST.standby) {
        return;
    }
    if(ax !== null && ay !== null && az !== null){
        if(isStandby()) {
            status = STATUS_CONST.countDown;
            $('.fire_ready').fadeOut('fast');
            countDown();
            checkChicken();
            return;
        }
    }
    setTimeout('isGetReady()',50);
}

// 構えの体勢からぶれていないか
function checkChicken(){
    if(status !== STATUS_CONST.countDown) {
        return;
    }
    if(!isBang()) {
        setTimeout('checkChicken()',50);
    }
    else {
        status = STATUS_CONST.chicken;
        gid('beep_chicken').style.display = 'block';
    }
}

// 銃撃
function bangReady(){
    if(status !== STATUS_CONST.duel) {
        return;
    }
    if(!bangSpeed) {
        playAudio('asset/se/whistle.mp3');
        bangSpeed = new Date();
    }
    if(isBang()) {
        var currentTime = new Date();
        status = STATUS_CONST.finish;
        bangSpeed = (currentTime - bangSpeed) + '秒経過';
        playAudio('asset/se/fire.mp3');
        setTimeout(function(){
            sceneManager.cross();
            // monaca.pushPage(
            //     'cross.html',
            //     { animation: 'lift', clearStack: true },
            //     { key1: 'value1', key2: 'value2' }
            // ); 
        },1000);
    }
    else {
        setTimeout('bangReady()',1);
    }
}

// スタンバイ
function isStandby(){
    return (-4 < ax && ax < 4) && (-10.5 < ay && ay < -7.5) && (-9 < az && az < 9);
}

// 銃撃
function isBang(){
    return (8.5 < ax && ax < 10.5) && (-3.3 < ay && ay < 3.7) && (-9 < az && az < 9);
}

