import css from "./marked-range-slider.module.css";

export const MarkedRangeSlider = ({marks, returnValue}) => {
    const handleChange = e => returnValue(marks[e.target.value]);
    return (
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
        </div>
    )
}