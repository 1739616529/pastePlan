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
			console.log(val)
		})
	}








	return (<div className="relative  select-none w-screen h-screen drag flex text-sm font-medium text-white" >
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




		<div className="flex-1 bg-black bg-opacity-60 flex justify-center items-center">
			<div className={format_className("w-3/5 ", active_menu === icons['icon-shezhi'] ? 'block' : 'hidden')}>
				<Form label-wrap={false}  >
					<Form.Item label="开机启动： " ><input type="checkbox" /></Form.Item>
				</Form>
			</div>
			<div className={format_className("w-3/5", active_menu === icons['icon-kuaijiejian-'] ? 'block' : 'hidden')}></div>
		</div>
	</div >)
}

export default Setting