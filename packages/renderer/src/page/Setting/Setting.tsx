import { useState } from "react"
import { format_className } from "src/util/tools"
import Icon from "src/components/Icon/Icon"
import Form from "src/components/Form/Form"
import { OptionDefaultData } from 'project/types/setting'
enum icons {
	'icon-shezhi' = 'icon-shezhi',
	"icon-kuaijiejian-" = 'icon-kuaijiejian-'
}
interface menu {
	label: string
	icon: icons
}
const menus: menu[] = [
	{ label: '设置', icon: icons['icon-shezhi'] },
	{ label: '快捷键', icon: icons["icon-kuaijiejian-"] },
]

const { ipcRenderer } = window








let option: OptionDefaultData | undefined
function get_option_fun(cb: (option: OptionDefaultData) => void) {
	if (option) return cb(option)
	ipcRenderer.invoke('getSetting').then((val: OptionDefaultData) => {
		option = val
		cb(val)
	})
}








function Setting() {
	const [active_menu, set_active_menu] = useState<icons>(menus[0].icon)
	const [options, set_options] = useState<OptionDefaultData | null>(null)





	if (options === null) {
		get_option_fun((val) => {
			set_options(val)
		})
	}


	function key_down_fun(fu: (string: string[]) => void) {
		const keys: string[] = []
		function is_fun_key(key: string): boolean {
			return key === 'Tab' || key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta' || key === 'Command'
		}
		return function (e: KeyboardEvent) {
			let { key } = e
			let pop_data: string | undefined
			console.log(e)



			// 第一个不是 功能键
			if (keys.length === 0 && !is_fun_key(key)) return


			// 最大只能三个组合键
			if (keys.length >= 3) return


			// 是否有 
			if (keys.indexOf(key) !== -1) return


			// 换成 mac command 键
			if (key === 'Meta') key = 'Command'

			// 最后一个是 功能键
			if (keys.length === 2 && is_fun_key(key)) {

				// 第二个是功能键
				if (is_fun_key(keys[2])) return


				pop_data = keys.pop()
			}



			keys.push(key)
			if (pop_data) keys.push(pop_data)

			fu(keys)

		}
	}






	return (


		<div className="relative  select-none w-screen h-screen drag flex text-sm font-medium text-white" >


			<div className="flex bg-black bg-opacity-40 flex-col justify-center items-center" style={{ "width": '69px' }}>


				{
					menus.map(v => (<div onClick={() => {
						set_active_menu(v.icon)
					}} key={v.icon} className={format_className("my-3 text-center", active_menu === v.icon ? 'text-blue-600' : '')}>
						<Icon icon={v.icon} className="w-6 h-6 mx-auto " />
						<span>{v.label}</span>
					</div>))

				}


			</div>




			<div className="flex-1 bg-black bg-opacity-60 flex  items-center px-20 relative">



				<div className={format_className(active_menu === icons['icon-shezhi'] ? 'block' : 'hidden')}>
					<Form label-wrap={false}  >
						<Form.Item label="开机启动： " ><input type="checkbox" /></Form.Item>
					</Form>
				</div>



				<div className={format_className(active_menu === icons['icon-kuaijiejian-'] ? 'block' : 'hidden')}>

					<Form label-wrap={false}  >
						<Form.Item label="打开粘贴板：" ><div tabIndex={0} onFocus={() => {
							window.onkeydown = key_down_fun((val) => {
								console.log(val)
							})
						}} onBlur={() => {
							window.onkeydown = null
						}} className="rounded outline-none px-1 ring-opacity-50 bg-gray-700 ring-0 ring-white focus:ring-4" >{options?.showHomeShortcut}</div>
						</Form.Item>
					</Form>
					<div className="absolute left-0 right-0 bottom-10 text-gray-400 text-xs text-center">
						<p>先输入功能键（contral shift command alt） 再输入普通字母</p>
						<p>第一个必须是功能键 最后一个不能是功能键</p>
					</div>
				</div>



			</div>






		</div >
	)
}

export default Setting