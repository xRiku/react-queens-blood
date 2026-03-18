export default function transformMatrix(
  matrix: Array<Array<any>>
): Array<Array<any>> {
  return matrix.map((row: Array<any>) => row.reverse());
}
