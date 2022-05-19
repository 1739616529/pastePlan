import React from 'react'
import { format_className } from 'src/util/tools'
import { createContext, useContext } from 'react'
interface FormProps {
	'label-wrap'?: boolean
	'label-width'?: string,
	children?: React.ReactNode
}
interface FormItemProps {
	label: string
	children?: React.ReactNode
}
const FormContext = createContext<FormProps>({
	'label-wrap': false
})
const internalForm = (props: FormProps) => {
	return (
		<FormContext.Provider value={props}>
			<form >
				{props.children}
			</form>
		</FormContext.Provider>
	)
}


const Item = (props: FormItemProps) => {
	console.log(props)
	const context = useContext(FormContext)
	return (
		<div className={format_className('flex items-center', context['label-wrap'] ? 'flex-col' : '')}>
			<label className={format_className(context['label-width'])} >{props.label}</label>
			{props.children}
		</div>

	)
}

type internalFormType = typeof internalForm
interface FormInterFace extends internalFormType {
	Item: typeof Item
}

const Form = internalForm as FormInterFace
Form.Item = Item
export default Form