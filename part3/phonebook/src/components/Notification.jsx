const Notification = ({message}) => {

    let color = 'green'
    if (message.sentiment != 'positive') {
        color = 'red'
    }

    const errorStyling = {
        fontWeight: 'bold',
        fontSize: '20px',
        border: 'solid',
        padding: '10px',
        color
    }

    if (message.text === '') {
        return null
    } else {
        return (
            <div style={errorStyling}>
                {message.text}
            </div>
        )
    }
}

export default Notification
