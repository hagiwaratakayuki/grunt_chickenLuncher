        document.addEventListener("deviceready", onDeviceReady, false);
        
        //Androidではプロジェクト中にあるmp3ファイルを読み込ませるために絶対パスを指定します。そのための関数です。
        function getPath() {
            var str = location.pathname;
            var i = str.lastIndexOf('/');
            return str.substring(0,i+1);
        }
        
        function onDeviceReady() {
            // window.alert("PhoneGapの読み込みが完了しました。");
            // playAudio('asset/se/sound.mp3');
        }

        var media = null;
        var mediaTimer = null;

        //再生するための関数です
        function playAudio(src) {
            return;//debug;
            media = new Media (getPath() + src , onSuccess, onError);

            //再生します。{numberOfLoops:"infinite"}をつけることでループ再生させることができます。
            media.play({numberOfLoops:"infinite"});

            if (mediaTimer == null) {

                mediaTimer = setInterval(function() {

                    // 再生位置を返します
                    media.getCurrentPosition(

                        //成功時のコールバック関数です
                        function(position) {
                            if (position > -1) {
                                setAudioPosition((position) + " sec");
                                //端末によっては再生位置が-0.001で止まるので、その場合は再度読み込みます。
                                if(position == -0.001){
                                    media.play({numberOfLoops:"infinite"});
                                }
                            }
                        },
                        //失敗時のコールバック関数です
                        function(e) {
                            console.log("Error getting pos=" + e);
                            setAudioPosition("Error: " + e);
                        }
                    );
                }, 1000);
            }
        }

        //再生を一時停止する関数です
        function pauseAudio() {
            if (media) {
                media.pause();
            }
        }

        //再生を停止させるための関数です
        function stopAudio() {

            if (media) {
                media.stop();
            }

            clearInterval(mediaTimer);
            mediaTimer = null;
        }

          //成功時のコールバック関数です。ここではデバッグログに成功したことをメッセージとして出力します
          function onSuccess() {
              console.log("playAudio():Audio Success");
          }

          //失敗時のコールバック関数です
          function onError(error) {
              alert('code: '    + error.code    + '\n' + 
                    'message: ' + error.message + '\n');
          }

          //オーディオの再生位置です
          function setAudioPosition(position) {
              document.getElementById('audio_position').innerHTML = position;
          }
