var beforePos;

function wav(src) {
  var a = new Audio("wav/"+src+".wav");
  a.play();
}

function hitTest(a, b) {
  var centerMeter = (a.pos*12.8) - (b.pos*12.8);
  if(centerMeter < 0) {
    if((centerMeter + a.element.width/2 + b.element.width/2) >= -25.6) { // 왜인지 모르겠지만 이정도의 오차범위가 존재 (12.8px = 1 pixel)
      return {result: true, dir: "left", meter: 0};
    } else return {result: false, dir: "left", meter: (centerMeter + a.element.width/2 + b.element.width/2)};
  } else {
    if((centerMeter - a.element.width/2 - b.element.width/2) <= -25.6) { // 왜인지 모르겠지만 이정도의 오차범위가 존재 (12.8px = 1 pixel)
      return {result: true, dir: "right", meter: 0};
    } else return {result: false, dir: "right", meter: Math.abs(centerMeter - a.element.width/2 - b.element.width/2)};
  }
}

function tick() { // 계속해서 실행된다. 세팅들.

  if(player.pos < 0) {
    player.pos = 0
  }

  if($("#player").naturalWidth != 0) {
    $("#player").style.width = $("#player").naturalWidth/4 + "px"
  }
  $("#weapon").style.width = $("#weapon").naturalWidth/4 + "px"

  // player 아이템들 중 갯수가 0 이하인 아이템을 제거
  for(let i=0; i<player.inventory.length; i += 2) {
    if(player.inventory[i+1] <= 0) {
      player.inventory.splice(i,2)
      
      inf.sel = 0;
    }
  }

  // player 아이템들을 시각적으로 보여줌
  $("#items").innerHTML = null;
  for(let i = 0; i<player.inventory.length; i+=2) {
    var li = document.createElement("li")
    li.innerText = player.inventory[i].name + " X " + player.inventory[i+1];
    $("#items").appendChild(li);
  }

  // 아이템 선택하고 있는 것
  for(let i = 0; i<$$("#items li").length; i++) {
    $$("#items li")[i].className = "unSel"
  }
  $$("#items li")[inf.sel/2].className = "sel"

  // 죽은 엔티티 제거
  for(let i = 0; i<ent.length; i++) {
    if(ent[i].stat.health <= 0) {
      ent[i].element.outerHTML = null
      for(let j = 0; j<ent[i].drop.length; j += 3) {
        var m = Math.floor(Math.random()*(ent[i].drop[j+2] - ent[i].drop[j+1] + 1)) + ent[i].drop[j+1]
        if(m > 0) {
          give(ent[i].drop[j], m)
        }
      }
      ent.splice(i,1)
    }
  }

  // 너무 먼 엔티티 제거
  for(let i = 0; i<ent.length; i++) {
    if(Math.abs(ent[i].pos - player.pos) >= 200) {
      ent[i].element.outerHTML = null
      ent.splice(i,1)
    }
  }

  // player 이동 거리 셋팅
  var player_move_meter = beforePos - player.pos
  beforePos = player.pos

  // entitys 위치 셋팅
  for(let i = 0; i<inf.entitys.length; i++) {
    inf.entitys[i].element.style.top = "calc(50% + "+(70 - inf.entitys[i].element.height)+"px)"
    inf.entitys[i].element.style.left = "calc(50% + "+(Number(inf.entitys[i].element.style.left.replace("calc(50% + ","").replace("px)",""))+(player_move_meter*12.8)) + "px)"
  }

  // 플레이어 최대 체력 이상으로 올라갈시 체력을 최대체력과 동일하게
  if(player.stat.health > player.stat.maxHealth) player.stat.health = player.stat.maxHealth;

  // 플레이어가 있는 맵을 확인
  player.map = maps.filter(a => (a.pos[0] <= player.pos)&&(player.pos < a.pos[1]))[0];

  // 땅이 플레이어의 위치에 따라 움직이도록 설정
  $("#ground").style.backgroundPosition = "-"+(((player.pos%10)*128)/10) + "px";

  // 체력바가 체력에 따라 움직이도록 설정
  $("#health").style.width = (player.stat.health * (186/player.stat.maxHealth)) + "px";
}

