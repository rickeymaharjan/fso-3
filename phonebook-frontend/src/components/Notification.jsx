const Notification = ({message}) => {
        if (message == null) {
            return null
        }
        
        return (
            <div className="alert success-alert">
                <h3>{message}</h3>
            </div>
        )
}

export default Notification