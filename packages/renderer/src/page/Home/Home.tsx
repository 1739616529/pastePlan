import { useState, useEffect } from "react"
import { PlanItem } from 'project/types/planList'
import Icon from "src/components/Icon/Icon"
const { ipcRenderer } = window

import { format_className } from "src/util/tools"



function Home() {
	const [plan_list, set_plan_list] = useState<PlanItem[]>([])
	useEffect(() => {
		console.log('useEff')
		ipcRenderer.removeAllListeners('home')
		ipcRenderer.on('home', (e, { type, data }) => {
			if (type = 'clipboardData') set_plan_list(data)
		})
	}, [])

	function handle_plan_click(time: number) {
		ipcRenderer.send('save-clipboard-data', time)
	}

	return (
		<div className="drag text-sm font-medium flex flex-col overflow-hidden  w-screen h-screen bg-gray-50 dark:text-gray-400 dark:bg-gray-800  box-border py-1 px-1 select-none">



			<div className=" flex mb-1 ">
				<div className="rounded-md   hover:bg-gray-500  hover:bg-opacity-10  p-1 mr-1 ">
					<Icon icon="icon-relieve-full" ></Icon>
				</div>
			</div>






			<div className="flex-1 overflow-y-auto hidden-scroll-bar px-2 py-1">
				{plan_list.map(v => (
					<div onClick={() => {
						handle_plan_click(v.time)
					}} key={v.time} className="w-full hover:ring-1 mb-2 rounded-lg bg-gray-300 h-24 dark:bg-gray-900  overflow-hidden" >
						{v.type === 'text'
							? <div className="p-2 w-full h-full" children={v.data}></div>
							: v.type === 'image'
								? <div className="w-full h-full p-1  flex items-center justify-center">
									<img className="max-h-full max-w-full  w-full h-full object-fit-contain" src={v.data} />
								</div>
								: ''
						}

					</div>


				))}







			</div>





			<div></div>
		</div>
	)
}

export default Home