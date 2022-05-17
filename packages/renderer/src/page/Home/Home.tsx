
function Home() {

	function getMousePx() {

	}
	return (
		<div className="text-green-500 w-screen h-screen bg-gray-50 rounded-2xl box-border py-3 px-5 select-none">
			<button onClick={getMousePx} className="ring-4 ring-purple-400">获取 鼠标位置</button>
		</div>
	)
}

export default Home