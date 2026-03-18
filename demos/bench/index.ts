
import { JSONObjectStream } from 'bufferednetworkrequest'


const statusEl = document.querySelector('.status')!


const startTime = performance.now()
let prevTime = startTime
let firstLoadTime: number | null = null


const response = await fetch('https://jsonplaceholder.typicode.com/photos', {
    cache: 'no-store'
})

if (!response.ok || !response.body) {
    statusEl.textContent = `An error occured while fetching the response.`
    throw Error
}


const stream = new JSONObjectStream(response.body)

let respObjects: object[] = []

for await (const objects of stream) {

    respObjects.push(...objects)

    const objectElements = objects.map(object => {

        const el = document.createElement('code')
        el.textContent = JSON.stringify(object)

        return el

    })

    statusEl.append(...objectElements)


    const currTime = performance.now()
    const deltaTime = currTime - prevTime

    prevTime = currTime

    firstLoadTime ??= currTime


    const headingEl = document.createElement('h2')
    headingEl.textContent = `loaded ${objects.length} in +${round(deltaTime, 2)}ms`

    statusEl.appendChild(headingEl)


    scrollToBottom()

}


const currTime = performance.now()

let totalRequestTime = currTime - startTime
let timeSaved = currTime - firstLoadTime!

let improvementPercent = percentage(timeSaved, totalRequestTime)

totalRequestTime = formatTime(totalRequestTime)
timeSaved = formatTime(timeSaved)
improvementPercent = round(improvementPercent, 2)

const subHeadingEl = document.createElement('h3')
subHeadingEl.textContent = `done. (loaded ${respObjects.length} objects)`

const headingEl = document.createElement('h1')
headingEl.textContent = `time saved: ${improvementPercent}% (${timeSaved}s of ${totalRequestTime}s)`

statusEl.append(subHeadingEl, headingEl)

scrollToBottom()


console.info('[done] response', response)



function formatTime(time: number) {
    return round(time / 1000, 2)
}

function round(value: number, decimalPoints: number) {
    const multiplier = Math.pow(10, decimalPoints || 0)
    return Math.round(value * multiplier) / multiplier
}

function percentage(partialValue: number, totalValue: number) {
    return (100 * partialValue) / totalValue
}

function scrollToBottom() {
    document.body.scrollIntoView({
        block: 'end'
    })
}
