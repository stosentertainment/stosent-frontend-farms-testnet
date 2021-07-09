import getTimePeriods from 'utils/getTimePeriods'

/* New weekly countdown helper, starts every Wednesday 8PM :: Starts Here */

let curday
let secTime
let ticker

const getDrawSeconds = () => {
  const dt = new Date();
  dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
  const offset = -300; // Timezone offset for EST in minutes.
  const nowDate = new Date(dt.getTime() + offset*60*1000)
  const dy = 6 // Sunday through Saturday, 0 to 6
  const countertime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 13, 0, 0) // 13 out of 24 hours = 1pm

  const curtime = nowDate.getTime() // current time
  const atime = countertime.getTime() // countdown time
  let diff = (atime - curtime) / 1000
  if (diff > 0) {
    curday = dy - nowDate.getDay()
  } else {
    curday = dy - nowDate.getDay()
  } // after countdown time
  if (curday < 0) {
    curday += 7
  } // already after countdown time, switch to next week
  if (diff <= 0) {
    diff += 86400 * 7
  }
  startDrawTimer(diff)
}

const getSalesSeconds = () => {
  const dt = new Date();
  dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
  const offset = -300; // Timezone offset for EST in minutes.
  const nowDate = new Date(dt.getTime() + offset*60*1000)
  const dy = 6 // Sunday through Saturday, 0 to 6
  const countertime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 12, 0, 0) // 13 out of 24 hours = 1pm

  const curtime = nowDate.getTime() // current time
  const atime = countertime.getTime() // countdown time
  let diff = (atime - curtime) / 1000
  if (diff > 0) {
    curday = dy - nowDate.getDay()
  } else {
    curday = dy - nowDate.getDay()
  } // after countdown time
  if (curday < 0) {
    curday += 7
  } // already after countdown time, switch to next week
  if (diff <= 0) {
    diff += 86400 * 7
  }
  startSalesTimer(diff)
}

const startDrawTimer = (secs) => {
  secTime = parseInt(secs)
  ticker = setInterval(() => {
    drawTick()
  }, 1000)
  drawTick() // initial count display
}

const drawTick = () => {
  let secs = secTime
  if (secs > 0) {
    secTime--
  } else {
    clearInterval(ticker)
    getDrawSeconds() // start over
  }

  const days = Math.floor(secs / 86400)
  secs %= 86400
  const hours = Math.floor(secs / 3600)
  secs %= 3600
  const mins = Math.floor(secs / 60)
  secs %= 60


  return { days: curday, hours, mins }
}

const startSalesTimer = (secs) => {
  secTime = parseInt(secs)
  ticker = setInterval(() => {
    salesTick()
  }, 1000)
  salesTick() // initial count display
}

const salesTick = () => {
  let secs = secTime
  if (secs > 0) {
    secTime--
  } else {
    clearInterval(ticker)
    getSalesSeconds() // start over
  }

  const days = Math.floor(secs / 86400)
  secs %= 86400
  const hours = Math.floor(secs / 3600) - 1
  secs %= 3600
  const mins = Math.floor(secs / 60)
  secs %= 60


  return { days: curday, hours, mins }
}
/* New weekly countdown helper, starts every Wednesday 8PM :: Ends Here */

// lottery draws UTC: 02:00 (10:00 SGT), 14:00 (22:00 SGT)
const lotteryDrawHoursUtc = [2, 14]

const getClosestLotteryHour = (currentHour) => {
  switch (true) {
    case currentHour < lotteryDrawHoursUtc[0] || currentHour >= lotteryDrawHoursUtc[1]:
      return lotteryDrawHoursUtc[0]
    case currentHour < lotteryDrawHoursUtc[1]:
      return lotteryDrawHoursUtc[1]
    default:
      return 0
  }
}

const getNextLotteryDrawTime = (currentMillis) => {
  const date = new Date(currentMillis)
  const currentHour = date.getUTCHours()
  const nextLotteryHour = getClosestLotteryHour(currentHour)
  // next lottery is tomorrow if the next lottery is at 2am UTC...
  // ...and current time is between 02:00am & 23:59pm UTC
  const nextLotteryIsTomorrow = nextLotteryHour === 2 && currentHour >= 2 && currentHour <= 23
  let millisTimeOfNextDraw

  if (nextLotteryIsTomorrow) {
    const tomorrow = new Date(currentMillis)
    const nextDay = tomorrow.getUTCDate() + 1
    tomorrow.setUTCDate(nextDay)
    millisTimeOfNextDraw = tomorrow.setUTCHours(nextLotteryHour, 0, 0, 0)
  } else {
    millisTimeOfNextDraw = date.setUTCHours(nextLotteryHour, 0, 0, 0)
  }

  return millisTimeOfNextDraw
}

// @ts-ignore
const getNextTicketSaleTime = (currentMillis) => (parseInt(currentMillis / 3600000) + 1) * 3600000
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`
const daysHoursAndMinutesString = (days, hours, mins) => `${parseInt(days)}d, ${parseInt(hours)}h, ${parseInt(mins)}m`

export const getTicketSaleTime = (): string => {
  const { days, hours, mins } = salesTick()
  return daysHoursAndMinutesString(days, hours, mins)
}

export const getLotteryDrawTime = (): string => {
  const { days, hours, mins } = drawTick()
  return daysHoursAndMinutesString(days, hours, mins)
}

export const getTicketSaleStep = () => (1 / 12) * 100

export const getLotteryDrawStep = (currentMillis) => {
  const msBetweenLotteries = 43200000
  const endTime = getNextLotteryDrawTime(currentMillis)
  const msUntilLotteryDraw = endTime - currentMillis
  const percentageRemaining = (msUntilLotteryDraw / msBetweenLotteries) * 100
  return 100 - percentageRemaining
}
