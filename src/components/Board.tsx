
export default function Board() {
  const rows = 3;
  const cols = 7;
  const tiles = [];

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      const color = (i + j) % 2 === 0 ? 'bg-white' : 'bg-black';
      if (j === 0) {
        tiles.push(<div className={`bg-white h-60 w-full flex items-center justify-center border-solid border-2 border-black`} key={`${i}-${j}`}>
          <div className="h-28 w-28 border-solid border-4 text-3xl border-green-300 rounded-full flex justify-center items-center">0</div>
        </div>);
        continue;
      }
      if (j === cols - 1) {
        tiles.push(<div className={`bg-white h-60 w-full flex items-center justify-center border-solid border-2 border-black`} key={`${i}-${j}`}>
          <div className="h-28 w-28 border-solid border-4 text-3xl border-red-300 rounded-full flex justify-center items-center">0</div>
        </div>);
        continue;
      }
      if (j === 1) {
        tiles.push(<div className={`${color} h-60 w-full border-solid flex justify-center items-center border-2 border-black`} key={`${i}-${j}`}>
          <div className="text-5xl font-bold text-center">♟</div>
        </div>);
        continue;
      }
      if (j === cols - 2) {
        tiles.push(<div className={`${color} h-60 w-full border-solid flex justify-center items-center border-2 border-black`} key={`${i}-${j}`}>
          <div className="text-5xl font-bold text-center">♟</div>
        </div>);
        continue;
      }
      tiles.push(<div className={`${color} h-60 w-full border-solid border-2 border-black`} key={`${i}-${j}`}></div>);
    }
  }
  return (
    <div className="flex w-full items-center justify-center mt-10">
      <div className="grid grid-cols-7 gap-1 w-10/12">
        {tiles}
      </div>  
    </div>
  ) 
} 