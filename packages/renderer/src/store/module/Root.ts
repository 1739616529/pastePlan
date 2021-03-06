import { makeAutoObservable } from "mobx";
import { OptionData, SetOption } from 'project/types/setting'
const { ipcRenderer } = window;


export class RootStore {
	option !: OptionData
	constructor() {
		makeAutoObservable(this)
		console.log('root store is constructor')
		ipcRenderer.invoke('getSetting').then((res: OptionData) => {
			this.option = res
		})
	}

	setOption: SetOption = (data) => {
		this.option = { ...this.option, ...data }
		ipcRenderer.send('setSetting', data)
	}
}
export default new RootStore()