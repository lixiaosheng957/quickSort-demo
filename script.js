animationWarp = document.getElementById("animation-warp")

/**
 * 用于生成节点，每个节点表示一个数字
 * @param {*} arr 
 * 
 */
function generateNode(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 200 || arr[i] <= 0) {
            alert("值不能小于0或大于200")
            return false
        }
    }
    arr.forEach(ele => {
        const node = document.createElement('div')
        node.className = 'item'
        node.style.height = (ele * 3 / animationWarp.offsetHeight) * 100 + '%'
        const p = document.createElement('p')
        const value = document.createTextNode(ele)
        p.appendChild(value)
        node.appendChild(p)
        animationWarp.appendChild(node)
    })
    for (node of animationWarp.childNodes) {
        if (node.childNodes[0].offsetHeight > node.offsetHeight) {
            node.childNodes[0].style.bottom = "100%"
        }
    }
    return true
}

/**
 * 返回快速排序的包含每一趟动画的二维数组
 * @param {*} arrDom 传入一个dom数组
 * @returns  返回一个二维数组
 */
function quickSort(arrDom) {
    const arr = []
    const animationArr = []
    for (let i = 0; i < arrDom.length; i++) {
        arr.push(Number(arrDom[i].textContent))
    }
    quickSortFrameGenerate(arr, 0, arr.length - 1, animationArr)
    console.log(animationArr)
    return animationArr
}


/**
 * 生成动画帧
 * @param {*} array 
 * @param {*} low 数组的起始
 * @param {*} height 数组的最后元素的索引
 * @param {*} animationArr 帧二维数组
 */
function quickSortFrameGenerate(array, low, height, animationArr) {
    if (low < height) {
        let mid = partition(array, low, height, animationArr)
        quickSortFrameGenerate(array, low, mid - 1, animationArr)
        quickSortFrameGenerate(array, mid + 1, height, animationArr)
    }
}

/**
 * 分区操作
 * @param {*} array 目标数组
 * @param {*} i 左端
 * @param {*} j 右端
 * @param {*} animationArr 帧二维数组 
 * @returns 返回临界值 
 */
function partition(array, i, j, animationArr) {
    let pivot = array[i]
    let mid = i
    const animationStep = []
    animationStep.push({
        currentArrStart: i,
        currentArrEnd: j
    })
    animationStep.push({
        pivot: i
    })
    for (let k = i + 1; k <= j; k++) {
        animationStep.push({
            checked: k
        })
        if (array[k] < pivot) {
            mid++
            swap(k, mid, array, animationStep)
            animationStep.push({
                lessThanPivot: mid
            })
        } else {
            animationStep.push({
                morethanPivot: k
            })
        }
    }
    swap(i, mid, array, animationStep)
    animationArr.push(animationStep)
    return mid
}

/**
 * 交换值的辅助函数
 * @param {*} a 要交换的值
 * @param {*} b 要交换的值  
 * @param {*} arr 发生交换的数组
 * @param {*} animationStep 帧数组
 */
function swap(a, b, arr, animationStep) {
    animationStep.push({
        swap: {
            swapIndex: a,
            beSwapIndex: b
        }
    })
    const tmp = arr[a]
    arr[a] = arr[b]
    arr[b] = tmp
}

/**
 * 
 * @param {*} arrDomBox 画布
 * @param {*} param1 帧信息
 */
function quickSortAnimationDom(arrDomBox, {
    currentArrStart = undefined,
    currentArrEnd = undefined,
    pivot = undefined,
    lessThanPivot = undefined,
    morethanPivot = undefined,
    checked = undefined,
    swap = undefined,
}) {
    if (lessThanPivot !== undefined) {
        // arrDomBox.childNodes[lessThanPivot].classList.remove("")
        arrDomBox.childNodes[lessThanPivot].classList.add("item-less-than-pivot")
    } else if (morethanPivot !== undefined) {
        arrDomBox.childNodes[morethanPivot].classList.add("item-more-than-pivot")
    } else if (checked !== undefined) {
        arrDomBox.childNodes[checked].classList.add("item-checked")
    }
    else if (pivot !== undefined) {
        arrDomBox.childNodes[pivot].classList.add("item-pivot")
    } else if (swap !== undefined) {
        // console.log(arrDomBox.childNodes[swap[swapIndex]])
        let a = arrDomBox.childNodes[swap['swapIndex']].cloneNode(true)
        let b = arrDomBox.childNodes[swap['beSwapIndex']].cloneNode(true)
        arrDomBox.replaceChild(b, arrDomBox.childNodes[swap['swapIndex']])
        arrDomBox.replaceChild(a, arrDomBox.childNodes[swap['beSwapIndex']])
    }
    else if (currentArrStart !== undefined && currentArrEnd !== undefined) {
        for (let i = currentArrStart; i <= currentArrEnd; i++) {
            arrDomBox.childNodes[i].classList.add("item-current")
        }
    }
}
class SortAnimation {
    constructor() {
        this.timer = 0
        this.arrDomBox = {}
        this.animationArr = []   //二维数组 
        this.speed = 500
        this.sortMethod = {}
        /**
         * 格式：{
         *        sortMethod:{
         *           method:quicksort,
         *           animationMethod:quickSortAnimationDom              
         *        }  
         *}
         */
        this.currentMethod = ''
    }
    getData(arrDomBox, method) {
        this.arrDomBox = arrDomBox
        this.currentMethod = method
        this.animationArr = this.sortMethod[method].method(arrDomBox.childNodes)
    }

    ownedMethod(methidObj) {
        this.sortMethod = methidObj
    }

    startAnimation() {
        return () => {
            if (this.animationArr.length == 0) {
                for (let i = 0; i < this.arrDomBox.childNodes.length; i++) {
                    this.arrDomBox.childNodes[i].classList.remove("item-pivot", "item-current", "item-checked", "item-less-than-pivot", "item-more-than-pivot")
                }
                clearTimeout(this.timer)
                this.timer = 0
            } else if (this.animationArr[0].length > 0) {
                this.sortMethod[this.currentMethod].animationMethod(this.arrDomBox, this.animationArr[0][0])
                this.animationArr[0].shift()
            } else {
                for (let i = 0; i < this.arrDomBox.childNodes.length; i++) {
                    this.arrDomBox.childNodes[i].classList.remove("item-pivot", "item-current", "item-checked", "item-less-than-pivot", "item-more-than-pivot")
                }
                this.animationArr.shift()
            }
        }
    }
}


const sa = new SortAnimation()


sa.ownedMethod({
    quickSort: {
        method: quickSort,
        animationMethod: quickSortAnimationDom
    }
})



const startBtn = document.querySelector('#start')
startBtn.addEventListener("click", () => {
    if (sa.timer) {
        return
    } else {
        if (animationWarp.childNodes.length > 0) {
            /**
             * 倒序删除节点解决正序遍历不能完全删除的情况
             */
            for (let i = animationWarp.childNodes.length - 1; i >= 0; i--) {
                animationWarp.childNodes[i].remove()
            }
        }
        const arr = document.querySelector("#input-array").value.split(",")
        if (generateNode(arr)) {
            sa.getData(animationWarp, "quickSort")
            sa.timer = setInterval(sa.startAnimation(), sa.speed)
        }
    }
})