// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function randomOfList(items: any[]): any {
  const index = Math.floor(Math.random()*items.length)
  console.log(index, items.length)
  return items[index]
}
