const arr = [1,2,3,4,5]

arr.forEach((i) => {
  if (i === 2 || i === 3) return
  console.log(i)
})
