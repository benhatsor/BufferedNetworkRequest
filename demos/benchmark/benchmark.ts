
import { JSONObjectStream } from '../../dist'


const statusEl = document.querySelector('.status')!


const startTime = performance.now()
let prevTime = startTime
let firstLoadTime: number | null = null


const response = await fetch('https://api.github.com/users/github/repos?per_page=100', {
    cache: 'no-store'
})

if (!response.ok || !response.body) {
    statusEl.textContent = `An error occured while fetching the response.`
    throw Error
}


const stream = new JSONObjectStream(response.body)

interface Repository { name: string }

let respRepos: Repository[] = []

for await (const objects of stream) {

    const repos = objects as Repository[]

    respRepos.push(...repos)

    const repoElements = repos.map(repo => {

        const el = document.createElement('p')
        el.textContent = repo.name

        return el

    })

    statusEl.append(...repoElements)


    const currTime = performance.now()
    const deltaTime = currTime - prevTime

    prevTime = currTime

    if (firstLoadTime === null) {
        firstLoadTime = currTime
    }

    const headingEl = document.createElement('h2')
    headingEl.textContent = `loaded ${objects.length} in +${round(deltaTime, 2)}ms`

    statusEl.appendChild(headingEl)


    scrollToBottom()

}


const currTime = performance.now()

let totalRequestTime = currTime - startTime

let timeToFirstLoad = totalRequestTime - (firstLoadTime ?? 0)
let improvementPercent = percentage(timeToFirstLoad, totalRequestTime)

totalRequestTime = formatTime(totalRequestTime)
timeToFirstLoad = formatTime(timeToFirstLoad)
improvementPercent = round(improvementPercent, 2)

const subHeadingEl = document.createElement('h3')
subHeadingEl.textContent = `done. (loaded ${respRepos.length} objects)`

const headingEl = document.createElement('h1')
headingEl.textContent = `time saved: ${improvementPercent}% (${timeToFirstLoad}s of ${totalRequestTime}s)`

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
