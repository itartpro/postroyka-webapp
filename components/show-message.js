export default function ShowMessage(props) {

    const removeMessage = () => props.handleMessage(null)

    const typeStyle = arr => {
        if(arr[1] !== undefined) {
            if(arr[1] === "red") {
                return {
                    background: '#f0a2a2'
                }
            }

            if(arr[1] === "green") {
                return {
                    background: '#9dea9d'
                }
            }
        }
    }

    return (
        <div style={typeStyle(props.msgType)}>
            <p>{props.msgText}</p>
            <span onClick={removeMessage}>&#10006;</span>
            <style jsx>{`
                div {
                    position: fixed;
                    left: 50%;
                    top: 40%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    max-width: 900px;
                    boxShadow: 15px 15px 30px #cacaca, -15px -15px 30px white;
                    line-height: 160%;
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px auto;
                    word-break: break-word;
                }
                span {
                    position: absolute;
                    color: red;
                    background: #eee;
                    padding: 0 6px;
                    border-radius: 12px;
                    font-size: 1rem;
                    box-shadow: 0 2px 6px #777, inset 0 0 5px #DDD;
                    cursor: pointer;
                    top: 10px;
                    right: 10px;
                    transition: all .3s
                }  
                span:hover {
                     background: #AAA;
                     color: white;
                     box-shadow: 0 0 5px #777
                }              
            `}</style>
        </div>
    )
}