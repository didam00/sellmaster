items = [
  {
    code: "normal_sword",
    name: "평범한 검",
    stat: ["attack",2,"distance",10],
    price: 50,
    type: ["equipment","weapon","sword"],
  },
  {
    code: "jelly_sword",
    name: "젤리스워드",
    stat: ["attack",-1,"distance",15,"regen",0.5],
    price: 70,
    type: ["equipment","weapon","sword"],
  },
  {
    code: "trash",
    name: "쓰레기",
    price: 0,
    type: ["normal"],
  },
  {
    code: "slime_jelly",
    name: "슬라임 젤리",
    price: 1,
    type: ["normal"],
  },
  {
    code: "stone_piece",
    name: "돌 조각",
    price: 1,
    type: ["normal"],
  },
  {
    code: "hard_stone",
    name: "단단한 돌",
    price: 5,
    type: ["normal"],
    fun: function () {if(getHow("hard_stone") >= 20) {give("hard_stone",-20); give("hard_stone_sword",1)}}
  },
  {
    code: "intact_slime_heart",
    name: "온전한 슬라임 심장",
    price: 150,
    type: ["normal"],
    fun: function () {player.stat.health += 10; player.stat.maxHealth += 1; give("intact_slime_heart",-1)}
  },
  {
    code: "hard_stone_sword",
    name: "단단한 돌 검",
    stat: ["attack",5,"distance",11],
    price: 120,
    type: ["equipment","weapon","sword"],
  },
]

function getHow(code) {
  return inv[inv.indexOf(inv.filter(iv => iv.code == code)[0])+1]
}
