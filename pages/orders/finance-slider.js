import css from "./finance-slider.module.css";
import {useState} from 'react';
import PublicLayout from "components/public/public-layout";

const FinanceSlider = () => {
    const marks = [1000, 1500, 2000, 2500, 3000, 5000, 7000, 10000, 15000, 30000, 50000, 100000, 150000, 300000, 500000, 1000000, 1500000, 3000000, 10000000];
    const handleChange = e => setRangeValue(marks[e.target.value]);
    const [rangeValue, setRangeValue] = useState(0);
    return (
        <PublicLayout>
            <main className="col start max">
                <div>
                    <input
                        className={css.i1}
                        onChange={handleChange}
                        type={"range"}
                        min={0}
                        defaultValue={0}
                        max={marks.length - 1}
                        step={1}
                        list={"range-marks"}
                    />
                    <datalist id="range-marks">
                        {marks.map((e,i) => (
                            <option key={'sv'+i}>{i}</option>
                        ))}
                    </datalist>
                    <p>{rangeValue}</p>
                </div>
            </main>
        </PublicLayout>
    )
}