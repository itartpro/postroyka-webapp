export const errMsg = (e, maxLength = 0, ) => {
    if (!e) return null;

    if (e.message !== "") return (
        <small>{e.message}</small>
    );

    if (e.type === "required") return (
        <small>Поле "{e.ref.placeholder || e.ref.dataset.label || e.ref.name}" необходимо заполнить</small>
    );

    if (e.type === "maxLength") return (
        <small>У поля "{e.ref.placeholder || e.ref.name}" максимальная длинна {maxLength} символов</small>
    );
}