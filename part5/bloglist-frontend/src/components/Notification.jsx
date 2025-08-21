const Notification = ({ message, sentiment }) => {
    if (message === null) {
        return
    }

    const notificationStyle = sentiment === 'positive' ? { color: 'green' } : { color: 'red' }


    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

export default Notification