export default function Practice() {

    const arr = [
        {"man":"Bob"},
        2,
        "string",
        [1,2,15],
        true
    ];

    const mapExample = array => array.map(el => JSON.stringify(el));

    const newArr = mapExample(arr);

    console.log(newArr);
    console.log(newArr[0]);
    console.log(JSON.parse(newArr[0]));

    return (
        <div style={{padding:'30px'}}>
            <h1>Практика</h1>
            {arr.map((el, i) => (
                <div key={i}>{JSON.stringify(el)}<br/><br/></div>
            ))}
        </div>
    )
}