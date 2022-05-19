
import { format_className } from 'src/util/tools'
interface props {
	icon: string
	className?: string
}

function Icon(props: props) {
	return (
		<svg className={format_className("overflow-hidden", props.className)} >
			<use xlinkHref={"#" + props.icon}></use>
		</svg>
	)
}

export default Icon