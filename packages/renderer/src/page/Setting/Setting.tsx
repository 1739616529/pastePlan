import { useState } from "react"
import { format_className } from "src/util/tools"
import Icon from "src/components/Icon/Icon"
import Form from "src/components/Form/Form"
import { OptionDefaultData, option_item, OptionData } from 'project/types/setting'
import { debounce } from 'project/packages/util/tools'
enum icons {
	'icon-shezhi' = 'icon-shezhi',
	"icon-kuaijiejian-" = 'icon-kuaijiejian-'
}
interface menu {
	label: string
	icon: icons
}
const menus: menu[] = [
	{ label: '通用', icon: icons['icon-shezhi'] },
	{ label: '快捷键', icon: icons["icon-kuaijiejian-"] },
]

const { ipcRenderer } = window



const defaultOptions: OptionDefaultData = {
	selfStart: false, showHomeShortcut: ['Command', "Alt", "U"]
}


let db_option: OptionData


function Setting() {
	const [active_menu, set_active_menu] = useState<icons>(menus[0].icon)
	const [options, set_options] = useState<OptionDefaultData>(defaultOptions)


	// 后端获取配置
	if (!db_option) {
		ipcRenderer.invoke('getSetting').then((val) => {
			set_options(val)
			db_option = val
			console.log(val)
		})
	}




	const set_options_fun: option_item = (data) => {
		set_options((state) => {
			return { ...state, ...data }
		})

	}

	const set_option_to_db: option_item = (data) => {
		ipcRenderer.send('setSetting', data)
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


			key = key.charAt(0).toUpperCase() + key.slice(1)
			keys.push(key)
			if (pop_data) keys.push(pop_data)

			fu(keys)

		}
	}



	function self_start_change(e: React.ChangeEvent<HTMLInputElement>) {
		const data = { selfStart: e.target.checked }
		set_options_fun(data)
		set_option_to_db(data)
	}






	return (


		<div className="relative  select-none w-screen h-screen drag flex text-sm font-medium text-white" >


			<div className="flex pt-10 bg-black bg-opacity-40 flex-col items-center" style={{ "width": '69px' }}>


				{
					menus.map(v => (<div onClick={() => {
						set_active_menu(v.icon)
					}} key={v.icon} className={format_className("my-2 text-center", active_menu === v.icon ? 'text-blue-600' : '')}>
						<Icon icon={v.icon} className="w-6 h-6 mx-auto " />
						<span>{v.label}</span>
					</div>))

				}


			</div>




			<div className="flex-1 bg-black bg-opacity-60 pt-16 items-center  relative">



				<div className={format_className('mx-auto w-max', active_menu === icons['icon-shezhi'] ? 'block' : 'hidden')}>
					<Form label-wrap={false}  >



						<Form.Item label="开机启动： " >
							<label htmlFor="self-start-switch" className="inline-flex relative items-center cursor-pointer">



								<input type="checkbox" checked={options.selfStart} value="" onChange={self_start_change} id="self-start-switch" className="sr-only peer" />



								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-checked:ring-4 ring-blue-300 dark:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
								<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
							</label>
						</Form.Item>



					</Form>
				</div>



				<div className={format_className('mx-auto w-max', active_menu === icons['icon-kuaijiejian-'] ? 'block' : 'hidden')}>

					<Form label-wrap={false}  >
						<Form.Item label="打开粘贴板： " ><div tabIndex={0} onFocus={() => {
							window.onkeydown = key_down_fun((val) => {
								set_options_fun({ 'showHomeShortcut': val })
							})
						}} onBlur={() => {
							window.onkeydown = null
							set_option_to_db({ 'showHomeShortcut': options.showHomeShortcut })
						}} className="rounded outline-none px-1 ring-opacity-50 bg-gray-700 ring-0 ring-white focus:ring-4" >{options.showHomeShortcut.join('+')}</div>
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