function turn() { // 누를때 등등 실행된다. 1턴을 기준으로 시행될걸?

  // 플레이어가 속한 맵의 스폰율에 따라 확률적으로 소환하고 최대 수 만큼 소환
  if( (player.map.events.mobsSpawnRandom >= Math.random() )&&( inf.entitys.filter(a => (a.pos >= player.map.pos[0])&&(a.pos < player.map.pos[1]) ).length < player.map.events.mobsSpawnMax ) ) {
    var pm = player.map.events.mobs;
    summon(pm[Math.floor(Math.random()*pm.length)], Math.ceil(Math.random()*(player.map.pos[1] - player.map.pos[0])) + player.map.pos[0])
  }

  for(let i=0; i<ent.length; i++) {
    ent[i].element.src = "imgs/mob/" + ent[i].code + ".png"
  }

  var tb = new Array;

  // 몹에게 공격 받음
  player.beh.state = "being"

  for(let i = 0; i<inf.entitys.length; i++) {
    tb.push({element: inf.entitys[i].code,result: hitTest(player, inf.entitys[i]).result, meter: Math.floor(hitTest(player, inf.entitys[i]).meter/12.8*100)/100})

    if(hitTest(player, inf.entitys[i]).result == true) {
      deal(player, inf.entitys[i].stat.attack);
    }
  }

  console.clear()
  console.table(tb)

  player.stat.health += player.stat.regen
}

