export class Timer {
  constructor() {
    this.startTimestamp = 0
    this.endTimeStamp = 0
  }
  start() {
    this.startTimestamp = new Date() / 1000
  }
  stop() {
    this.endTimeStamp = new Date() / 1000
  }
  result() {
    return (this.endTimeStamp - this.startTimestamp) / 60
  }
}
