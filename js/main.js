var beforePos;

function tick() { // 계속해서 실행된다. 세팅들.

  // player 이동 거리 셋팅
  var player_move_meter = beforePos - player.pos
  beforePos = player.pos

  // entitys 위치 셋팅
  for(let i = 0; i<inf.entitys.length; i++) {
    inf.entitys[i].element.style.top = "calc(50% + "+(70 - inf.entitys[i].element.height)+"px)"
    inf.entitys[i].element.style.left = "calc(50% + "+(Number(inf.entitys[i].element.style.left.replace("calc(50% + ","").replace("px)",""))+(player_move_meter*12.8)) + "px)"
  }

  // 플레이어 최대 체력 이상으로 올라갈시 체력을 최대체력과 동일하게
  if(player.stat.health > player.stat.maxHealth) player.health = player.stat.maxHealth;

  // 플레이어가 있는 맵을 확인
  player.map = maps.filter(a => (a.pos[0] <= player.pos)&&(player.pos < a.pos[1]))[0];

  // 땅이 플레이어의 위치에 따라 움직이도록 설정
  $("#ground").style.backgroundPosition = "-"+(((player.pos%10)*128)/10) + "px";

  // 체력바가 체력에 따라 움직이도록 설정
  $("#health").style.width = (player.stat.health * (186/player.stat.maxHealth)) + "px";
}

function turn() { // 누를때 등등 실행된다. 1턴을 기준으로 시행될걸?
  if(player.map.events.mobsSpawnRandom >= Math.random()) {
    var pm = player.map.events.mobs;
    summon(pm[Math.floor(Math.random()*pm.length)], Math.ceil(Math.random()*(player.map.pos[1] - player.map.pos[0])) + player.map.pos[0])
  }
}

function copy(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = copy(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

var alarmLog = function (a) {console.log("%c "+a+" ","font-weight: bold; color: white; background: black;")}

function summon(code, pos) { // 무언가를 소환하는 함수
  var summonMob = copy(mobs.filter(o => o.code == code)[0])
  if(summonMob == null) {
    alarmLog("해당 코드를 가진 엔티티를 찾을 수 없습니다 : summon('"+code+"')")
  } else {
    inf.entitys.push(summonMob)
    if(pos==null) {
      pos = player.pos+20
    }
    summonMob.pos = pos;
    var relaPos = pos - player.pos;

    var m = new Image(); m.id = "mobs"; m.src = "imgs/mob/"+code+".png";
    m.style.left = "calc(50% + ("+(relaPos*12.8)+"px))"
    summonMob.element = m;
    $("#space").appendChild(m)

    // naturalWidth, naturalHeight: 해당 사진의 원본 크기를 가져옴.
    m.onload = function () {

      m.style.width = (m.naturalWidth/4)+"px";
      m.style.height = (m.naturalHeight/4)+"px";
      tick()
    }
  }

  return summonMob;
}

function createWindow(name, width, height) {
  var c = document.createElement("div");
  c.id = "newWindow_"+name;
  c.className = "newWindow";
  c.style.width = "calc("+width+")";
  c.style.height = "calc("+height+")";
  document.body.appendChild(c);

  for(let i = 0; i<9; i++) {
    var a = new Image();
    a.src = "imgs/normal_window/normal_window_"+(i+1)+".png";
    if( (i%3) == 0 ) {
      c.appendChild(document.createElement("ul"))
    }

    $$("#newWindow_"+name+" ul")[$$("#newWindow_"+name+" ul").length-1].appendChild(document.createElement("li"))
    // 임의의 창 아래의 마지막 ul에 li 원소를 만들어서 넣는다.
    $$("#newWindow_"+name+" li")[$$("#newWindow_"+name+" li").length-1].appendChild(a)
  }

  if((height != null) && (width != null)) {
    $$("#newWindow_"+name+" li") [1].style.width = "calc(100% - 12px)"
    $$("#newWindow_"+name+" li") [4].style.width = "calc(100% - 12px)"
    $$("#newWindow_"+name+" li") [7].style.width = "calc(100% - 12px)"

    $$("#newWindow_"+name+" li") [3].style.height = "calc("+height+" - 30px)"
    $$("#newWindow_"+name+" li") [4].style.height = "calc("+height+" - 30px)"
    $$("#newWindow_"+name+" li") [5].style.height = "calc("+height+" - 30px)"
  }

  $$("#newWindow_"+name+" img")[1].style.width = "100%"
  $$("#newWindow_"+name+" img")[4].style.width = "100%"
  $$("#newWindow_"+name+" img")[7].style.width = "100%"

  $$("#newWindow_"+name+" img")[3].style.height = "100%"
  $$("#newWindow_"+name+" img")[4].style.height = "100%"
  $$("#newWindow_"+name+" img")[5].style.height = "100%"
}

function buttonPressed(a) {
  a.style.visibility = "hidden"
  setTimeout(function () {
    a.style.visibility = "visible"
  },100)

  var mean = a.src.replace("imgs/","").replace("_button.png","").split("/");
  mean = mean[mean.length-1]

  // walk situation

  if(player.beh.act == "walk") {
    if(mean == "right") {
      player.pos += player.stat.moveSpeed
    } else if(mean == "left") {
      player.pos -= player.stat.moveSpeed
    } else if(mean == "up") {
      player.beh.act = "inventory";
      $("#inventory").style.visibility = "visible"
      $("#crepe").style.visibility = "hidden"
    }

    if((player.beh.act == "walk") && ((mean == "right") || (mean == "left"))) {
      if(player.beh.up == false) {
        $("#player").src = "imgs/player_walk.png"
        player.beh.up = true
      } else {
        $("#player").src = "imgs/player.png"
        player.beh.up = false
      }
    }

    turn()
  }

  // inventory situation

  if(player.beh.act == "inventory") {
    if(mean == "no") {
      $("#inventory").style.visibility = "hidden"
      $("#crepe").style.visibility = "visible"
      player.beh.act = "walk";
    }
  }

  tick()
}

var inf = {
  time: 0,
  entitys: new Array,
}

var player = {
  stat: {
    health: 100,
    maxHealth: 100,
    moveSpeed: 5,
    attack: 5,
    critical: 0,
  },
  pos: 0,
  map: null,
  beh: {
    up: false,
    act: "walk",
  },
  inventory: {

  }
}

window.onload = function () {
  tick()
  createWindow("inventory","100% - 5px","249px")
  $("#inventory").appendChild($("#newWindow_inventory"))

  $("#loading").outerHTML = null
}
