"use client";
import "./loader.css";

const CustomLoader = ({
    text = "Gulf Coast Music",
    // backgroundColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}) => {
    return (
        <div
            className="loader-container"
        // style={{ background: backgroundColor }}
        >
            <div className="loader">
                {[...Array(9)].map((_, i) => (
                    <div className="text" key={i}>
                        <span>{text}</span>
                    </div>
                ))}
                <div className="line"></div>
            </div>
        </div>
    );
};

export default CustomLoader;