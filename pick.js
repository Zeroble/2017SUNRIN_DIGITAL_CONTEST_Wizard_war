let count = 0;
let cnt = new Array(4);

function high(obj) {
    let a = obj.getAttribute('id');
    let skillNames = ['회복','파이어볼','원기옥','얼음창','보호막','무차별 운석','강화','가시덩쿨']
    let whatSkills = ['자신의 체력을 5초간 30씩 총 150을 회복한다(쿨타임 60초)','불덩이를 던져 상대에게 120의 피해를 주고 3초간 20의 피해를 준다(투사체 속도 매우 빠름, 쿨타임 5초)','2초간 기를 모아 마우스 커서 위치 주변에 500피해를 주는 원기옥을 떨어트린다(쿨타임 60초)','고드름을 던져 상대에게 100의 피해를 주고 1초간 상대의 이동속도를 20% 낮춘다(투사체 속도 빠름, 쿨    타임 7초)','자신에게 5초간 200의 피해를 흡수하는 보호막을 생성한다(쿨타임 60초)','10초간 맵에 한 발당 100피해를 주는 운석을 0.5초마다 떨어트린다 이 운석은 자신도 피해를 입는다(쿨타임 60초)','다음 사용하는 스킬의 데미지를 2배로 준다(쿨타임30초)','가시 넝쿨을 보내 상대에게 50의 피해를 주고상대를 1초간 속박 시킨다(투사체 속도 보통, 쿨타임 10초)']
    for(let i = 0; i < cnt.length; i++){
        if(a === cnt[i]){
            obj.style.border = "";
            obj.style.width = "100px";
            obj.style.height = "100px";
            count--;
            cnt[i] = undefined;
            return;
        }
    }
    if(count === 4) {
        return;
    }
    console.log(document.getElementById(obj.id))
    document.getElementById('skillname').innerHTML = skillNames[obj.id-1]
    document.getElementById('whatSkill').innerHTML = whatSkills[obj.id-1]
    cnt.push(a);
    obj.style.border = "solid 2px";
    obj.style.width = "96px";
    obj.style.height = "96px";
    count++;
}
