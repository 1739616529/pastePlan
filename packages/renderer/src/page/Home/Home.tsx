import { useState, useEffect } from "react"
type PlanItem = {
	time: number
	type: string
	data: string | Blob
	url?: string
}

const { ipcRenderer } = window
function Home() {
	const [img_src, set_img_src] = useState('')
	const [plan_list, set_plan_list] = useState<PlanItem[]>([])
	useEffect(() => {
		console.log('useEff')
		ipcRenderer.removeAllListeners('home')
		ipcRenderer.on('home', () => {
			console.log(' 让我读取粘贴板')
		})
	}, [])
	async function get_Clipboard_data() {
		const clipboard_items = await window.navigator.clipboard.read()
		const item = clipboard_items[0]
		const type = item.types[0]
		const ret = await item.getType(type)
		const plan_item: PlanItem = {
			time: new Date().getTime(),
			type,
			data: ret
		}
		switch (type) {
			case 'text/plain':
				plan_item.data = await ret.text()
				break
			case 'image/png':
				plan_item.url = URL.createObjectURL(ret)
				break
		}


		if (plan_list.length >= 20) plan_list.pop()
		plan_list.unshift(plan_item)
		set_plan_list([...plan_list])
	}


	function set_Clipboard_data() { }


	return (
		<div className="drag text-green-500 w-screen h-screen bg-gray-50 rounded-2xl box-border py-3 px-5 select-none">
			<button onClick={get_Clipboard_data} className="ring-4 ring-purple-400">读取</button>
			<button onClick={set_Clipboard_data} className="ring-4 ring-purple-400">写入</button>

			{plan_list.map(v => (<p key={v.time}>{v.time}</p>))}
		</div>
	)
}

export default Home