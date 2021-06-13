/* MAIN */
// ページ読み込み時に実行
window.onload = function () {
    // ボタンの有効化
    enableButton();
    // .move要素以外がクリックされたら選択状態を解除
    $(document).on('click', function(e) {
        if(!$(e.target).is('.move') && !$(e.target).is('#rotateSelectedElement')) {
            $(".move").removeClass("selected");
            selected_elements = [];
            console.log(selected_elements);
        }
    });
};

/* field */
var selected_elements = [];  // 選択中の対象のidを格納する配列

/* methods */

// ボタンの有効化
function enableButton() {
    // 追加する要素を格納する変数
    var ele;
    // ボタンクリック時の動作：青
    $("#appendBlue").click(function () {
        ele = $('<div class="b move"></div>').appendTo('.drop_area');   // 要素の追加
        update(ele);    // 状態の更新
    });

    // ボタンクリック時の動作：赤
    $("#appendRed").click(function () {
        ele = $('<div class="r move"></div>').appendTo('.drop_area');   // 要素の追加
        update(ele);    // 状態の更新
    });

    // ボタンクリック時の動作：画像
    $("#appendImage").click(function () {
        ele = $('<img src="img/test.png" class="img move">').appendTo('.drop_area');    // 要素の追加
        update(ele);    // 状態の更新
    });
    // 選択要素の削除ボタン
    $("#deleteSelectedElement").click(function () {
        $('.selected').remove();
        selected_elements = [];
        console.log(selected_elements);
    });
    // 選択要素の回転ボタン
    $("#rotateSelectedElement").click(function () {
        var mat = $(".selected").css("transform");  // matrixを取得
        var vec = matrix2vec(mat);                  // matrixを行列に変換
        vec = rotate2D(vec, 45);                    // 行列を45度回転
        mat = vec2matrix(vec);                      // 行列をmatrixに戻す
        $('.selected').css('transform',mat);        // 回転
    });
}

// 更新があったときに呼び出される
function update(ele){
    // 適当なidを割り振る
    uuid = generateUuid();
    ele.attr('id',uuid)
    // .move要素を移動可能にする
    ele.draggable({
        containment: ".drop_area" //ドラッグの範囲を制限
    });
    // 選択可能にする
    ele.click(function(){
        if( ele.hasClass('selected') ){
            ele.removeClass('selected');
            selected_elements.push(ele);
            // selected_elements配列から，eleのみを削除する
            selected_elements = selected_elements.filter(n => n !== ele);
            console.log(selected_elements);
        }
        else{
            ele.addClass('selected');
            selected_elements.push(ele);
            console.log(selected_elements);
        }
    });
}




/* UUID生成 */
// Cf. https://qiita.com/psn/items/d7ac5bdb5b5633bae165
function generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}



/*二次元回転*/
// 度数をradに変換
// https://lab.syncer.jp/Web/JavaScript/Snippet/51/
function deg2rad(degree){
    return degree * ( Math.PI / 180 ) ;
}

// CSS matrixを配列に変換する
// https://qiita.com/shogito/items/a5be366464d8cca5bafb
function matrix2vec(matrix){
    var re = /matrix\((.*)\)/;
    var vals = matrix.match(re)[1].replace(/ /g, "").split(",");
    vec = vals.map(Number)
    return vec;
}
function vec2matrix(vec){
    var vals = [];
    // 有効桁数を揃える
    vals[0] = vec[0].toFixed(20);
    vals[1] = vec[1].toFixed(20);
    vals[2] = vec[2].toFixed(20);
    vals[3] = vec[3].toFixed(20);
    vals[4] = vec[4].toFixed(20);
    vals[5] = vec[5].toFixed(20);
    // 文字列化
    var matrix = 
        "matrix("+
        vals[0]+","+
        vals[1]+","+
        vals[2]+","+
        vals[3]+","+
        vals[4]+","+
        vals[5]+")";
    return matrix;
}

// CSS matrixの二次元回転
// https://w3e.kanazawa-it.ac.jp/math/category/gyouretu/senkeidaisu/henkan-tex.cgi?target=/math/category/gyouretu/senkeidaisu/rotation_matrix_2d.html
// https://ginpen.com/2018/11/13/understanding-transform-matrix/
function rotate2D(vec,degree){
    var ret = new Array(6);
    // xベクトルに二次元回転行列をかける
    ret[0] = vec[0]*Math.cos(deg2rad(degree)) - vec[1]*Math.sin(deg2rad(degree));
    ret[1] = vec[0]*Math.sin(deg2rad(degree)) + vec[1]*Math.cos(deg2rad(degree));
    // yベクトルに二次元回転行列をかける
    ret[2] = vec[2]*Math.cos(deg2rad(degree)) - vec[3]*Math.sin(deg2rad(degree));
    ret[3] = vec[2]*Math.sin(deg2rad(degree)) + vec[3]*Math.cos(deg2rad(degree));
    // 起点の指定
    ret[4] = vec[4];
    ret[5] = vec[5];
    return ret;
}
