import usernames from "../../data/usernames";

export function generateUsername () {
    let n = usernames[Math.floor(Math.random() * usernames.length)].replace(/ /g, "")
    const end = Math.floor(Math.random() * 999) + 100;
    n = n + "" + end.toString();
    return n;
}

export function storage(newData = {}) {
    if (typeof window !== "undefined") {
        try {
            const currentData = JSON.parse(window.localStorage.getItem("maskedquiz") || JSON.stringify({}))
            const tempCurrentDataString = JSON.stringify(currentData);
            Object.keys(newData).forEach(function (key){
                currentData[key] = newData[key];
            })
            if (tempCurrentDataString !== JSON.stringify(currentData)) {
                window.localStorage.setItem("maskedquiz", JSON.stringify(currentData));
            }
            return currentData;
        } catch (e){
            return newData;
        }
    }
    return {};
}

export function getContainScale(p = {}) {
    const {containerWidth, containerHeight, imageWidth, imageHeight} = p;
    if (!containerWidth || !containerHeight || !imageWidth || !imageHeight) {
        return 1;
    }
    const widthScale = containerWidth / imageWidth;
    const heightScale = containerHeight / imageHeight;
    if (widthScale <= heightScale) {
        return widthScale;
    } else {
        return heightScale;
    }
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getDuration(step = 0, length = 10) {

    const minDuration = 4000;
    const maxDuration = 10000;

    if (step >= length) {
        return minDuration;
    }
    if (step <= 0) {
        return maxDuration;
    }

    const stages = 5;
    const stageDuration = (maxDuration - minDuration) / stages;
    const lengthStep = Math.round(length/stages);
    let stage = 1;

    [...Array(stages).keys()].forEach(function (n, i) {
        const min = n*lengthStep;
        const max = ((n+1)*lengthStep)
        if (((step) >= min && (step) < max) || step > max){
            stage = i + 1;
        }
    })

    return maxDuration - (((stage - 1) * stageDuration))
}
