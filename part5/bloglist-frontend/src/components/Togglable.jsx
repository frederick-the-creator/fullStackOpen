import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef((props, ref) => {
    const [hideToggle, setHideToggle] = useState(true)

    const visibile = { display: hideToggle===true ? 'none' : '' }
    const hide = { display: hideToggle===false ? 'none' : '' }

    const handleToggle = () => {
        if (hideToggle===true) {
            setHideToggle(false)
        } else {
            setHideToggle(true)
        }

    }

    useImperativeHandle(ref, () => {
        return {
            handleToggle
        }
    })

    return (
        <div>
            <button style={hide} onClick={handleToggle}>New Blog</button>
            <div style={visibile}>
                {props.children}
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'

export default Togglable