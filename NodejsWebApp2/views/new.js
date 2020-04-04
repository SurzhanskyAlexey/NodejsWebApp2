let a = isValidWalk(['n','n','n','s','n','s','n','s','n','s'])
console.log(a);
function isValidWalk(walk) {
    let set = new Set();
    for (let j = 0; j <walk.length; j++ ) {
        set.add(walk[j])

    }
    // console.log(set);
    // let n
    // let s
    // let e
    // let w
    // for (let i = 0; i < walk.length; i++) {
    //     switch (walk[i]) {
    //         case 'n' :
    //             n++;
    //             break;
    //         case 'w':
    //             w++;
    //             break;
    //         case 'e':
    //             e++;
    //             break;
    //         case 's':
    //             s++;
    //             break;
    //     }
    // }
    console.log(set.size);
    console.log(walk.length);

    if(walk.length === 10 && set.size === 2 || walk.length === 10 && set.size === 5 ) {
        return (true);
    } else { return (false)}

}