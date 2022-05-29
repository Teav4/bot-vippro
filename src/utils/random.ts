// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function randomOfList(items: any[]): any {
  return items[Math.floor(Math.random()*items.length)]
}
