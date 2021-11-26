export const TestObject = ({obj}) => {

    return (
        <table style={{borderCollapse: 'collapse'}}>
            <tbody>
            {Object.keys(obj).map((k, i) => {
                let val = obj[k];
                if(typeof val === 'object') {
                    val = `Object`
                }
                if(typeof val === 'array') {
                    val = `Array`
                }
                return (
                    <tr key={i}>
                        <td style={{padding:'2px 4px',border:'1px solid #CCC'}}>{k}</td>
                        <td style={{padding:'2px 4px',border:'1px solid #CCC'}}>{val}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}