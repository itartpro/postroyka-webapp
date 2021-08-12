import { useState, useEffect } from "react";

const OPTIONS = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0,
};

export const useIsVisible = el => {
    const [isVisible, setIsVisible] = useState(false);
    const isBrowser = () => typeof window !== "undefined"

    useEffect(() => {
        if(!isBrowser || !el) return false;
        const observer = new IntersectionObserver((entries) =>
                entries[0].isIntersecting ? setIsVisible(true) : setIsVisible(false)
            , OPTIONS);
        observer.observe(el);
    }, [el]);

    return isVisible;
};