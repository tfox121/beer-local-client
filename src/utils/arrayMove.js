export default function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    // eslint-disable-next-line no-cond-assign
    while (k -= 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}