function copy(obj) {
  if(obj != null)
    return JSON.parse(JSON.stringify(obj));
  else return null;
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
    summonMob.state = "being"
    var relaPos = pos - player.pos;

    var m = new Image(); m.id = "mobs"; m.src = "imgs/mob/"+code+".png";
    m.style.left = "calc(50% + ("+(relaPos*12.8)+"px))"
    m.style.display = "none" // 소환되고 잠시 커졌다가 작아지는 효과를 방지.
    summonMob.element = m;
    $("#space").appendChild(m)

    // naturalWidth, naturalHeight: 해당 사진의 원본 크기를 가져옴.
    m.onload = function () {
      m.style.width = (m.naturalWidth/4)+"px";
      m.style.height = (m.naturalHeight/4)+"px";
      m.style.display = "block"
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

function deal(toWho, how) {
  toWho.stat.health -= how
  if(toWho == player) {
    toWho.beh.state = "attacked"
  } else {
    toWho.element.src = "imgs/mob/" + toWho.code + "_attacked.png"
  }
}

function buttonPressed(a) {

  a.style.visibility = "hidden"
  setTimeout(function () {
    a.style.visibility = "visible"
  },100)

  var mean = a.src.replace("imgs/","").replace("_button.png","").split("/");
  mean = mean[mean.length-1]

  // walk situation

  $("#weapon").style.transform = "rotate(20deg) translate(-50%, -50%)"
  $("#weapon").style.left = "calc(50% + 32px)"
  $("#weapon").style.top = "calc(50% + 64px)"

  if((mean == "right")||(mean == "left")||(mean == "up")||(mean == "down"))
  turn()
  if(player.beh.act == "walk") {
    player.beh.doing = "walk"
    if(mean == "right") {
      player.pos += player.stat.moveSpeed
    } else if(mean == "left") {
      player.pos -= player.stat.moveSpeed
    } else if(mean == "up") {
      player.beh.act = "inventory";
      $("#inventory").style.visibility = "visible"
      $("#crepe").style.visibility = "hidden"
    } else if(mean == "down") {
      var they = ent.filter(e => (e.pos > player.pos)&&(e.pos < player.pos + player.stat.distance))
      if(they.length > 0) {
        player.beh.doing = "fight"
        for(let i = 0; i<they.length; i++) {
          weaponSet(0, 44, 32)
          deal(they[i], player.stat.attack)
        }
      } else {
        player.beh.doing = "sleep"
        weaponSet(90, -32, 64)
      }
    }

    if((mean == "right") || (mean == "left")) {
      if(player.beh.up == false) {
        if(player.beh.state == "attacked") {
          $("#player").src = "imgs/player_attacked_walk.png"
        } else {
          $("#player").src = "imgs/player_walk.png"
        }
        player.beh.up = true
      } else {
        if(player.beh.state == "attacked") {
          $("#player").src = "imgs/player_attacked.png"
        } else {
          $("#player").src = "imgs/player.png"
        }
        player.beh.up = false
      }
    } else {
      switch (player.beh.doing) {
        case "sleep":
        player.element.src = "imgs/player_sleep.png"
          break;
        default:
        player.element.src = "imgs/player.png"
          break;
      }
    }
  }

  // sound
  // wav(mean+"_pressed")

  // inventory situation

  if(player.beh.act == "inventory") {
    if(mean == "no") {
      $("#inventory").style.visibility = "hidden"
      $("#crepe").style.visibility = "visible"
      player.beh.act = "walk";
    }
    if(mean == "up") {
      inf.sel -= 2
      if(inf.sel < 0) inf.sel = 0
    }
    if(mean == "down") {
      inf.sel += 2
      if(inf.sel > player.inventory.length - 2) inf.sel = player.inventory.length - 2
    }
    if(mean == "yes") {
      var s = player.inventory[inf.sel]
      if(s.type[0] == "equipment") {
        equip(s)
      }
      if(s.hasOwnProperty("fun")) {
        s.fun()
      }
    }
  }

  tick()
}

function weaponSet(deg, left, top) {
  $("#weapon").style.transform = "rotate("+deg+"deg) translate(-50%, -50%)"
  $("#weapon").style.left = "calc(50% + "+left+"px)"
  $("#weapon").style.top = "calc(50% + "+top+"px)"
}

function getHow(code) {
  return inv[inv.indexOf(inv.filter(iv => iv.code == code)[0])+1]
}

function give(code, how) {
  var it = items.filter(c => c.code == code)[0]
  var pi = player.inventory;
  if(pi.filter(i => i.name == it.name).length != 0) {
    console.log(pi.filter(i => i.name == it.name)[0]);
    pi[pi.indexOf(pi.filter(i => i.name == it.name)[0])+1] += how
  } else {
    pi.push(copy(it), how)
    if(it.hasOwnProperty("fun")) {
      pi[pi.length-2].fun = it.fun
      console.log(pi[pi.length-2]);
    }
  }

  if(pi[pi.indexOf(it)+1] <= 0) {
    pi.splice(pi.indexOf(it),2)
  }
}

function unequip(type) {
  if(eval("player.eq."+type) == null) {
    return false;
  }
  eval("var it = player.eq."+type)
  console.log(it);
  for(let i = 0; i<it.stat.length; i+=2) {
    eval("player.stat."+it.stat[i]+" -= "+it.stat[i+1])
  }
  eval("player.eq."+type+" = null")

  tick()
}

function equip(obj) {
  if(obj.type[0] != "equipment") {
    return alarmLog("정상적인 아이템이 아닙니다!");
  }
  for(let i = 0; i<obj.stat.length; i+=2) {
    eval("player.stat."+obj.stat[i]+" += "+obj.stat[i+1])
  }
  unequip(obj.type[1])
  eval("player.eq."+obj.type[1]+" = obj")
  $("#weapon").src = "imgs/item/"+obj.code+".png"

  $("#weapon").onload = function () {tick()}
}

var inf = {
  time: 0,
  entitys: new Array,
  sel: 0,
}

var player = {
  element: null,
  stat: {
    health: 100,
    maxHealth: 100,
    regen: 0.5,
    moveSpeed: 2,
    attack: 7,
    critical: 0,
    distance: 10,
    def: 0,
  },
  pos: 0,
  map: null,
  beh: {
    up: false,
    act: "walk",
    state: "being",
    doing: "none",
  },
  inventory: [
    {
      code: "normal_sword",
      name: "평범한 검",
      stat: ["attack",2,"distance",10],
      price: "normal",
      type: ["equipment","weapon","sword"],
      meter: 10,
    },1
  ],
  eq: { // equipments
    weapon: {
      code: "normal_sword",
      name: "평범한 검",
      stat: ["attack",2,"distance",10],
      price: "normal",
      type: ["equipment","weapon","sword"],
      meter: 10,
    },
  }
}

var inv = player.inventory, ent = inf.entitys;

window.onload = function () {

  player.element = $("#player")
  tick()
  createWindow("inventory","100% - 5px","249px")
  $("#inventory").appendChild($("#newWindow_inventory"))

  $("#loading").outerHTML = null
}

window.onkeydown = function () {
  if(event.keyCode == 27) $$("#buttonsDiv img")[0].click();
  if(event.keyCode == 13) $$("#buttonsDiv img")[1].click();
  if(event.keyCode == 38) $$("#buttonsDiv img")[2].click();
  if(event.keyCode == 39) $$("#buttonsDiv img")[3].click();
  if(event.keyCode == 37) $$("#buttonsDiv img")[4].click();
  if(event.keyCode == 40) $$("#buttonsDiv img")[5].click();
}
